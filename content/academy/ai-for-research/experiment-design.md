---
title: "Experiment Design & Methodology"
course: "ai-for-research"
order: 5
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-for-research/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 5 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Experiment Design <span class="accent">& Methodology.</span></h1>
  <p class="sub">AI-assisted experimental design that stands up to peer review.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to use AI to refine experimental designs and identify confounds</li>
    <li>Power analysis and sample size calculation with AI assistance</li>
    <li>Pre-registration workflows that strengthen your methodology</li>
    <li>Using AI as a methodological devil's advocate</li>
  </ul>
</div>

<div class="lesson-section">
<h2>AI as Methodological Reviewer</h2>

The best time to find flaws in your methodology is before you collect data, not during peer review. AI serves as an always-available methodological reviewer that challenges your design from multiple perspectives.

```
DESIGN REVIEW PROMPT:

I am designing an experiment to test:
Hypothesis: {hypothesis}
Population: {target_population}
Design: {between/within/mixed-subjects}
IV: {independent_variable} with levels {levels}
DV: {dependent_variable} measured by {measurement_method}
Controls: {control_conditions}
Duration: {timeline}

Act as three different reviewers:

REVIEWER 1 (Methodologist): What are the internal validity
threats? What confounds exist? What alternative explanations
could account for the predicted results?

REVIEWER 2 (Statistician): Is the design powered to detect
the expected effect? Are the measures appropriate? What
statistical assumptions should be verified?

REVIEWER 3 (Domain Expert in {field}): What does the existing
literature suggest about this design? What has been tried
before and what were the results? What would make this
contribution novel?
```

This multi-reviewer prompt forces the AI to attack your design from three angles simultaneously. The output is not a rubber stamp -- it is a list of problems to solve before you start.

<div class="tip-box">
<strong>Iterate the design, not just the prompt:</strong> When AI identifies a confound, revise your actual design, then re-submit for review. Three rounds of design-review-revise typically produce a methodology that survives real peer review with minimal revisions.
</tip>
</div>
</div>

<div class="lesson-section">
<h2>Power Analysis and Sample Size</h2>

Underpowered studies waste resources and produce unreliable results. AI makes power analysis accessible, even for complex designs.

```python
POWER_ANALYSIS_PROMPT = """
I need a power analysis for this design:
- Test: {statistical_test}
- Expected effect size: {effect_size} (based on {justification})
- Desired power: 0.80
- Alpha: 0.05
- Groups: {n_groups}
- Repeated measures: {n_timepoints}

Generate Python code using statsmodels or pingouin to:
1. Calculate required sample size
2. Create a power curve showing sample size vs. power for effect sizes
   from {small} to {large}
3. Calculate achieved power if I can only recruit {max_n} participants
4. Account for expected attrition of {attrition_rate}%
"""

# Example output code:
from statsmodels.stats.power import TTestIndPower

analysis = TTestIndPower()

# Required sample size for d=0.5, power=0.80, alpha=0.05
n = analysis.solve_power(
    effect_size=0.5,
    power=0.80,
    alpha=0.05,
    ratio=1.0,          # Equal group sizes
    alternative='two-sided'
)
print(f"Required N per group: {int(np.ceil(n))}")

# Adjust for 15% attrition
n_adjusted = int(np.ceil(n / (1 - 0.15)))
print(f"Recruit per group (with 15% attrition): {n_adjusted}")

# Power curve
import matplotlib.pyplot as plt
effect_sizes = np.arange(0.2, 1.0, 0.05)
sample_sizes = [analysis.solve_power(es, power=0.80, alpha=0.05) for es in effect_sizes]
plt.plot(effect_sizes, sample_sizes)
plt.xlabel('Effect Size (Cohen\'s d)')
plt.ylabel('Required N per group')
plt.title('Sample Size Requirements by Effect Size')
plt.grid(True)
plt.savefig('power_curve.png', dpi=300, bbox_inches='tight')
```

<div class="callout">
<strong>Effect size justification:</strong> AI will ask you for an expected effect size. Do not guess. Options: (1) Use the effect size from a closely related published study. (2) Use the smallest effect size that would be practically meaningful. (3) If neither is available, use conventional benchmarks (d=0.2 small, d=0.5 medium, d=0.8 large) but acknowledge this in your pre-registration. Option 2 is the strongest approach because it ties power to practical significance.
</div>
</div>

<div class="lesson-section">
<h2>Confound Identification</h2>

AI is unexpectedly good at spotting confounds because it draws on patterns across thousands of published studies. Use it systematically:

```
CONFOUND_PROMPT:

My experiment:
- IV: Screen time (high vs. low, self-reported)
- DV: Sleep quality (Pittsburgh Sleep Quality Index)
- Hypothesis: High screen time reduces sleep quality
- Design: Cross-sectional survey, N=300 college students

Generate a comprehensive list of potential confounds,
organized by type:

1. CONFOUNDING VARIABLES: Third variables that correlate
   with both IV and DV
2. MEASUREMENT ISSUES: Problems with how variables are measured
3. SAMPLING BIAS: Who is missing from the sample?
4. DEMAND CHARACTERISTICS: How participants might behave
   differently because they're being studied
5. TEMPORAL ISSUES: Problems with the causal ordering

For each confound, suggest a mitigation strategy.
```

