---
title: "AI-Powered Data Analysis"
course: "ai-for-research"
order: 4
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-for-research/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 4 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>AI-Powered <span class="accent">Data Analysis.</span></h1>
  <p class="sub">From raw data to statistical insight with AI as your analysis partner.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to use AI for exploratory data analysis, statistical testing, and interpretation</li>
    <li>The correct way to generate and validate analysis code with AI</li>
    <li>Common statistical pitfalls AI introduces and how to avoid them</li>
    <li>Building reproducible analysis pipelines with AI assistance</li>
  </ul>
</div>

<div class="lesson-section">
<h2>AI as Analysis Partner, Not Analyst</h2>

AI excels at the mechanical parts of data analysis: writing code, choosing appropriate tests, generating visualizations, and explaining results in plain language. It fails at the parts that require scientific judgment: deciding what questions to ask, interpreting results in domain context, and distinguishing real effects from artifacts.

The workflow is conversational but disciplined:

1. You describe your data and research question
2. AI generates analysis code
3. You run the code on your actual data
4. AI helps interpret the output
5. You validate the interpretation against your domain knowledge

The critical principle: **AI writes code, your computer runs code, you interpret results.** Never accept AI-generated numbers as results. They must come from code executed on your actual data.

<div class="callout">
<strong>The fabrication risk:</strong> If you ask "what is the correlation between X and Y in my data?" without providing the data, the model will fabricate a plausible answer -- complete with r-values, p-values, and confidence intervals. These numbers are fiction. Always provide your data or have AI generate code that computes the answer from your data.
</div>
</div>

<div class="lesson-section">
<h2>Exploratory Data Analysis with AI</h2>

Start every analysis with EDA. AI accelerates this by generating comprehensive exploration code from a data description.

```python
EDA_PROMPT = """
I have a dataset with these columns:
{column_descriptions}

The dataset has {n_rows} rows. Here are the first 5 rows:
{sample_rows}

Generate a complete EDA script in Python (pandas + matplotlib + seaborn) that:
1. Shows summary statistics for all numeric columns
2. Checks for missing values and their patterns
3. Plots distributions for each numeric variable
4. Generates a correlation matrix heatmap
5. Creates scatter plots for the most correlated variable pairs
6. Identifies potential outliers using IQR method
7. Checks for class imbalance in categorical variables

Include comments explaining what each section checks and why.
"""
```

After running the EDA code, share the output with the AI for interpretation:

```python
INTERPRET_PROMPT = """
Here are the EDA results for my dataset on {topic}:

Summary statistics:
{stats_output}

Missing value report:
{missing_output}

Correlation matrix (top pairs):
{correlation_output}

Given my research question ("{question}"), what patterns are
noteworthy? What potential issues should I address before
formal analysis? What follow-up analyses would you recommend?
"""
```

<div class="tip-box">
<strong>Data privacy:</strong> Before sharing data with AI, check your IRB protocol and data use agreement. If your data contains PII or protected health information, anonymize it first or describe the data structure without sharing actual values. Most AI providers state they do not train on API data, but your IRB may require additional safeguards.
</div>
</div>

<div class="lesson-section">
<h2>Statistical Testing with AI</h2>

AI is remarkably good at selecting appropriate statistical tests -- often better than researchers who default to the one test they learned in grad school.

```python
TEST_SELECTION_PROMPT = """
Research question: {question}
Variables:
- Independent: {iv_description} (type: {iv_type})
- Dependent: {dv_description} (type: {dv_type})
- Covariates: {covariates}

Sample size: N = {n}
Design: {between/within/mixed}

Data characteristics from EDA:
- Normality: {normality_test_results}
- Homogeneity of variance: {levene_test_results}
- Outliers: {outlier_report}

Recommend the most appropriate statistical test. Explain:
1. Why this test (not alternatives)
2. Assumptions and whether my data meets them
3. Complete Python code using scipy/statsmodels/pingouin
4. How to interpret the output
5. Effect size measure and power analysis
"""
```

Validate the AI's test selection against these rules:
- Does it match your study design? (Between-subjects needs different tests than within-subjects.)
- Are the assumptions actually met by your data? (AI often says "assuming normality" without checking.)
- Is the test powerful enough for your sample size?
- Does it handle your covariates appropriately?

```python
# Example: AI generates analysis code
import pingouin as pg

# Two-way mixed ANOVA with post-hoc comparisons
aov = pg.mixed_anova(
    data=df,
    dv='performance',
    between='treatment_group',
    within='time_point',
    subject='participant_id'
)
print(aov.round(3))

# Post-hoc pairwise comparisons with Bonferroni correction
posthoc = pg.pairwise_tests(
    data=df,
    dv='performance',
    between='treatment_group',
    within='time_point',
    subject='participant_id',
    padjust='bonferroni'
)
print(posthoc.round(3))
```

