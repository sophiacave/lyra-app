# Neural Net Quiz

**Course:** AI Foundations
**Order:** 3
**Type:** quiz
**Access:** Free

---
[← Course Home](/academy/ai-foundations/)
  Lesson 3 of 9


  # Neural Net Quiz.

  Test your understanding of neurons, weights, and network architecture.


  ### This quiz covers


    - How neurons compute outputs

    - The role of weights, biases, and activation functions

    - How layers work together in a network

    - Key vocabulary from lessons 1-2




  Recap
  ## Neural network concepts at a glance.

  Before you dive into the quiz, here is a quick visual recap of everything from Lessons 1 and 2. Think of a neural network as a factory assembly line: raw materials (data) enter on one end, get processed at each station (layer), and a finished product (prediction) comes out the other end.



      **The Neuron — a tiny decision-maker**
      Picture a judge at a talent show. Each performer (input) gets a score multiplied by how much the judge trusts their own taste in that genre (weight). The judge adds a personal bias — maybe they always lean generous — and then decides: does this act pass to the next round? That final yes/no decision is the activation function. Every neuron in a network does exactly this: **weighted sum + bias + activation = output**.


      **Weights — the learned knowledge**
      Weights are the numbers the network adjusts during training. Think of them as volume knobs on a mixing board. Some inputs get turned up loud (high weight = important), some get muted (low weight = unimportant), and some get inverted (negative weight = this input pushes the output down). Training is the process of finding the perfect setting for every knob.


      **Bias — the baseline mood**
      Without bias, a neuron with all-zero inputs always outputs zero. Bias is like a thermostat's default setting — it shifts the point at which the neuron "fires." A positive bias means the neuron is eager to activate; a negative bias makes it harder to trigger. This gives the network flexibility to fit patterns that do not pass through the origin.


      **Activation functions — the gatekeepers**
      Activation functions introduce curves into what would otherwise be a straight-line calculation. **ReLU** (the modern standard) is like a floor at zero: negative signals get silenced, positive signals pass through unchanged. **Sigmoid** squashes everything into a 0-to-1 range — perfect for probabilities. Without these gates, stacking layers would be pointless — the whole network would collapse into a single linear equation.


      **Layers — simple parts, complex whole**
      The **input layer** receives raw data (pixels, numbers, text). **Hidden layers** transform that data through learned patterns — first layer finds edges, second finds shapes, third finds objects. The **output layer** makes the final prediction. More layers means the network can learn more complex representations, but also needs more data and compute to train.



  Here is the full flow visualized — data enters left, flows right, and a prediction emerges:


```
  DATA FLOW THROUGH A NEURAL NETWORK

  Raw Data          Pattern Detection        Decision
  ─────────         ──────────────────        ──────────
  pixels     ──▶    edges → shapes    ──▶     "cat" (92%)
  numbers    ──▶    trends → clusters ──▶     "buy" (78%)
  words      ──▶    syntax → meaning  ──▶     "positive" (85%)

  INPUT LAYER        HIDDEN LAYERS            OUTPUT LAYER
  (receives data)    (finds patterns)         (makes prediction)

  Each arrow = a weight (learned during training)
  Each node  = weighted sum + bias + activation
  Training   = adjusting ALL weights to reduce errors
```



    **The key insight:** each neuron is embarrassingly simple — just multiply, add, and decide. But millions of these simple decisions, connected in layers, produce intelligence. That is the miracle of neural networks. Now let's test how well you understand each piece.



  Part 1
  ## Core concepts.


[Interactive: FlashDeck]


### Quiz

**Q1: What does a weight in a neural network represent?**
    A. The physical size of a neuron
  ✓ B. How much influence an input has on the output
    C. The number of connections in the network
    D. The speed at which data flows
  *Weights determine how much each input contributes to the neuron output. Higher weights mean more influence — they are what the network adjusts during training.*

**Q2: What is the role of a hidden layer?**
    A. To store the training data
    B. To display results to the user
  ✓ C. To find patterns and intermediate representations in data
    D. To reduce the network size
  *Hidden layers transform input data through learned patterns. Each layer can detect increasingly complex features — from edges to shapes to objects.*

