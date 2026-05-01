---
title: "Building Local RAG Systems"
course: "local-ai-privacy"
order: 5
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/local-ai-privacy/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 5 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Building Local <span class="accent">RAG Systems.</span></h1>
  <p class="sub">Retrieval-Augmented Generation -- give your local AI knowledge of your private documents without retraining the model.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How RAG works and why it's better than fine-tuning for most use cases</li>
    <li>Building a complete local RAG pipeline from documents to answers</li>
    <li>Prompt engineering for RAG -- reducing hallucination and improving accuracy</li>
    <li>Evaluating and improving RAG quality over time</li>
  </ul>
</div>

<div class="lesson-section">
<h2>What Is RAG?</h2>
<p>Retrieval-Augmented Generation combines two capabilities: <strong>retrieval</strong> (finding relevant documents from your collection) and <strong>generation</strong> (using an LLM to answer questions based on those documents). Instead of the model relying only on its training data, it references your actual documents to generate grounded answers.</p>
<p>Think of it as giving the AI an open-book exam. The model doesn't need to memorize your company's policies, financial data, or client records. It looks them up when asked, then formulates an answer based on what it found.</p>
<p><strong>RAG vs. fine-tuning:</strong> Fine-tuning permanently alters a model's weights using your data. RAG leaves the model unchanged and retrieves context at query time. For most use cases -- especially with private, frequently updated data -- RAG is superior: faster to set up, easier to update, and the data source is transparent and auditable.</p>
</div>

<div class="lesson-section">
<h2>The RAG Pipeline</h2>
<p>A local RAG system has five components. You built the first three in the previous lesson:</p>
<ol>
<li><strong>Document ingestion:</strong> Load and chunk your documents</li>
<li><strong>Embedding:</strong> Convert chunks to vectors with a local model</li>
<li><strong>Vector storage:</strong> Store in ChromaDB or similar</li>
<li><strong>Retrieval:</strong> Find the most relevant chunks for a given question</li>
<li><strong>Generation:</strong> Pass the retrieved chunks to an LLM as context, generate an answer</li>
</ol>

<div class="demo-container">
<h4>Complete Local RAG System</h4>
<pre><code>import chromadb
import requests

def embed(text):
    r = requests.post("http://localhost:11434/api/embed",
        json={"model": "nomic-embed-text", "input": text})
    return r.json()["embeddings"][0]

def ask_llm(question, context_chunks):
    context = "\n\n---\n\n".join(context_chunks)
    prompt = f"""Answer the question based ONLY on the following context.
If the context doesn't contain the answer, say "I don't have
enough information to answer that."

Context:
{context}

Question: {question}

Answer:"""
    r = requests.post("http://localhost:11434/api/generate",
        json={"model": "qwen2.5:14b", "prompt": prompt,
              "stream": False})
    return r.json()["response"]

# Setup (assuming documents already ingested)
client = chromadb.PersistentClient(path="./rag_db")
collection = client.get_collection("documents")

# RAG query
question = "What was our policy on remote work last quarter?"
results = collection.query(
    query_embeddings=[embed(question)], n_results=4)

answer = ask_llm(question, results["documents"][0])
print(answer)</code></pre>
</div>
</div>

<div class="lesson-section">
<h2>Prompt Engineering for RAG</h2>
<p>The prompt that wraps your retrieved context is the most important piece of the system. Bad prompts lead to hallucinations even with perfect retrieval. Good prompts ground the model in your data:</p>
<p><strong>The grounding instruction:</strong> Always include "Answer based ONLY on the provided context" or "If the context doesn't contain the answer, say so." This is your hallucination guardrail. Without it, the model will happily fill gaps with fabricated information.</p>
<p><strong>Source citation:</strong> Add "Cite which document(s) you used to answer" to your prompt. When the model references specific sources, you can verify accuracy.</p>
<p><strong>Structured output:</strong> For complex queries, structure the expected response: "Answer in this format: (1) Direct answer, (2) Supporting evidence from the documents, (3) Any caveats or limitations."</p>

<div class="tip-box">
<strong>The context window trap:</strong> Don't stuff too many chunks into the context. Most local models perform best with 3-5 relevant chunks (roughly 1,000-2,500 words of context). More context means more noise, longer inference time, and increased chance the model ignores relevant pieces. Quality of retrieval matters more than quantity.
</div>
</div>

