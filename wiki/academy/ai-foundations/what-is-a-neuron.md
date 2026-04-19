# What Is a Neuron?

**Course:** AI Foundations
**Order:** 1
**Type:** lesson
**Access:** Free

---
[← Course Home](/academy/ai-foundations/)
  Lesson 1 of 9


  # What Is a Neuron?

  Your brain has 86 billion neurons. Each one does something embarrassingly simple. AI neurons do the exact same thing — and that simplicity is why they're so powerful.


  ### After this lesson you'll know


    - What a neuron computes: weighted sum + bias + activation

    - What weights, biases, and activation functions do

    - Why stacking simple neurons creates intelligence

    - The difference between Step, ReLU, and Sigmoid activations




  The Concept
  ## A voting booth in your brain.

  Think of it like a voting booth. Three friends each send you a signal — maybe weak, maybe strong. You multiply each signal by how much you trust that friend (that's the **weight**). You add up all the votes, plus a little nudge called the **bias** (your default mood). Then you decide: do I fire, or stay quiet? That decision is the **activation function**.
  That's it. That's the entire computation a neuron does. And AI is made of millions of these.


  Nature vs Machine
  ## Biological neurons vs artificial neurons.

  Artificial neurons were inspired by biological ones, but they are not copies. Understanding the differences helps you see what AI can and cannot do:



      **Biological neuron — the original**
      Your brain has about 86 billion neurons. Each one receives electrical signals through branch-like **dendrites**, processes them in the **cell body**, and if the combined signal is strong enough, sends an electrical pulse down the **axon** to the next neuron. The connection point between neurons is called a **synapse**. The strength of each synapse is what your brain adjusts when you learn — this is the biological equivalent of a weight.


      **Artificial neuron — the simplified model**
      An artificial neuron takes numerical inputs, multiplies each by a weight, sums them up, adds a bias, and passes the result through an activation function. It is a drastically simplified version of the biological neuron. No electrical pulses, no timing, no neurochemistry — just pure math. But this simplification is a feature: it can run on a GPU at billions of operations per second.




```
  BIOLOGICAL vs ARTIFICIAL NEURON

  Feature          Biological              Artificial
  ───────          ──────────              ──────────
  Inputs           Dendrites               Numbers (x1, x2, x3...)
  Connection       Synapse strength        Weight (w1, w2, w3...)
  Processing       Cell body               Weighted sum + bias
  Decision         Fire / don't fire       Activation function
  Output           Electrical pulse        A number
  Speed            ~200 operations/sec     ~1 billion operations/sec
  Count            ~86 billion (brain)     ~175 billion (GPT-4)
  Learning         Synapse adjustment      Weight adjustment
  Energy           ~20 watts (brain)       ~500,000 watts (GPU cluster)
```



    **The trade-off is clear:** biological neurons are energy-efficient and massively parallel. Artificial neurons are individually faster and mathematically precise. Your brain runs on a sandwich's worth of calories. GPT-4 runs on a small power plant. But both learn by adjusting connection strengths — weights in AI, synapses in biology.



  Play With It
  ## Live neuron — move the sliders and watch.


  Key Concepts
  ## The building blocks of every neuron.


  Every artificial neuron does the same three-step dance: **multiply** inputs by weights, **sum** everything plus a bias, and **decide** whether to fire via an activation function. Here is the exact math in code:


Python — a single neuron from scratch

```
import numpy as np

# Three inputs and their weights
inputs  = np.array([0.50, 0.30, 0.70])
weights = np.array([0.80, -0.40, 0.60])
bias    = 0.10

# Step 1: weighted sum + bias
z = np.dot(inputs, weights) + bias
print(f"weighted sum z = {z:.4f}")  # z = 0.7200

# Step 2: activation function (ReLU)
output = max(0, z)
print(f"ReLU output   = {output:.4f}")  # output = 0.7200
```


**Reading the code:** `np.dot()` multiplies each input by its matching weight, then adds all the results together. Input 1 (0.50) × Weight 1 (0.80) = 0.40, Input 2 (0.30) × Weight 2 (-0.40) = -0.12, Input 3 (0.70) × Weight 3 (0.60) = 0.42. Add them up: 0.40 + (-0.12) + 0.42 = 0.70. Plus the bias (0.10) = 0.80. Then ReLU checks: is 0.80 positive? Yes → pass it through. That is the entire computation.
*Don't worry if code isn't your thing — the voting analogy above captures the same idea. The code is here for learners who want to see the exact math.*



      **Weights — how much you trust each input**
      A high positive weight means "this input matters a lot, in a positive way." A negative weight means "this input pulls the output *down*." Training a neural network means finding the right weights — it is the *entire* learning process.


      **Bias — the default nudge**
      Without bias, a neuron with all-zero inputs always outputs zero. Bias shifts the activation threshold — it lets the neuron fire even when inputs are weak. Think of it as the neuron's baseline mood: optimistic (positive bias) or skeptical (negative bias).


      **Activation Function — the decision gate**
      Without an activation function, a neural network can only learn simple straight-line relationships (like "more input = more output"). The activation function lets the neuron learn complex, curved patterns — like recognizing a face, understanding a sentence, or predicting whether an email is spam. This ability to go beyond straight lines is called **non-linearity**, and it is what makes AI powerful.




  Key Insight
  ## Why activation functions are the secret ingredient.

  This is the single most important concept in neural networks. Without activation functions, a network with 1000 layers is mathematically identical to a network with 1 layer. Here is why:



      **Without activation: a straight line**
      A neuron without an activation function just computes: output = (w1 * x1) + (w2 * x2) + bias. That is a linear equation — it can only draw a straight line to separate data. Stack 100 layers of linear equations and the math simplifies to... one linear equation. No matter how deep you go, you can only learn straight-line patterns.


      **With activation: curves and complexity**
      Add a ReLU activation (which just zeros out negatives) and suddenly each layer can bend the decision boundary. Two layers can make curves. Three layers can make S-shapes. Deep networks can draw arbitrarily complex boundaries. This is how a network separates cat photos from dog photos — the boundary between "cat" and "dog" in pixel-space is incredibly complex and curved.




    **Think of it this way:** linear means you can only draw with a ruler. Activation functions give you a pen that can curve, loop, and make any shape. The shape of the activation function determines what kind of curves are possible — and ReLU's simplicity (just clip negatives to zero) turns out to be surprisingly powerful.



  Deep Dive
  ## Three activation functions you need to know.


  Every activation function takes the weighted sum *z* and transforms it. Here they are in Python — copy this code and run it yourself:


Python — the three activation functions

```
import numpy as np

def step(z):
    """Historical (1957). Binary: fire or don't."""
    return 1 if z >= 0 else 0

def relu(z):
    """Modern standard. Simple, fast, effective."""
    return max(0, z)

def sigmoid(z):
    """Outputs a probability between 0 and 1."""
    return 1 / (1 + np.exp(-z))

# Try them with the same input
z = 0.72
print(f"step({z})    = {step(z)}")       # 1
print(f"relu({z})    = {relu(z)}")       # 0.72
print(f"sigmoid({z}) = {sigmoid(z):.4f}") # 0.6726

# Now try with a negative input
z = -1.5
print(f"step({z})    = {step(z)}")       # 0
print(f"relu({z})    = {relu(z)}")       # 0
print(f"sigmoid({z}) = {sigmoid(z):.4f}") # 0.1824
```


Notice: Step and ReLU both output 0 for negative inputs, but sigmoid still outputs 0.18 — it never fully "turns off." That is why sigmoid is useful for probability outputs (like "92% chance this is spam") but ReLU is preferred for the hidden layers inside the network because it trains faster and more reliably.


### Activation Functions — Flip for Details

**Card 1:**
Front: 📐 STEP FUNCTION (1957)  The original. Outputs 0 or 1. Used in the first Perceptron.
Back: HOW IT WORKS: If the weighted sum is >= 0, output 1. Otherwise, output 0.  PROBLEM: No gradient — the network cannot learn gradually. It is either on or off. Like a light switch with no dimmer.  USED TODAY: Almost never. Historical importance only.

**Card 2:**
Front: ⚡ ReLU (Modern Standard)  Rectified Linear Unit. The workhorse of modern AI.
Back: HOW IT WORKS: max(0, z). If positive, pass it through. If negative, output 0.  WHY IT WORKS: Dead simple, trains extremely fast, and avoids the vanishing gradient problem that killed earlier activations.  USED TODAY: Almost everywhere — image classifiers, language models, recommendation systems.

**Card 3:**
Front: 🎯 SIGMOID (Probabilities)  Squashes output to between 0 and 1. Perfect for yes/no decisions.
Back: HOW IT WORKS: 1/(1+e^-z). Smoothly maps any number to the range (0, 1).  WHY IT WORKS: The output can be interpreted as a probability. Is this email spam? 0.92 = 92% likely spam.  USED TODAY: Final layer of binary classifiers. Replaced by ReLU in hidden layers.


  Knowledge Check
  ## Test your understanding.


### Quiz

**Q1: What does a weight in a neural network control?**
    A. The physical size of a neuron
  ✓ B. How much influence an input has on the output
    C. The number of connections in the network
    D. The speed at which data flows
  *Weights determine how much each input contributes to the neuron output. Higher weights mean more influence. Training a neural network means finding the right weights.*

**Q2: Why are activation functions necessary?**
    A. They make the network run faster
  ✓ B. They add non-linearity so the network can learn complex patterns
    C. They reduce the number of neurons needed
    D. They store the training data
  *Without activation functions, a neural network is just a linear equation — no matter how many layers you stack. Non-linearity is what allows networks to learn curves, edges, language, and everything else.*

**Q3: Which activation function is used in most modern neural networks?**
    A. Step function
    B. Sigmoid
  ✓ C. ReLU
    D. Logarithm
  *ReLU (Rectified Linear Unit) is the standard. It is simple (max(0, z)), trains fast, and avoids the vanishing gradient problem that plagued older activations like sigmoid in hidden layers.*



    **This is the real building block of AI.** Every neural network — from image classifiers to large language models — is made of neurons that compute exactly this: weighted sum + bias, passed through an activation function. Stack thousands of these together and you get intelligence.



  [Next: Build a Network →](/academy/ai-foundations/build-a-network)