**Q3: What does an activation function do?**
    A. Turns the computer on
  ✓ B. Decides whether a neuron should fire based on its input
    C. Counts the number of neurons
    D. Stores data permanently
  *Activation functions introduce non-linearity — they decide if a neuron summed input is strong enough to pass a signal forward. Without them, the network could only learn linear patterns.*

**Q4: Why is bias important in a neuron?**
    A. It makes the network run faster
  ✓ B. It lets the neuron fire even when all inputs are zero
    C. It reduces the number of weights needed
    D. It prevents the network from overfitting
  *Without bias, a neuron with all-zero inputs always outputs zero (or the activation of zero). Bias shifts the decision boundary, giving the neuron flexibility to activate at different thresholds.*

**Q5: What happens during training?**
    A. New neurons are added to the network
  ✓ B. The weights and biases are adjusted to reduce errors
    C. The activation functions are changed
    D. The input data is modified
  *Training adjusts weights and biases so the network output gets closer to the correct answer. This happens through a process called backpropagation — computing how much each weight contributed to the error and nudging it in the right direction.*

**Q6: A neural network with more layers can learn more complex patterns. What is the tradeoff?**
    A. More layers always make the network better with no downsides
  ✓ B. More layers need more data and compute, and risk overfitting
    C. More layers make the network faster
    D. More layers reduce the need for training data
  *Deeper networks can represent more complex functions, but they need more training data, more compute power, and are more prone to overfitting (memorizing training data instead of learning general patterns).*


  Training Recap
  ## How a network learns from its mistakes.

  Training is the process of adjusting weights and biases so the network gets better at its task. Here is the full loop, step by step:



      **1. Forward Pass — make a prediction**
      Data flows from input through hidden layers to the output. Each neuron computes its weighted sum + bias + activation. The final output is the network's prediction — maybe "92% cat, 8% dog." On the first try, this prediction is essentially random because the weights have not been trained yet.


      **2. Loss Calculation — measure the error**
      Compare the prediction to the correct answer using a **loss function**. If the network said "92% cat" but the image was a dog, the loss is high. If it said "95% dog," the loss is low. The loss function turns the error into a single number that the network can minimize.


      **3. Backpropagation — trace the blame**
      Work backwards from the output to figure out which weights contributed most to the error. Each weight gets a "blame score" (technically called a gradient) that says how much it should change and in which direction. Weights that contributed a lot to the error get adjusted more.


      **4. Weight Update — nudge toward correctness**
      Adjust every weight by a tiny amount in the direction that reduces the error. The size of the adjustment is controlled by the **learning rate** — too large and the network overshoots, too small and training takes forever. Then repeat: forward pass, loss, backprop, update. Millions of times.




    **That is the entire training loop.** Forward pass (predict) → loss (measure error) → backpropagation (trace blame) → update (adjust weights) → repeat. Every AI model you have ever used — ChatGPT, Claude, Midjourney — learned through this exact process, billions of times over.



  Part 2
  ## Match the vocabulary.


### Quiz

**Q1: Which component lets a neuron fire even when all inputs are zero?**
    A. Weight
    B. Activation function
  ✓ C. Bias
    D. Learning rate
  *Bias is a constant added before the activation function. Without it, zero inputs always produce zero output. Bias shifts the activation threshold.*