Typical AI-identified confounds for the example above: depression (confound), social desirability bias in self-reported screen time (measurement), students vs. general population (sampling), time of semester affecting both screen time and sleep (temporal). Most researchers would catch 2-3 of these. AI routinely produces 8-12.

<div class="tip-box">
<strong>The confound database:</strong> Maintain a running list of confounds identified across your research program. Common confounds in your domain will recur. Over time, this list becomes a design checklist that you apply automatically to every new study.
</tip>
</div>
</div>

<div class="lesson-section">
<h2>Pre-Registration with AI</h2>

Pre-registration -- specifying your hypotheses, methods, and analysis plan before collecting data -- is the gold standard for credible research. AI helps by generating comprehensive pre-registration documents.

```
PRE-REGISTRATION PROMPT:

Generate a pre-registration document following the AsPredicted
template (or OSF Prereg template) for this study:

Title: {title}
Hypotheses: {H1, H2, H3}
Design: {design_details}
Sample: {sample_details}
Variables: {variable_details}
Analysis Plan: {planned_analyses}

Include:
1. Exact stopping rule for data collection
2. Exclusion criteria (what makes a data point invalid)
3. Primary analysis for each hypothesis
4. Correction method for multiple comparisons
5. Sensitivity analyses (what if assumptions are violated)
6. Exploratory analyses (clearly labeled as exploratory)
```

Pre-registration on OSF (osf.io) or AsPredicted (aspredicted.org) timestamps your plan before data collection. This prevents post-hoc hypothesizing (HARKing) and demonstrates methodological rigor. Reviewers increasingly expect pre-registration, especially for confirmatory studies.

<div class="callout">
<strong>Pre-registration is not a straitjacket:</strong> You can still conduct exploratory analyses. You just label them as exploratory in your paper. The value of pre-registration is distinguishing between confirmatory tests (planned) and exploratory discovery (unplanned). Both are valid. Mislabeling one as the other is not.
</div>
</div>

<div class="lesson-section">
<h2>Pilot Study Design</h2>

Before running your full study, run a pilot. AI helps you design efficient pilots that maximize learning from minimal resources:

- Test your measurement instruments (do participants understand the questions?)
- Estimate effect sizes for power analysis
- Identify practical problems (how long does the task actually take?)
- Validate your randomization and counterbalancing procedures
- Check data quality (missing data patterns, floor/ceiling effects)

A pilot of 10-20 participants typically reveals the major issues. AI can generate the pilot analysis script that checks each of these dimensions automatically, so your pilot delivers structured insights rather than just a vague "it seemed to work."
</div>

<QuizMC
  question="What is the strongest approach to justifying your expected effect size in a power analysis?"
  options={["Use conventional benchmarks (d=0.2, 0.5, 0.8)", "Use the effect size from a closely related study", "Use the smallest effect size that would be practically meaningful", "Let AI estimate the effect size"]}
  correct={2}
  explanation="Using the smallest practically meaningful effect size ties your power analysis to practical significance -- you're powering the study to detect an effect worth caring about. Published effect sizes are the second-best option. Conventional benchmarks are acceptable but weaker."
/>

<QuizMC
  question="Why is pre-registration valuable even though you can still do exploratory analysis?"
  options={["It prevents you from doing any unplanned analysis", "It distinguishes confirmatory tests (planned) from exploratory discovery (unplanned), preventing post-hoc hypothesizing", "It is required by all journals", "It guarantees publication"]}
  correct={1}
  explanation="Pre-registration separates confirmatory from exploratory analyses. Both are valid in a paper, but mislabeling exploratory findings as confirmatory (HARKing) is a major threat to scientific credibility. Pre-registration timestamps your plan before data exists."
/>

<FlashDeck cards={[
  { front: "How does the multi-reviewer prompt work?", back: "Submit your design to AI playing three roles simultaneously: Methodologist (internal validity threats), Statistician (power and measurement), Domain Expert (literature context and novelty). Three rounds of design-review-revise typically produce peer-review-ready methodology." },
  { front: "How many confounds does AI typically identify vs. researchers?", back: "AI routinely produces 8-12 confounds organized by type (confounding variables, measurement issues, sampling bias, demand characteristics, temporal issues). Most researchers catch 2-3 independently." },
  { front: "What are the three options for justifying expected effect sizes?", back: "1) Effect size from a closely related published study. 2) Smallest practically meaningful effect size (strongest). 3) Conventional benchmarks (d=0.2/0.5/0.8) with acknowledgment. Never guess or let AI estimate." },
  { front: "What should a pilot study check?", back: "Measurement instrument clarity, effect size estimation, practical logistics (task duration), randomization procedures, and data quality (missing data patterns, floor/ceiling effects). 10-20 participants typically reveal major issues." },
  { front: "What is HARKing and how does pre-registration prevent it?", back: "HARKing = Hypothesizing After Results are Known. Pre-registration timestamps your hypotheses and analysis plan before data collection, making it impossible to present exploratory findings as confirmatory tests." }
]} />

</div>