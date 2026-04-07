---
title: "Build a Network"
course: "ai-foundations"
order: 2
type: "lesson"
free: true
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-foundations/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 2 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Build a <span class="accent">Network.</span></h1>
  <p class="sub">How neurons connect into layers, and how data flows through them — with code you can run yourself.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How neurons connect to form layers</li>
    <li>The difference between input, hidden, and output layers</li>
    <li>Why architecture matters for what a network can learn</li>
    <li>What happens when data flows through a network</li>
  </ul>
</div>

<!-- SECTION 1: CONCEPT -->
<div class="lesson-section">
  <span class="section-label">The Concept</span>
  <h2 class="section-title">Layers are the architecture of intelligence.</h2>
  <p class="section-text">A single neuron can make simple decisions. But stack neurons into layers — input, hidden, output — and suddenly the network can recognize faces, translate languages, and write code. The architecture (how many layers, how they connect) determines what the network can learn.</p>

  <div style="display:grid;gap:.75rem;margin-top:1rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399;font-size:.88rem">Input Layer — the eyes and ears</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">The input layer receives raw data and passes it forward. For an image, each input neuron holds one pixel value. For text, each input holds a token embedding. The input layer does no computation — it is purely a data entry point. Its size is fixed by the data: a 28x28 pixel image needs 784 input neurons. A sentence with 50 tokens needs 50 input positions.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
      <strong style="color:#8b5cf6;font-size:.88rem">Hidden Layers — the pattern detectors</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Hidden layers are where the magic happens. Each layer builds on the previous one, detecting increasingly abstract patterns. In an image classifier: layer 1 finds edges, layer 2 combines edges into shapes, layer 3 combines shapes into object parts, layer 4 recognizes whole objects. Think of it as a detective building a case — first individual clues, then connections, then the full picture.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
      <strong style="color:#fb923c;font-size:.88rem">Output Layer — the decision maker</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">The output layer produces the final answer. For classification, you get one neuron per category — a cat/dog classifier has 2 output neurons. For regression (predicting a number), you get one output neuron. The output values are often converted to probabilities using <strong style="color:#e5e5e5">softmax</strong>, which ensures all outputs sum to 1.0 — so you can read them as confidence percentages.</p>
    </div>
  </div>

  <p class="section-text" style="margin-top:1.25rem">The number and size of layers defines what the network can learn:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.5;overflow-x:auto">
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">  NETWORK DEPTH vs CAPABILITY</span>

  Layers    What It Can Learn              Real Example
  ──────    ─────────────────              ────────────
  <span style="color:#34d399">1</span>         Linear boundaries              Is x > 5?
  <span style="color:#38bdf8">2-3</span>       Curves and simple patterns      Digit recognition
  <span style="color:#8b5cf6">5-20</span>      Complex visual patterns          Image classification
  <span style="color:#fb923c">50-100</span>    Abstract reasoning               Language understanding
  <span style="color:#ef4444">100+</span>      Deep abstraction                 GPT, Claude, DALL-E

  <span style="color:#71717a">More layers = more abstraction = more data needed</span>
  <span style="color:#71717a">GPT-4 has ~120 layers. Your brain has ~6 cortical layers.</span></code></pre>
</div>

  <div class="narration" style="margin-top:1rem">
    <strong>Architecture is everything.</strong> A shallow network with 2 layers can separate cats from dogs. A deep network with 100+ layers can understand language, generate images, and reason about abstract concepts. The same building blocks — neurons, weights, activations — but radically different capabilities depending on how you stack them.
  </div>
</div>

<!-- SECTION 1B: CODE — BUILDING A NETWORK IN PYTHON -->
<div class="lesson-section">
  <span class="section-label">The Code</span>
  <h2 class="section-title">A neural network in 15 lines of Python.</h2>
<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — a complete neural network forward pass</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> numpy <span style="color:#c084fc">as</span> np

