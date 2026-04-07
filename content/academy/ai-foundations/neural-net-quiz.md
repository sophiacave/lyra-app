---
title: "Neural Net Quiz"
course: "ai-foundations"
order: 3
type: "quiz"
free: true
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-foundations/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 3 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Neural Net <span class="accent">Quiz.</span></h1>
  <p class="sub">Test your understanding of neurons, weights, and network architecture.</p>
</div>

<div class="learn-card">
  <h3>This quiz covers</h3>
  <ul>
    <li>How neurons compute outputs</li>
    <li>The role of weights, biases, and activation functions</li>
    <li>How layers work together in a network</li>
    <li>Key vocabulary from lessons 1-2</li>
  </ul>
</div>

<!-- SECTION 0: CONCEPTS RECAP -->
<div class="lesson-section">
  <span class="section-label">Recap</span>
  <h2 class="section-title">Neural network concepts at a glance.</h2>
  <p class="section-text">Before you dive into the quiz, here is a quick visual recap of everything from Lessons 1 and 2. Think of a neural network as a factory assembly line: raw materials (data) enter on one end, get processed at each station (layer), and a finished product (prediction) comes out the other end.</p>

  <div style="display:grid;gap:.75rem;margin-top:.75rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399;font-size:.88rem">The Neuron — a tiny decision-maker</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Picture a judge at a talent show. Each performer (input) gets a score multiplied by how much the judge trusts their own taste in that genre (weight). The judge adds a personal bias — maybe they always lean generous — and then decides: does this act pass to the next round? That final yes/no decision is the activation function. Every neuron in a network does exactly this: <strong style="color:#e5e5e5">weighted sum + bias + activation = output</strong>.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
      <strong style="color:#8b5cf6;font-size:.88rem">Weights — the learned knowledge</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Weights are the numbers the network adjusts during training. Think of them as volume knobs on a mixing board. Some inputs get turned up loud (high weight = important), some get muted (low weight = unimportant), and some get inverted (negative weight = this input pushes the output down). Training is the process of finding the perfect setting for every knob.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
      <strong style="color:#38bdf8;font-size:.88rem">Bias — the baseline mood</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Without bias, a neuron with all-zero inputs always outputs zero. Bias is like a thermostat's default setting — it shifts the point at which the neuron "fires." A positive bias means the neuron is eager to activate; a negative bias makes it harder to trigger. This gives the network flexibility to fit patterns that do not pass through the origin.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
      <strong style="color:#fb923c;font-size:.88rem">Activation functions — the gatekeepers</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Activation functions introduce curves into what would otherwise be a straight-line calculation. <strong style="color:#e5e5e5">ReLU</strong> (the modern standard) is like a floor at zero: negative signals get silenced, positive signals pass through unchanged. <strong style="color:#e5e5e5">Sigmoid</strong> squashes everything into a 0-to-1 range — perfect for probabilities. Without these gates, stacking layers would be pointless — the whole network would collapse into a single linear equation.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444;font-size:.88rem">Layers — simple parts, complex whole</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">The <strong style="color:#e5e5e5">input layer</strong> receives raw data (pixels, numbers, text). <strong style="color:#e5e5e5">Hidden layers</strong> transform that data through learned patterns — first layer finds edges, second finds shapes, third finds objects. The <strong style="color:#e5e5e5">output layer</strong> makes the final prediction. More layers means the network can learn more complex representations, but also needs more data and compute to train.</p>
    </div>
  </div>

  <p class="section-text" style="margin-top:1.25rem">Here is the full flow visualized — data enters left, flows right, and a prediction emerges:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.5;overflow-x:auto">
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">  DATA FLOW THROUGH A NEURAL NETWORK</span>

  <span style="color:#38bdf8">Raw Data</span>          <span style="color:#34d399">Pattern Detection</span>        <span style="color:#fb923c">Decision</span>
  ─────────         ──────────────────        ──────────
  pixels     ──▶    edges → shapes    ──▶     "cat" (92%)
  numbers    ──▶    trends → clusters ──▶     "buy" (78%)
  words      ──▶    syntax → meaning  ──▶     "positive" (85%)

  <span style="color:#71717a">INPUT LAYER        HIDDEN LAYERS            OUTPUT LAYER</span>
  <span style="color:#71717a">(receives data)    (finds patterns)         (makes prediction)</span>

  <span style="color:#71717a">Each arrow = a weight (learned during training)</span>
  <span style="color:#71717a">Each node  = weighted sum + bias + activation</span>
  <span style="color:#71717a">Training   = adjusting ALL weights to reduce errors</span></code></pre>