<div class="lesson-section">
<h2>Handling Different Document Types</h2>
<p>Real-world documents come in many formats. Here's how to ingest each:</p>
<p><strong>PDF files:</strong> Use <code>pymupdf</code> (fitz) or <code>pdfplumber</code> for text extraction. For scanned PDFs, you'll need OCR via <code>pytesseract</code>.</p>
<pre><code>import fitz  # pymupdf
doc = fitz.open("report.pdf")
text = "".join([page.get_text() for page in doc])</code></pre>
<p><strong>Word documents:</strong> Use <code>python-docx</code> for .docx files.</p>
<p><strong>Markdown/text:</strong> Read directly -- these are the easiest to ingest.</p>
<p><strong>Spreadsheets:</strong> Convert each row to a text description. A CSV row like <code>Q1,Revenue,$500000,+15%</code> becomes "Q1 Revenue was $500,000, representing a 15% increase."</p>
<p><strong>Emails:</strong> Export as .eml or .mbox, parse with Python's <code>email</code> library. Embed subject + body as a single chunk.</p>

<div class="callout">
<strong>Preprocessing quality determines RAG quality.</strong> Spend time cleaning your documents before ingestion. Remove headers, footers, page numbers, watermarks, and formatting artifacts. A clean chunk produces a better embedding which produces a better retrieval which produces a better answer. Every step compounds.
</div>
</div>

<div class="lesson-section">
<h2>Evaluating and Improving RAG</h2>
<p>How do you know your RAG system is working well? Build a test set:</p>
<p><strong>Step 1:</strong> Write 20 questions that your documents should be able to answer. Include the correct answer and the source document for each.</p>
<p><strong>Step 2:</strong> Run each question through your RAG pipeline. Check: (a) Did retrieval find the right document? (b) Did the LLM generate the correct answer? (c) Did the LLM cite the right source?</p>
<p><strong>Step 3:</strong> Calculate your scores. Retrieval accuracy (% of times the right document was in the top 3), Answer accuracy (% of correct answers), Hallucination rate (% of answers containing fabricated information).</p>
<p><strong>Common fixes:</strong></p>
<ul>
<li>Retrieval misses: Try smaller chunks, different overlap, or a better embedding model</li>
<li>Wrong answers from right documents: Improve your prompt template</li>
<li>Hallucinations: Strengthen the grounding instruction, reduce context window size</li>
<li>Slow performance: Use a smaller generation model, reduce number of retrieved chunks</li>
</ul>
</div>

<QuizMC
  question="What is the primary advantage of RAG over fine-tuning for private data?"
  options='["RAG is faster at inference", "RAG is easier to update, keeps data transparent, and doesn't alter the model", "Fine-tuning always produces worse results", "RAG requires less disk space"]'
  answer="1"
/>

<QuizMC
  question="How many context chunks should you typically pass to a local LLM in a RAG system?"
  options='["1-2 chunks", "3-5 chunks", "10-15 chunks", "As many as possible"]'
  answer="1"
/>

<FlashDeck cards='[
  {"front": "What are the 5 components of a RAG pipeline?", "back": "1) Document ingestion, 2) Embedding, 3) Vector storage, 4) Retrieval (find relevant chunks), 5) Generation (LLM answers using retrieved context)"},
  {"front": "What is the most important RAG prompt instruction?", "back": "\"Answer based ONLY on the provided context. If the context doesn't contain the answer, say so.\" This prevents hallucination."},
  {"front": "How do you evaluate RAG quality?", "back": "Build a 20-question test set with known answers. Measure: Retrieval accuracy (right doc in top 3), Answer accuracy (correct answers), Hallucination rate (fabricated info)"},
  {"front": "Why does preprocessing quality matter for RAG?", "back": "Clean chunks produce better embeddings which produce better retrievals which produce better answers. Every step compounds quality (or lack of it)."},
  {"front": "How do you handle spreadsheets in a RAG system?", "back": "Convert each row to a natural language text description before embedding. Example: CSV row becomes 'Q1 Revenue was $500,000, representing a 15% increase.'"}
]' />

</div>