<span style="color:#71717a"># Input: 3 features (e.g., pixel brightness values)</span>
X = np.array([<span style="color:#fb923c">0.5</span>, <span style="color:#fb923c">0.8</span>, <span style="color:#fb923c">0.2</span>])

<span style="color:#71717a"># Layer 1: 3 inputs → 4 hidden neurons</span>
W1 = np.random.randn(<span style="color:#fb923c">3</span>, <span style="color:#fb923c">4</span>) * <span style="color:#fb923c">0.5</span>   <span style="color:#71717a"># 3×4 weight matrix</span>
b1 = np.zeros(<span style="color:#fb923c">4</span>)                   <span style="color:#71717a"># 4 biases</span>
hidden = np.maximum(<span style="color:#fb923c">0</span>, X @ W1 + b1) <span style="color:#71717a"># ReLU activation</span>

<span style="color:#71717a"># Layer 2: 4 hidden → 2 outputs (cat vs dog)</span>
W2 = np.random.randn(<span style="color:#fb923c">4</span>, <span style="color:#fb923c">2</span>) * <span style="color:#fb923c">0.5</span>   <span style="color:#71717a"># 4×2 weight matrix</span>
b2 = np.zeros(<span style="color:#fb923c">2</span>)                   <span style="color:#71717a"># 2 biases</span>
logits = hidden @ W2 + b2            <span style="color:#71717a"># raw scores</span>

<span style="color:#71717a"># Softmax: convert raw scores to probabilities</span>
probs = np.exp(logits) / np.sum(np.exp(logits))
<span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"Cat: </span>{probs[<span style="color:#fb923c">0</span>]:.1%}<span style="color:#fbbf24">, Dog: </span>{probs[<span style="color:#fb923c">1</span>]:.1%}<span style="color:#fbbf24">"</span>)</code></pre>
</div>
<p style="font-size:.85rem;color:#71717a;margin-top:.5rem">The <code>@</code> operator is matrix multiplication — it computes every neuron's weighted sum in one shot. <code>np.maximum(0, ...)</code> is ReLU applied to the whole layer at once. That's the entire forward pass.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">PyTorch — the same network using a real ML framework</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> torch
<span style="color:#c084fc">import</span> torch.nn <span style="color:#c084fc">as</span> nn

<span style="color:#71717a"># Define the network architecture</span>
model = nn.Sequential(
    nn.Linear(<span style="color:#fb923c">3</span>, <span style="color:#fb923c">4</span>),    <span style="color:#71717a"># 3 inputs → 4 hidden neurons</span>
    nn.ReLU(),           <span style="color:#71717a"># activation</span>
    nn.Linear(<span style="color:#fb923c">4</span>, <span style="color:#fb923c">2</span>),    <span style="color:#71717a"># 4 hidden → 2 outputs</span>
    nn.Softmax(dim=<span style="color:#fb923c">0</span>)   <span style="color:#71717a"># convert to probabilities</span>
)

<span style="color:#71717a"># Forward pass</span>
X = torch.tensor([<span style="color:#fb923c">0.5</span>, <span style="color:#fb923c">0.8</span>, <span style="color:#fb923c">0.2</span>])
probs = model(X)
<span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"Cat: </span>{probs[<span style="color:#fb923c">0</span>]:.1%}<span style="color:#fbbf24">, Dog: </span>{probs[<span style="color:#fb923c">1</span>]:.1%}<span style="color:#fbbf24">"</span>)</code></pre>
</div>
<p style="font-size:.85rem;color:#71717a;margin-top:.5rem">PyTorch's <code>nn.Sequential</code> builds the exact same architecture — but handles backpropagation and training automatically. The numpy version shows you what happens inside; PyTorch is what you use in production.</p>
</div>

