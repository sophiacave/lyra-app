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
  <p class="sub">Drag neurons onto the canvas, connect them into layers, and watch data flow through your creation.</p>
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
</div>

<!-- SECTION 1B: CODE — BUILDING A NETWORK IN PYTHON -->
<div class="lesson-section">
  <span class="section-label">The Code</span>
  <h2 class="section-title">A neural network in 15 lines of Python.</h2>
  <p class="section-text">The drag-and-drop builder below lets you visualize it. But here is what the same thing looks like in actual code — a complete forward pass through a 2-layer network:</p>

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

<!-- SECTION 2: INTERACTIVE BUILDER -->
<div class="lesson-section">
  <span class="section-label">Build It</span>
  <h2 class="section-title">Drag, drop, connect, train.</h2>
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

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/neural-net-quiz" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Neural Net Quiz →</a>
</div>

</div>

