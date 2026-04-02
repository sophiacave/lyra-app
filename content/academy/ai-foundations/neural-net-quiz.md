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

<!-- SECTION 1: CORE QUIZ -->
<div class="lesson-section">
  <span class="section-label">Part 1</span>
  <h2 class="section-title">Core concepts.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Neural Network Vocabulary","cards":[{"front":"Weight","back":"A number that determines how much influence an input has on a neuron\\\'s output. Weights are adjusted during training to reduce errors."},{"front":"Bias","back":"A constant added before the activation function. It shifts the decision boundary, letting the neuron fire even when all inputs are zero."},{"front":"Activation Function","back":"Introduces non-linearity — decides whether a neuron should fire based on its weighted sum + bias. Without it, networks could only learn straight-line patterns."},{"front":"Backpropagation","back":"The training algorithm. It calculates how much each weight contributed to the error, then nudges every weight in the direction that reduces the error."},{"front":"Overfitting","back":"When a network memorizes training data instead of learning general patterns. It performs well on training data but poorly on new, unseen data."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Neurons and Networks — 6 Questions","questions":[{"q":"What does a weight in a neural network represent?","options":["The physical size of a neuron","How much influence an input has on the output","The number of connections in the network","The speed at which data flows"],"correct":1,"explanation":"Weights determine how much each input contributes to the neuron output. Higher weights mean more influence — they are what the network adjusts during training."},{"q":"What is the role of a hidden layer?","options":["To store the training data","To display results to the user","To find patterns and intermediate representations in data","To reduce the network size"],"correct":2,"explanation":"Hidden layers transform input data through learned patterns. Each layer can detect increasingly complex features — from edges to shapes to objects."},{"q":"What does an activation function do?","options":["Turns the computer on","Decides whether a neuron should fire based on its input","Counts the number of neurons","Stores data permanently"],"correct":1,"explanation":"Activation functions introduce non-linearity — they decide if a neuron summed input is strong enough to pass a signal forward. Without them, the network could only learn linear patterns."},{"q":"Why is bias important in a neuron?","options":["It makes the network run faster","It lets the neuron fire even when all inputs are zero","It reduces the number of weights needed","It prevents the network from overfitting"],"correct":1,"explanation":"Without bias, a neuron with all-zero inputs always outputs zero (or the activation of zero). Bias shifts the decision boundary, giving the neuron flexibility to activate at different thresholds."},{"q":"What happens during training?","options":["New neurons are added to the network","The weights and biases are adjusted to reduce errors","The activation functions are changed","The input data is modified"],"correct":1,"explanation":"Training adjusts weights and biases so the network output gets closer to the correct answer. This happens through a process called backpropagation — computing how much each weight contributed to the error and nudging it in the right direction."},{"q":"A neural network with more layers can learn more complex patterns. What is the tradeoff?","options":["More layers always make the network better with no downsides","More layers need more data and compute, and risk overfitting","More layers make the network faster","More layers reduce the need for training data"],"correct":1,"explanation":"Deeper networks can represent more complex functions, but they need more training data, more compute power, and are more prone to overfitting (memorizing training data instead of learning general patterns)."}]}'></div>

</div>

<!-- SECTION 2: MATCH CONCEPTS -->
<div class="lesson-section">
  <span class="section-label">Part 2</span>
  <h2 class="section-title">Match the vocabulary.</h2>
<div data-learn="QuizMC" data-props='{"title":"Match the Concept","questions":[{"q":"Which component lets a neuron fire even when all inputs are zero?","options":["Weight","Activation function","Bias","Learning rate"],"correct":2,"explanation":"Bias is a constant added before the activation function. Without it, zero inputs always produce zero output. Bias shifts the activation threshold."},{"q":"What is the difference between ReLU and sigmoid?","options":["ReLU is faster but sigmoid is more accurate","ReLU outputs 0 or the input value; sigmoid squashes to 0-1","ReLU is older; sigmoid is the modern standard","There is no difference — they are the same function"],"correct":1,"explanation":"ReLU = max(0, z) — simple, fast, used in hidden layers. Sigmoid = 1/(1+e^-z) — squashes to 0-1, used for probability outputs. ReLU is the modern standard for hidden layers; sigmoid killed by vanishing gradients."}]}'></div>

</div>

<!-- SECTION 3: PIXEL QUEST -->
<div class="lesson-section">
  <span class="section-label">Game Time</span>
  <h2 class="section-title">Collect the correct concepts.</h2>

<div data-learn="QuizMC" data-props='{"title":"Inside a Neural Network","questions":[{"q":"What happens inside a single artificial neuron?","options":["It stores training data for later","It multiplies inputs by weights, adds bias, then applies an activation function","It connects to the internet to fetch answers","It displays results to the user"],"correct":1,"explanation":"A neuron does math: weighted sum of inputs + bias, passed through an activation function. Simple individually, powerful in networks of millions."},{"q":"What are the three types of layers in a neural network?","options":["Speed, Storage, and Display layers","Input, Hidden, and Output layers","Fast, Medium, and Slow layers","Text, Image, and Audio layers"],"correct":1,"explanation":"Input layers receive data, hidden layers process it through learned patterns, and output layers produce the final result."},{"q":"What is the purpose of an activation function?","options":["To turn the computer on","To introduce non-linearity — allowing the network to learn complex patterns","To speed up training","To compress the output to save storage"],"correct":1,"explanation":"Without activation functions, a neural network is just linear algebra — it could only learn straight-line relationships. Activation functions let it learn curves, edges, and complex patterns."},{"q":"What does \"bias\" do in a neuron?","options":["Makes the AI biased toward certain answers","Shifts the activation threshold — letting the neuron fire even when inputs are zero","Speeds up computation","Connects the neuron to other layers"],"correct":1,"explanation":"Bias is a constant added before the activation function. It shifts when the neuron activates, giving the network more flexibility to fit data."}]}'></div>

</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/anatomy-of-a-prompt" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Anatomy of a Prompt →</a>
</div>

</div>