</div>

  <div class="narration" style="margin-top:1rem">
    <strong>The key insight:</strong> each neuron is embarrassingly simple — just multiply, add, and decide. But millions of these simple decisions, connected in layers, produce intelligence. That is the miracle of neural networks. Now let's test how well you understand each piece.
  </div>
</div>

<!-- SECTION 1: CORE QUIZ -->
<div class="lesson-section">
  <span class="section-label">Part 1</span>
  <h2 class="section-title">Core concepts.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Neural Network Vocabulary","cards":[{"front":"Weight","back":"A number that determines how much influence an input has on a neuron\\\'s output. Weights are adjusted during training to reduce errors."},{"front":"Bias","back":"A constant added before the activation function. It shifts the decision boundary, letting the neuron fire even when all inputs are zero."},{"front":"Activation Function","back":"Introduces non-linearity — decides whether a neuron should fire based on its weighted sum + bias. Without it, networks could only learn straight-line patterns."},{"front":"Backpropagation","back":"The training algorithm. It calculates how much each weight contributed to the error, then nudges every weight in the direction that reduces the error."},{"front":"Overfitting","back":"When a network memorizes training data instead of learning general patterns. It performs well on training data but poorly on new, unseen data."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Neurons and Networks — 6 Questions","questions":[{"q":"What does a weight in a neural network represent?","options":["The physical size of a neuron","How much influence an input has on the output","The number of connections in the network","The speed at which data flows"],"correct":1,"explanation":"Weights determine how much each input contributes to the neuron output. Higher weights mean more influence — they are what the network adjusts during training."},{"q":"What is the role of a hidden layer?","options":["To store the training data","To display results to the user","To find patterns and intermediate representations in data","To reduce the network size"],"correct":2,"explanation":"Hidden layers transform input data through learned patterns. Each layer can detect increasingly complex features — from edges to shapes to objects."},{"q":"What does an activation function do?","options":["Turns the computer on","Decides whether a neuron should fire based on its input","Counts the number of neurons","Stores data permanently"],"correct":1,"explanation":"Activation functions introduce non-linearity — they decide if a neuron summed input is strong enough to pass a signal forward. Without them, the network could only learn linear patterns."},{"q":"Why is bias important in a neuron?","options":["It makes the network run faster","It lets the neuron fire even when all inputs are zero","It reduces the number of weights needed","It prevents the network from overfitting"],"correct":1,"explanation":"Without bias, a neuron with all-zero inputs always outputs zero (or the activation of zero). Bias shifts the decision boundary, giving the neuron flexibility to activate at different thresholds."},{"q":"What happens during training?","options":["New neurons are added to the network","The weights and biases are adjusted to reduce errors","The activation functions are changed","The input data is modified"],"correct":1,"explanation":"Training adjusts weights and biases so the network output gets closer to the correct answer. This happens through a process called backpropagation — computing how much each weight contributed to the error and nudging it in the right direction."},{"q":"A neural network with more layers can learn more complex patterns. What is the tradeoff?","options":["More layers always make the network better with no downsides","More layers need more data and compute, and risk overfitting","More layers make the network faster","More layers reduce the need for training data"],"correct":1,"explanation":"Deeper networks can represent more complex functions, but they need more training data, more compute power, and are more prone to overfitting (memorizing training data instead of learning general patterns)."}]}'></div>

</div>

