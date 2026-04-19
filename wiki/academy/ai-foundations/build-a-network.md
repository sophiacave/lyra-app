# Build a Network

**Course:** AI Foundations
**Order:** 2
**Type:** lesson
**Access:** Free

---
[← Course Home](/academy/ai-foundations/)
  Lesson 2 of 9


  # Build a Network.

  How neurons connect into layers, and how data flows through them — with code you can run yourself.


  ### After this lesson you'll know


    - How neurons connect to form layers

    - The difference between input, hidden, and output layers

    - Why architecture matters for what a network can learn

    - What happens when data flows through a network




  The Concept
  ## Layers are the architecture of intelligence.

  A single neuron can make simple decisions. But stack neurons into layers — input, hidden, output — and suddenly the network can recognize faces, translate languages, and write code. The architecture (how many layers, how they connect) determines what the network can learn.



      **Input Layer — the eyes and ears**
      The input layer receives raw data and passes it forward. For an image, each input neuron holds one pixel value. For text, each input holds a token embedding. The input layer does no computation — it is purely a data entry point. Its size is fixed by the data: a 28x28 pixel image needs 784 input neurons. A sentence with 50 tokens needs 50 input positions.


      **Hidden Layers — the pattern detectors**
      Hidden layers are where the magic happens. Each layer builds on the previous one, detecting increasingly abstract patterns. In an image classifier: layer 1 finds edges, layer 2 combines edges into shapes, layer 3 combines shapes into object parts, layer 4 recognizes whole objects. Think of it as a detective building a case — first individual clues, then connections, then the full picture.


      **Output Layer — the decision maker**
      The output layer produces the final answer. For classification, you get one neuron per category — a cat/dog classifier has 2 output neurons. For regression (predicting a number), you get one output neuron. The output values are often converted to probabilities using **softmax**, which ensures all outputs sum to 1.0 — so you can read them as confidence percentages.



  The number and size of layers defines what the network can learn:


```
  NETWORK DEPTH vs CAPABILITY

  Layers    What It Can Learn              Real Example
  ──────    ─────────────────              ────────────
  1         Linear boundaries              Is x > 5?
  2-3       Curves and simple patterns      Digit recognition
  5-20      Complex visual patterns          Image classification
  50-100    Abstract reasoning               Language understanding
  100+      Deep abstraction                 GPT, Claude, DALL-E

  More layers = more abstraction = more data needed
  GPT-4 has ~120 layers. Your brain has ~6 cortical layers.
```



    **Architecture is everything.** A shallow network with 2 layers can separate cats from dogs. A deep network with 100+ layers can understand language, generate images, and reason about abstract concepts. The same building blocks — neurons, weights, activations — but radically different capabilities depending on how you stack them.



  The Code
  ## A neural network in 15 lines of Python.


Python — a complete neural network forward pass

```
import numpy as np

# Input: 3 features (e.g., pixel brightness values)
X = np.array([0.5, 0.8, 0.2])

# Layer 1: 3 inputs → 4 hidden neurons
W1 = np.random.randn(3, 4) * 0.5   # 3×4 weight matrix
b1 = np.zeros(4)                   # 4 biases
hidden = np.maximum(0, X @ W1 + b1) # ReLU activation

# Layer 2: 4 hidden → 2 outputs (cat vs dog)
W2 = np.random.randn(4, 2) * 0.5   # 4×2 weight matrix
b2 = np.zeros(2)                   # 2 biases
logits = hidden @ W2 + b2            # raw scores

# Softmax: convert raw scores to probabilities
probs = np.exp(logits) / np.sum(np.exp(logits))
print(f"Cat: {probs[0]:.1%}, Dog: {probs[1]:.1%}")
```


The `@` operator is matrix multiplication — it computes every neuron's weighted sum in one shot. `np.maximum(0, ...)` is ReLU applied to the whole layer at once. That's the entire forward pass.


PyTorch — the same network using a real ML framework

```
import torch
import torch.nn as nn

# Define the network architecture
model = nn.Sequential(
    nn.Linear(3, 4),    # 3 inputs → 4 hidden neurons
    nn.ReLU(),           # activation
    nn.Linear(4, 2),    # 4 hidden → 2 outputs
    nn.Softmax(dim=0)   # convert to probabilities
)

# Forward pass
X = torch.tensor([0.5, 0.8, 0.2])
probs = model(X)
print(f"Cat: {probs[0]:.1%}, Dog: {probs[1]:.1%}")
```


PyTorch's `nn.Sequential` builds the exact same architecture — but handles backpropagation and training automatically. The numpy version shows you what happens inside; PyTorch is what you use in production.


  Layer Types
  ## Not all layers are created equal.

  The simple network above uses **dense layers** (also called fully connected) where every neuron connects to every neuron in the next layer. But real networks use specialized layer types designed for different kinds of data:



      **Dense (Fully Connected) — the general workhorse**
      Every neuron connects to every neuron in the next layer. Good for tabular data (spreadsheets, databases). Simple and effective, but scales poorly for images because an image with 1000x1000 pixels would need 1 million connections per neuron. Used as the final layers in most networks.


      **Convolutional (CNN) — the image specialist**
      Instead of connecting to every input, each neuron looks at a small patch (like a 3x3 window) and slides across the image. This makes CNNs excellent at finding visual patterns — edges, textures, shapes — regardless of where they appear. Used in image classification, object detection, and medical imaging.


      **Transformer (Attention) — the language genius**
      Each token "pays attention" to every other token in the sequence, learning which words matter most for understanding each word. This is the architecture behind GPT, Claude, and every modern language model. The key innovation: unlike older approaches, transformers can process all words in parallel instead of one at a time.




  See It
  ## What a neural network looks like.

  Every neural network follows this pattern: data enters the input layer, flows through hidden layers that find patterns, and arrives at the output layer which makes the decision.