<!-- SECTION 1C: COMMON LAYER TYPES -->
<div class="lesson-section">
  <span class="section-label">Layer Types</span>
  <h2 class="section-title">Not all layers are created equal.</h2>
  <p class="section-text">The simple network above uses <strong style="color:#e5e5e5">dense layers</strong> (also called fully connected) where every neuron connects to every neuron in the next layer. But real networks use specialized layer types designed for different kinds of data:</p>

  <div style="display:grid;gap:.75rem;margin-top:.75rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399;font-size:.88rem">Dense (Fully Connected) — the general workhorse</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Every neuron connects to every neuron in the next layer. Good for tabular data (spreadsheets, databases). Simple and effective, but scales poorly for images because an image with 1000x1000 pixels would need 1 million connections per neuron. Used as the final layers in most networks.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
      <strong style="color:#8b5cf6;font-size:.88rem">Convolutional (CNN) — the image specialist</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Instead of connecting to every input, each neuron looks at a small patch (like a 3x3 window) and slides across the image. This makes CNNs excellent at finding visual patterns — edges, textures, shapes — regardless of where they appear. Used in image classification, object detection, and medical imaging.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
      <strong style="color:#fb923c;font-size:.88rem">Transformer (Attention) — the language genius</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Each token "pays attention" to every other token in the sequence, learning which words matter most for understanding each word. This is the architecture behind GPT, Claude, and every modern language model. The key innovation: unlike older approaches, transformers can process all words in parallel instead of one at a time.</p>
    </div>
  </div>
</div>

<!-- SECTION 2: ARCHITECTURE VISUALIZED -->
<div class="lesson-section">
  <span class="section-label">See It</span>
  <h2 class="section-title">What a neural network looks like.</h2>
  <p class="section-text">Every neural network follows this pattern: data enters the input layer, flows through hidden layers that find patterns, and arrives at the output layer which makes the decision.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.5;overflow-x:auto">
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">         INPUT          HIDDEN          OUTPUT</span>
<span style="color:#71717a">        (3 neurons)    (4 neurons)     (2 neurons)</span>

        ┌───┐
<span style="color:#38bdf8">  x₁</span> ──▶│ <span style="color:#34d399">h₁</span> │──┐
        └───┘  │      ┌───┐
        ┌───┐  ├─────▶│ <span style="color:#fb923c">y₁</span> │  <span style="color:#71717a">← P(cat) = 0.82</span>
<span style="color:#38bdf8">  x₂</span> ──▶│ <span style="color:#34d399">h₂</span> │──┤      └───┘
        └───┘  │
        ┌───┐  │      ┌───┐
<span style="color:#38bdf8">  x₃</span> ──▶│ <span style="color:#34d399">h₃</span> │──┼─────▶│ <span style="color:#fb923c">y₂</span> │  <span style="color:#71717a">← P(dog) = 0.18</span>
        └───┘  │      └───┘
        ┌───┐  │
        │ <span style="color:#34d399">h₄</span> │──┘
        └───┘

<span style="color:#71717a">  ↑ Each input          ↑ Each hidden         ↑ Output neurons</span>
<span style="color:#71717a">    connects to            neuron finds           give the final</span>
<span style="color:#71717a">    EVERY hidden           a different            prediction as</span>
<span style="color:#71717a">    neuron (fully          pattern in             probabilities</span>
<span style="color:#71717a">    connected)             the data               that sum to 1</span></code></pre>
</div>

  <p class="section-text">Every arrow represents a <strong style="color:#e5e5e5">weight</strong> — a number that gets adjusted during training. In the code above, <code>W1</code> contains 12 weights (3 inputs × 4 hidden neurons) and <code>W2</code> contains 8 weights (4 hidden × 2 outputs). Training means finding the right values for all 20 weights.</p>
</div>

<!-- SECTION 3: KNOWLEDGE CHECK -->
<div class="lesson-section">
  <span class="section-label">Knowledge Check</span>
  <h2 class="section-title">Test your understanding.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Network Architecture Concepts","cards":[{"front":"Input Layer","back":"The first layer of a neural network. It receives raw data — pixels, text, numbers — and passes it to the hidden layers for processing."},{"front":"Hidden Layer","back":"Middle layers that find patterns and intermediate representations. Each hidden layer builds on the previous one to detect increasingly complex features."},{"front":"Output Layer","back":"The final layer that makes the prediction or decision. For a cat/dog classifier, the output layer has one neuron per class."},{"front":"Forward Pass","back":"When data flows from input through hidden layers to output. Each neuron multiplies inputs by weights, adds bias, and applies an activation function."},{"front":"Network Architecture","back":"The structure of a neural network — how many layers, how many neurons per layer, how they connect. Architecture determines what the network can learn."}]}'></div>