<!-- SECTION 1B: TRAINING RECAP -->
<div class="lesson-section">
  <span class="section-label">Training Recap</span>
  <h2 class="section-title">How a network learns from its mistakes.</h2>
  <p class="section-text">Training is the process of adjusting weights and biases so the network gets better at its task. Here is the full loop, step by step:</p>

  <div style="display:grid;gap:.75rem;margin-top:.75rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399;font-size:.88rem">1. Forward Pass — make a prediction</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Data flows from input through hidden layers to the output. Each neuron computes its weighted sum + bias + activation. The final output is the network's prediction — maybe "92% cat, 8% dog." On the first try, this prediction is essentially random because the weights have not been trained yet.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
      <strong style="color:#8b5cf6;font-size:.88rem">2. Loss Calculation — measure the error</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Compare the prediction to the correct answer using a <strong style="color:#e5e5e5">loss function</strong>. If the network said "92% cat" but the image was a dog, the loss is high. If it said "95% dog," the loss is low. The loss function turns the error into a single number that the network can minimize.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
      <strong style="color:#fb923c;font-size:.88rem">3. Backpropagation — trace the blame</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Work backwards from the output to figure out which weights contributed most to the error. Each weight gets a "blame score" (technically called a gradient) that says how much it should change and in which direction. Weights that contributed a lot to the error get adjusted more.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
      <strong style="color:#38bdf8;font-size:.88rem">4. Weight Update — nudge toward correctness</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Adjust every weight by a tiny amount in the direction that reduces the error. The size of the adjustment is controlled by the <strong style="color:#e5e5e5">learning rate</strong> — too large and the network overshoots, too small and training takes forever. Then repeat: forward pass, loss, backprop, update. Millions of times.</p>
    </div>
  </div>

  <div class="narration" style="margin-top:1rem">
    <strong>That is the entire training loop.</strong> Forward pass (predict) → loss (measure error) → backpropagation (trace blame) → update (adjust weights) → repeat. Every AI model you have ever used — ChatGPT, Claude, Midjourney — learned through this exact process, billions of times over.
  </div>
</div>

<!-- SECTION 2: MATCH CONCEPTS -->
<div class="lesson-section">
  <span class="section-label">Part 2</span>
  <h2 class="section-title">Match the vocabulary.</h2>
<div data-learn="QuizMC" data-props='{"title":"Match the Concept","questions":[{"q":"Which component lets a neuron fire even when all inputs are zero?","options":["Weight","Activation function","Bias","Learning rate"],"correct":2,"explanation":"Bias is a constant added before the activation function. Without it, zero inputs always produce zero output. Bias shifts the activation threshold."},{"q":"What is the difference between ReLU and sigmoid?","options":["ReLU is faster but sigmoid is more accurate","ReLU outputs 0 or the input value; sigmoid squashes to 0-1","ReLU is older; sigmoid is the modern standard","There is no difference — they are the same function"],"correct":1,"explanation":"ReLU = max(0, z) — simple, fast, used in hidden layers. Sigmoid = 1/(1+e^-z) — squashes to 0-1, used for probability outputs. ReLU is the modern standard for hidden layers; sigmoid killed by vanishing gradients."}]}'></div>

</div>

<!-- SECTION 2B: COMMON MISTAKES -->
<div class="lesson-section">
  <span class="section-label">Common Pitfalls</span>
  <h2 class="section-title">Mistakes beginners make about neural networks.</h2>
  <p class="section-text">Before the final challenge, let's clear up the most common misconceptions about how neural networks work:</p>

  <div style="display:grid;gap:.75rem;margin-top:.75rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444;font-size:.88rem">Myth: "More layers always means better"</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Adding layers increases the network's capacity to learn complex patterns, but it also requires more training data and compute. A network that is too deep for the available data will <strong style="color:#e5e5e5">overfit</strong> — it memorizes the training examples instead of learning general patterns. A 3-layer network trained well on enough data often beats a 100-layer network trained poorly.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444;font-size:.88rem">Myth: "Neural networks understand like humans do"</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">A neural network that classifies cat photos does not "see" a cat the way you do. It detects statistical patterns in pixel values — edges, textures, shapes — that correlate with the label "cat." It has no concept of what a cat is, what it feels like to pet one, or that cats are alive. Pattern matching is powerful, but it is not understanding.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444;font-size:.88rem">Myth: "Training data doesn't matter — the architecture does everything"</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Architecture determines what the network <em>can</em> learn. Data determines what it <em>does</em> learn. A perfectly designed network trained on biased data will produce biased outputs. A network trained on too little data will overfit. A network trained on noisy, mislabeled data will learn noise. Data quality is at least as important as architecture quality.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444;font-size:.88rem">Myth: "AI neurons work like brain neurons"</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Artificial neurons were <em>inspired</em> by biological neurons, but they are radically simplified. A biological neuron uses electrochemistry, has timing-dependent behavior, and connects to about 7,000 other neurons on average. An artificial neuron is pure math: multiply, add, threshold. The inspiration was useful, but modern AI has diverged far from neuroscience.</p>
    </div>
  </div>

  <div class="narration" style="margin-top:1rem">
    <strong>Now you know the truth and the myths.</strong> The final section tests your understanding of the real mechanics — how neurons compute, how layers connect, and what makes networks powerful. Let's see what you've got.
  </div>