<div class="callout">
<strong>The multiple comparisons trap:</strong> AI will happily generate 50 statistical tests on your data without correction, producing spurious significant results. Always specify your primary hypothesis upfront and apply appropriate corrections (Bonferroni, Holm, FDR) for secondary analyses. If you did not pre-register the analysis, it is exploratory -- report it as such.
</div>
</div>

<div class="lesson-section">
<h2>Building Reproducible Pipelines</h2>

Every analysis should be reproducible. AI helps by generating well-structured, documented analysis scripts.

```python
PIPELINE_PROMPT = """
Generate a complete, reproducible analysis pipeline as a Python script.

Requirements:
- Load data from {file_format}
- Set random seed for reproducibility
- Include all preprocessing steps with comments
- Log all parameters and decisions
- Save intermediate results
- Generate publication-ready figures
- Export results to CSV for supplementary materials
- Include a requirements.txt for dependencies

Analysis plan:
1. {step_1}
2. {step_2}
3. {step_3}

The script should be runnable with: python analysis.py --input data.csv --output results/
"""
```

Reproducibility checklist for AI-assisted analysis:
- **Version lock dependencies**: Pin exact library versions in requirements.txt.
- **Set random seeds**: Every stochastic operation (train/test splits, bootstrapping) needs a fixed seed.
- **Log all decisions**: Record why you chose each test, each threshold, each preprocessing step. AI conversations are part of your research log.
- **Save intermediate outputs**: If preprocessing changes, you need to re-run everything. Cached intermediates let you verify each stage.
- **Document AI usage**: Your methods section must note which parts of the analysis code were AI-generated and which were manually written.

<div class="tip-box">
<strong>Jupyter as lab notebook:</strong> Use Jupyter notebooks for exploratory analysis and .py scripts for final pipelines. The notebook captures your thinking process (including AI conversations). The script is the reproducible artifact. Both go in your supplementary materials.
</tip>
</div>
</div>

<div class="lesson-section">
<h2>Interpretation: Where AI Helps and Hurts</h2>

AI can explain what a p-value of 0.03 means. It cannot tell you whether the effect is scientifically meaningful. This distinction matters enormously.

Use AI for: explaining statistical output in plain language, suggesting additional analyses, identifying potential confounds you may have missed, writing results sections from statistical output.

Do not use AI for: deciding whether an effect is real, making causal claims from observational data, determining whether your results support your hypothesis (that requires domain judgment), or generating results without running code on your actual data.

The interpretation of results is the core intellectual contribution of your paper. AI can help you articulate it clearly, but the judgment is yours.
</div>

<QuizMC
  question="What is the critical principle for using AI in data analysis?"
  options={["Let AI run the analysis and report results", "AI writes code, your computer runs code, you interpret results", "AI interprets results, you write the code", "Use AI only for visualization, not statistics"]}
  correct={1}
  explanation="AI generates analysis code, but results must come from that code executed on your actual data. Never accept AI-generated numbers as results -- the model will fabricate plausible statistics including p-values and effect sizes if you don't provide data."
/>

<QuizMC
  question="What is the 'multiple comparisons trap' in AI-assisted analysis?"
  options={["AI runs too slowly with many variables", "AI generates many statistical tests without correction, producing spurious significant results", "AI cannot handle more than 10 variables", "Multiple AI models give different results"]}
  correct={1}
  explanation="AI will happily generate 50 tests without correction, producing false positives by chance. Always specify primary hypotheses upfront and apply corrections (Bonferroni, Holm, FDR). Unplanned analyses are exploratory and should be reported as such."
/>

<FlashDeck cards={[
  { front: "What are the five steps of AI-assisted data analysis?", back: "1) Describe your data and question. 2) AI generates analysis code. 3) You run the code on your actual data. 4) AI helps interpret the output. 5) You validate interpretation against domain knowledge." },
  { front: "What should you check when validating AI's statistical test selection?", back: "Does it match your study design (between/within)? Are assumptions actually met (not just assumed)? Is it powerful enough for your sample size? Does it handle covariates appropriately?" },
  { front: "What data privacy precautions should researchers take?", back: "Check IRB protocol and data use agreements before sharing with AI. Anonymize PII/PHI. Describe data structure without sharing actual values if needed. Most API providers don't train on API data, but IRB may require more." },
  { front: "What is the reproducibility checklist for AI-assisted analysis?", back: "Version lock dependencies, set random seeds, log all decisions (including AI conversations), save intermediate outputs, and document AI usage in your methods section." },
  { front: "Where does AI help vs. hurt in result interpretation?", back: "Helps: explaining statistical output, suggesting additional analyses, identifying confounds, writing results sections. Hurts: deciding if effects are real, making causal claims, determining hypothesis support -- these require domain judgment." }
]} />

</div>