<div data-learn="QuizMC" data-props='{"title":"Network Architecture","questions":[{"q":"Why do neural networks need hidden layers?","options":["To hide the computation from users","To find intermediate patterns that are too complex for a single layer","To reduce the amount of training data needed","To make the network smaller"],"correct":1,"explanation":"Hidden layers find intermediate representations — first layer might detect edges, second detects shapes, third detects objects. Each layer builds on the previous one to learn increasingly complex patterns."},{"q":"For a cats vs dogs image classifier, why do you need 2 output neurons?","options":["One for each pixel in the image","One outputs cat probability, the other outputs dog probability","Two outputs make the network faster","It is just a convention with no real purpose"],"correct":1,"explanation":"Each output neuron represents one class. The network learns to activate the cat neuron when it sees a cat and the dog neuron when it sees a dog. The outputs are often probabilities that sum to 1."}]}'></div>

  <div class="narration" style="margin-top:1.5rem">
    <strong>Neural networks are layers of neurons connected together.</strong> Input neurons receive data. Hidden neurons find patterns. Output neurons make decisions. The magic is in the connections — each one has a weight that gets adjusted during training.
  </div>
</div>

<!-- SECTION 3B: DATA FLOW RECAP -->
<div class="lesson-section">
  <span class="section-label">The Full Picture</span>
  <h2 class="section-title">Data flow from start to finish.</h2>
  <p class="section-text">Let's trace a single example through the entire network — from raw data to final prediction:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.5;overflow-x:auto">
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">  EXAMPLE: Classifying a 3-pixel "image" as cat or dog</span>

  <span style="color:#38bdf8">INPUT</span>:  pixel values [0.5, 0.8, 0.2]

  <span style="color:#34d399">HIDDEN LAYER</span> (4 neurons, each sees ALL inputs):
    h1 = ReLU(0.5×w1 + 0.8×w2 + 0.2×w3 + bias) = <span style="color:#34d399">0.62</span>
    h2 = ReLU(0.5×w4 + 0.8×w5 + 0.2×w6 + bias) = <span style="color:#34d399">0.00</span>  ← killed by ReLU
    h3 = ReLU(0.5×w7 + 0.8×w8 + 0.2×w9 + bias) = <span style="color:#34d399">0.91</span>
    h4 = ReLU(0.5×w10+ 0.8×w11+ 0.2×w12+ bias) = <span style="color:#34d399">0.15</span>

  <span style="color:#fb923c">OUTPUT LAYER</span> (2 neurons):
    cat = softmax(0.62×w13 + 0.00×w14 + 0.91×w15 + 0.15×w16 + bias)
    dog = softmax(0.62×w17 + 0.00×w18 + 0.91×w19 + 0.15×w20 + bias)

  <span style="color:#fb923c">RESULT</span>:  cat = <span style="color:#34d399">82%</span>, dog = <span style="color:#ef4444">18%</span>  → prediction: CAT

  <span style="color:#71717a">Total weights: 12 (input→hidden) + 8 (hidden→output) = 20</span>
  <span style="color:#71717a">Total biases: 4 (hidden) + 2 (output) = 6</span>
  <span style="color:#71717a">Total learnable parameters: 26</span></code></pre>
</div>

  <p class="section-text">This tiny network has 26 parameters. GPT-4 has an estimated 1.8 <em>trillion</em>. The architecture is the same — layers of neurons with weights and biases — just scaled up by a factor of 70 billion.</p>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/neural-net-quiz" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Neural Net Quiz →</a>
</div>

</div>