</div>

<!-- SECTION 3: PIXEL QUEST -->
<div class="lesson-section">
  <span class="section-label">Game Time</span>
  <h2 class="section-title">Collect the correct concepts.</h2>

<div data-learn="QuizMC" data-props='{"title":"Inside a Neural Network","questions":[{"q":"What happens inside a single artificial neuron?","options":["It stores training data for later","It multiplies inputs by weights, adds bias, then applies an activation function","It connects to the internet to fetch answers","It displays results to the user"],"correct":1,"explanation":"A neuron does math: weighted sum of inputs + bias, passed through an activation function. Simple individually, powerful in networks of millions."},{"q":"What are the three types of layers in a neural network?","options":["Speed, Storage, and Display layers","Input, Hidden, and Output layers","Fast, Medium, and Slow layers","Text, Image, and Audio layers"],"correct":1,"explanation":"Input layers receive data, hidden layers process it through learned patterns, and output layers produce the final result."},{"q":"What is the purpose of an activation function?","options":["To turn the computer on","To introduce non-linearity — allowing the network to learn complex patterns","To speed up training","To compress the output to save storage"],"correct":1,"explanation":"Without activation functions, a neural network is just linear algebra — it could only learn straight-line relationships. Activation functions let it learn curves, edges, and complex patterns."},{"q":"What does \"bias\" do in a neuron?","options":["Makes the AI biased toward certain answers","Shifts the activation threshold — letting the neuron fire even when inputs are zero","Speeds up computation","Connects the neuron to other layers"],"correct":1,"explanation":"Bias is a constant added before the activation function. It shifts when the neuron activates, giving the network more flexibility to fit data."}]}'></div>

</div>

<!-- SECTION 3B: KEY VOCABULARY SUMMARY -->
<div class="lesson-section">
  <span class="section-label">Vocabulary</span>
  <h2 class="section-title">Your neural network glossary.</h2>
  <p class="section-text">Keep this reference handy as you continue the course. These are the foundational terms that every AI concept builds on:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.5;overflow-x:auto">
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">  NEURAL NETWORK GLOSSARY</span>

  Term                 Definition
  ──────────           ──────────────────────────────────────
  <span style="color:#34d399">Neuron</span>               Weighted sum + bias + activation = output
  <span style="color:#38bdf8">Weight</span>               How much influence an input has (learned)
  <span style="color:#8b5cf6">Bias</span>                 Baseline nudge — lets neuron fire at zero input
  <span style="color:#fb923c">Activation fn</span>        Adds non-linearity (ReLU, Sigmoid, Step)
  <span style="color:#34d399">Input layer</span>          Receives raw data (pixels, numbers, tokens)
  <span style="color:#38bdf8">Hidden layer</span>         Finds patterns — edges, shapes, meanings
  <span style="color:#8b5cf6">Output layer</span>         Makes the final prediction/decision
  <span style="color:#fb923c">Forward pass</span>         Data flowing input → hidden → output
  <span style="color:#34d399">Loss function</span>        Measures how wrong the prediction was
  <span style="color:#38bdf8">Backpropagation</span>      Traces error back to each weight
  <span style="color:#8b5cf6">Gradient</span>             How much (and which direction) to adjust a weight
  <span style="color:#fb923c">Learning rate</span>        Size of each weight adjustment step
  <span style="color:#34d399">Epoch</span>                One full pass through all training data
  <span style="color:#38bdf8">Overfitting</span>          Memorizing data instead of learning patterns
  <span style="color:#8b5cf6">Softmax</span>              Converts raw scores to probabilities (sum = 1)
  <span style="color:#fb923c">Parameters</span>           Total weights + biases (GPT-4 ≈ 1.8 trillion)</code></pre>
</div>

  <div class="narration" style="margin-top:1rem">
    <strong>You now have the vocabulary to read any AI article and understand what they are talking about.</strong> These terms come up in every course, every tutorial, every research paper. You are no longer on the outside looking in — you speak the language.
  </div>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/anatomy-of-a-prompt" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Anatomy of a Prompt →</a>
</div>

</div>