```
         INPUT          HIDDEN          OUTPUT
        (3 neurons)    (4 neurons)     (2 neurons)

        ┌───┐
  x₁ ──▶│ h₁ │──┐
        └───┘  │      ┌───┐
        ┌───┐  ├─────▶│ y₁ │  ← P(cat) = 0.82
  x₂ ──▶│ h₂ │──┤      └───┘
        └───┘  │
        ┌───┐  │      ┌───┐
  x₃ ──▶│ h₃ │──┼─────▶│ y₂ │  ← P(dog) = 0.18
        └───┘  │      └───┘
        ┌───┐  │
        │ h₄ │──┘
        └───┘

  ↑ Each input          ↑ Each hidden         ↑ Output neurons
    connects to            neuron finds           give the final
    EVERY hidden           a different            prediction as
    neuron (fully          pattern in             probabilities
    connected)             the data               that sum to 1
```


  Every arrow represents a **weight** — a number that gets adjusted during training. In the code above, `W1` contains 12 weights (3 inputs × 4 hidden neurons) and `W2` contains 8 weights (4 hidden × 2 outputs). Training means finding the right values for all 20 weights.


  Knowledge Check
  ## Test your understanding.


### Network Architecture Concepts

**Card 1:**
Front: Input Layer
Back: The first layer of a neural network. It receives raw data — pixels, text, numbers — and passes it to the hidden layers for processing.

**Card 2:**
Front: Hidden Layer
Back: Middle layers that find patterns and intermediate representations. Each hidden layer builds on the previous one to detect increasingly complex features.

**Card 3:**
Front: Output Layer
Back: The final layer that makes the prediction or decision. For a cat/dog classifier, the output layer has one neuron per class.

**Card 4:**
Front: Forward Pass
Back: When data flows from input through hidden layers to output. Each neuron multiplies inputs by weights, adds bias, and applies an activation function.

**Card 5:**
Front: Network Architecture
Back: The structure of a neural network — how many layers, how many neurons per layer, how they connect. Architecture determines what the network can learn.


### Quiz

**Q1: Why do neural networks need hidden layers?**
    A. To hide the computation from users
  ✓ B. To find intermediate patterns that are too complex for a single layer
    C. To reduce the amount of training data needed
    D. To make the network smaller
  *Hidden layers find intermediate representations — first layer might detect edges, second detects shapes, third detects objects. Each layer builds on the previous one to learn increasingly complex patterns.*

**Q2: For a cats vs dogs image classifier, why do you need 2 output neurons?**
    A. One for each pixel in the image
  ✓ B. One outputs cat probability, the other outputs dog probability
    C. Two outputs make the network faster
    D. It is just a convention with no real purpose
  *Each output neuron represents one class. The network learns to activate the cat neuron when it sees a cat and the dog neuron when it sees a dog. The outputs are often probabilities that sum to 1.*



    **Neural networks are layers of neurons connected together.** Input neurons receive data. Hidden neurons find patterns. Output neurons make decisions. The magic is in the connections — each one has a weight that gets adjusted during training.



  The Full Picture
  ## Data flow from start to finish.

  Let's trace a single example through the entire network — from raw data to final prediction:


```
  EXAMPLE: Classifying a 3-pixel "image" as cat or dog

  INPUT:  pixel values [0.5, 0.8, 0.2]

  HIDDEN LAYER (4 neurons, each sees ALL inputs):
    h1 = ReLU(0.5×w1 + 0.8×w2 + 0.2×w3 + bias) = 0.62
    h2 = ReLU(0.5×w4 + 0.8×w5 + 0.2×w6 + bias) = 0.00  ← killed by ReLU
    h3 = ReLU(0.5×w7 + 0.8×w8 + 0.2×w9 + bias) = 0.91
    h4 = ReLU(0.5×w10+ 0.8×w11+ 0.2×w12+ bias) = 0.15

  OUTPUT LAYER (2 neurons):
    cat = softmax(0.62×w13 + 0.00×w14 + 0.91×w15 + 0.15×w16 + bias)
    dog = softmax(0.62×w17 + 0.00×w18 + 0.91×w19 + 0.15×w20 + bias)

  RESULT:  cat = 82%, dog = 18%  → prediction: CAT

  Total weights: 12 (input→hidden) + 8 (hidden→output) = 20
  Total biases: 4 (hidden) + 2 (output) = 6
  Total learnable parameters: 26
```


  This tiny network has 26 parameters. GPT-4 has an estimated 1.8 *trillion*. The architecture is the same — layers of neurons with weights and biases — just scaled up by a factor of 70 billion.


  [Next: Neural Net Quiz →](/academy/ai-foundations/neural-net-quiz)