**Q2: What is the difference between ReLU and sigmoid?**
    A. ReLU is faster but sigmoid is more accurate
  ✓ B. ReLU outputs 0 or the input value; sigmoid squashes to 0-1
    C. ReLU is older; sigmoid is the modern standard
    D. There is no difference — they are the same function
  *ReLU = max(0, z) — simple, fast, used in hidden layers. Sigmoid = 1/(1+e^-z) — squashes to 0-1, used for probability outputs. ReLU is the modern standard for hidden layers; sigmoid killed by vanishing gradients.*


  Common Pitfalls
  ## Mistakes beginners make about neural networks.

  Before the final challenge, let's clear up the most common misconceptions about how neural networks work:



      **Myth: "More layers always means better"**
      Adding layers increases the network's capacity to learn complex patterns, but it also requires more training data and compute. A network that is too deep for the available data will **overfit** — it memorizes the training examples instead of learning general patterns. A 3-layer network trained well on enough data often beats a 100-layer network trained poorly.


      **Myth: "Neural networks understand like humans do"**
      A neural network that classifies cat photos does not "see" a cat the way you do. It detects statistical patterns in pixel values — edges, textures, shapes — that correlate with the label "cat." It has no concept of what a cat is, what it feels like to pet one, or that cats are alive. Pattern matching is powerful, but it is not understanding.


      **Myth: "Training data doesn't matter — the architecture does everything"**
      Architecture determines what the network *can* learn. Data determines what it *does* learn. A perfectly designed network trained on biased data will produce biased outputs. A network trained on too little data will overfit. A network trained on noisy, mislabeled data will learn noise. Data quality is at least as important as architecture quality.


      **Myth: "AI neurons work like brain neurons"**
      Artificial neurons were *inspired* by biological neurons, but they are radically simplified. A biological neuron uses electrochemistry, has timing-dependent behavior, and connects to about 7,000 other neurons on average. An artificial neuron is pure math: multiply, add, threshold. The inspiration was useful, but modern AI has diverged far from neuroscience.




    **Now you know the truth and the myths.** The final section tests your understanding of the real mechanics — how neurons compute, how layers connect, and what makes networks powerful. Let's see what you've got.



  Game Time
  ## Collect the correct concepts.


### Quiz

**Q1: What happens inside a single artificial neuron?**
    A. It stores training data for later
  ✓ B. It multiplies inputs by weights, adds bias, then applies an activation function
    C. It connects to the internet to fetch answers
    D. It displays results to the user
  *A neuron does math: weighted sum of inputs + bias, passed through an activation function. Simple individually, powerful in networks of millions.*

**Q2: What are the three types of layers in a neural network?**
    A. Speed, Storage, and Display layers
  ✓ B. Input, Hidden, and Output layers
    C. Fast, Medium, and Slow layers
    D. Text, Image, and Audio layers
  *Input layers receive data, hidden layers process it through learned patterns, and output layers produce the final result.*

**Q3: What is the purpose of an activation function?**
    A. To turn the computer on
  ✓ B. To introduce non-linearity — allowing the network to learn complex patterns
    C. To speed up training
    D. To compress the output to save storage
  *Without activation functions, a neural network is just linear algebra — it could only learn straight-line relationships. Activation functions let it learn curves, edges, and complex patterns.*

**Q4: What does "bias" do in a neuron?**
    A. Makes the AI biased toward certain answers
  ✓ B. Shifts the activation threshold — letting the neuron fire even when inputs are zero
    C. Speeds up computation
    D. Connects the neuron to other layers
  *Bias is a constant added before the activation function. It shifts when the neuron activates, giving the network more flexibility to fit data.*


  Vocabulary
  ## Your neural network glossary.

  Keep this reference handy as you continue the course. These are the foundational terms that every AI concept builds on:


```
  NEURAL NETWORK GLOSSARY

  Term                 Definition
  ──────────           ──────────────────────────────────────
  Neuron               Weighted sum + bias + activation = output
  Weight               How much influence an input has (learned)
  Bias                 Baseline nudge — lets neuron fire at zero input
  Activation fn        Adds non-linearity (ReLU, Sigmoid, Step)
  Input layer          Receives raw data (pixels, numbers, tokens)
  Hidden layer         Finds patterns — edges, shapes, meanings
  Output layer         Makes the final prediction/decision
  Forward pass         Data flowing input → hidden → output
  Loss function        Measures how wrong the prediction was
  Backpropagation      Traces error back to each weight
  Gradient             How much (and which direction) to adjust a weight
  Learning rate        Size of each weight adjustment step
  Epoch                One full pass through all training data
  Overfitting          Memorizing data instead of learning patterns
  Softmax              Converts raw scores to probabilities (sum = 1)
  Parameters           Total weights + biases (GPT-4 ≈ 1.8 trillion)
```



    **You now have the vocabulary to read any AI article and understand what they are talking about.** These terms come up in every course, every tutorial, every research paper. You are no longer on the outside looking in — you speak the language.



  [Next: Anatomy of a Prompt →](/academy/ai-foundations/anatomy-of-a-prompt)
