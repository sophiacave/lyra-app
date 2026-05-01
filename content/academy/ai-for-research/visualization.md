---
title: "Data Visualization & Figures"
course: "ai-for-research"
order: 6
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-for-research/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 6 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Data Visualization <span class="accent">& Figures.</span></h1>
  <p class="sub">Publication-quality figures generated through AI-assisted workflows.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to use AI to generate publication-ready matplotlib, seaborn, and plotly code</li>
    <li>Journal figure requirements and how to meet them programmatically</li>
    <li>Choosing the right visualization for your data type and audience</li>
    <li>Building a reusable figure generation pipeline</li>
  </ul>
</div>

<div class="lesson-section">
<h2>Why AI Changes Research Visualization</h2>

Research visualization has two problems. First, the conceptual problem: choosing the right chart type for your data and message. Second, the implementation problem: writing matplotlib code that produces figures meeting journal specifications (DPI, font sizes, color accessibility, panel layouts).

AI solves the second problem almost completely. You describe what you want, AI generates the code, you run it. The first problem -- choosing what to visualize and why -- remains yours. A beautiful figure that shows the wrong thing is worse than an ugly figure that shows the right thing.

<div class="tip-box">
<strong>Figure-first analysis:</strong> Before running statistics, visualize your data. Distributions, scatter plots, and time series often reveal patterns, outliers, and violations of assumptions that summary statistics hide. Anscombe's quartet proved this in 1973 -- identical statistics, completely different patterns.
</tip>
</div>
</div>

<div class="lesson-section">
<h2>The Figure Generation Prompt</h2>

Precision in your prompt produces publication-quality code on the first attempt:

```python
FIGURE_PROMPT = """
Generate matplotlib/seaborn code for a publication-quality figure.

DATA:
- DataFrame 'df' with columns: {columns}
- Sample data: {first_3_rows}

FIGURE SPEC:
- Type: {chart_type}
- X-axis: {x_variable} (label: "{x_label}")
- Y-axis: {y_variable} (label: "{y_label}")
- Grouping: {group_variable} if applicable
- Error bars: {SEM / 95% CI / SD}

JOURNAL REQUIREMENTS:
- Figure width: {single_column: 3.5in / double_column: 7in}
- DPI: 300 minimum (600 for line art)
- Font: Arial or Helvetica, 8pt minimum
- Color: accessible palette (colorblind-safe)
- File format: PDF and TIFF

STYLE RULES:
- Remove top and right spines
- Use direct labels instead of legends when possible
- Grayscale-safe (patterns/markers differ, not just color)
- Statistical annotations: brackets with p-values or stars

Generate the complete code including:
1. Figure setup with exact dimensions
2. Data plotting with proper aesthetics
3. Statistical annotations if applicable
4. Axis formatting and labels
5. Save in both PDF and TIFF at required DPI
"""
```

<div class="callout">
<strong>The "Nature style" shortcut:</strong> If you're targeting a specific journal, tell the AI: "Style this figure to match Nature / Science / PNAS conventions." The model knows the common style guidelines and will generate code that matches. Always verify against the actual journal's figure guidelines, but this gets you 90% of the way.
</div>
</div>

<div class="lesson-section">
<h2>Choosing the Right Visualization</h2>

AI can suggest chart types, but you need to understand the logic behind the choice. Here is the decision framework:

**Comparing groups:**
- 2-4 groups: bar chart with individual data points (strip/swarm plot overlay)
- Many groups: horizontal bar chart or dot plot
- Never: pie chart (humans are poor at comparing angles)

**Showing relationships:**
- Two continuous variables: scatter plot with regression line
- Multiple variables: pair plot or correlation matrix heatmap
- Categorical + continuous: violin plot or box plot with strips

**Showing change over time:**
- Few time points: line plot with error bands
- Many time points: line plot, possibly with smoothing
- Before/after: paired dot plot (spaghetti plot)

**Showing distributions:**
- Single distribution: histogram, KDE, or raincloud plot
- Comparing distributions: overlaid KDE, violin plot, or ridgeline

```python
# Example: Modern bar chart with individual data points
import matplotlib.pyplot as plt
import seaborn as sns

fig, ax = plt.subplots(figsize=(3.5, 3))

# Bar chart with individual observations
sns.barplot(data=df, x='group', y='score', errorbar='se',
            capsize=0.1, color='lightgray', edgecolor='black', ax=ax)
sns.stripplot(data=df, x='group', y='score', color='black',
              size=3, alpha=0.5, jitter=True, ax=ax)

# Clean styling
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.set_xlabel('Treatment Group', fontsize=9, fontname='Arial')
ax.set_ylabel('Performance Score', fontsize=9, fontname='Arial')
ax.tick_params(labelsize=8)

plt.tight_layout()
plt.savefig('figure1.pdf', dpi=300, bbox_inches='tight')
plt.savefig('figure1.tiff', dpi=600, bbox_inches='tight')
```

<div class="tip-box">
<strong>Show the data, not just the summary:</strong> Modern journals increasingly expect to see individual data points, not just bars and error bars. Swarm plots, strip plots, and raincloud plots show the full distribution while preserving group summaries. This transparency helps reviewers assess your data.
</tip>
</div>
</div>

<div class="lesson-section">
<h2>Multi-Panel Figures</h2>

Complex results often require multi-panel figures. AI handles the layout math:

```python
MULTIPANEL_PROMPT = """
Create a multi-panel figure (2 rows x 3 columns) labeled A-F.

Panel A: Bar chart of {data_A}
Panel B: Scatter plot of {data_B}
Panel C: Heatmap of {data_C}
Panel D: Line plot of {data_D}
Panel E: Violin plot of {data_E}
Panel F: Kaplan-Meier survival curve of {data_F}

Requirements:
- Panel labels (A, B, C...) in bold 12pt, top-left of each panel
- Shared color palette across panels
- Figure width: 7 inches (double column)
- Consistent axis formatting across all panels
- gridspec for unequal panel sizes if needed
"""

# AI generates code like:
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec

fig = plt.figure(figsize=(7, 5))
gs = gridspec.GridSpec(2, 3, hspace=0.35, wspace=0.4)

ax_a = fig.add_subplot(gs[0, 0])
ax_b = fig.add_subplot(gs[0, 1])
ax_c = fig.add_subplot(gs[0, 2])
ax_d = fig.add_subplot(gs[1, 0])
ax_e = fig.add_subplot(gs[1, 1])
ax_f = fig.add_subplot(gs[1, 2])

# Label each panel
for ax, label in zip([ax_a, ax_b, ax_c, ax_d, ax_e, ax_f],
                      ['A', 'B', 'C', 'D', 'E', 'F']):
    ax.text(-0.15, 1.1, label, transform=ax.transAxes,
            fontsize=12, fontweight='bold', va='top')
```

<div class="callout">
<strong>Color accessibility:</strong> 8% of men have some form of color vision deficiency. Use the colorblind-safe palettes: <code>sns.color_palette("colorblind")</code> or <code>plt.cm.viridis</code>. Never rely on red/green distinction alone. Add markers, patterns, or direct labels as redundant encodings.
</div>
</div>

<div class="lesson-section">
<h2>The Figure Pipeline</h2>

Build a reusable pipeline so every figure in your paper shares consistent styling:

```python
# figure_style.py -- import in every figure script
import matplotlib.pyplot as plt

def set_publication_style():
    plt.rcParams.update({
        'font.family': 'Arial',
        'font.size': 8,
        'axes.linewidth': 0.8,
        'axes.spines.top': False,
        'axes.spines.right': False,
        'xtick.major.width': 0.8,
        'ytick.major.width': 0.8,
        'figure.dpi': 300,
        'savefig.dpi': 600,
        'savefig.bbox': 'tight',
        'savefig.pad_inches': 0.05,
    })

COLORS = {
    'control': '#4477AA',
    'treatment': '#EE6677',
    'baseline': '#228833',
    'highlight': '#CCBB44',
}
```

Every figure script imports this module, ensuring visual consistency across your entire paper. When a journal requests style changes, you update one file.
</div>

<div data-learn="QuizMC" data-props='{"questions": [{"q": "Why should modern research figures show individual data points, not just bars and error bars?", "options": ["It looks more visually appealing", "Individual data points reveal the full distribution, outliers, and sample size, providing transparency that bars alone hide", "Journals require it", "It makes the figure larger and easier to read"], "correct": 1, "explanation": "Bars and error bars can hide bimodal distributions, outliers, and small sample sizes. Showing individual data points (strip plots, swarm plots) lets reviewers and readers assess the actual data distribution, which is why modern journals increasingly expect it."}, {"q": "What should you never use to compare groups in a research figure?", "options": ["Bar charts", "Violin plots", "Pie charts", "Box plots"], "correct": 2, "explanation": "Pie charts are ineffective for comparison because humans are poor at comparing angles and areas. Bar charts, dot plots, violin plots, and box plots all allow direct comparison of values on a common axis, which humans process much more accurately."}]}'></div>

<div data-learn="FlashDeck" data-props='{"cards": [{"front": "What are the standard journal figure requirements?", "back": "Width: 3.5in (single column) or 7in (double column). DPI: 300 minimum, 600 for line art. Font: Arial/Helvetica, 8pt minimum. Colors: colorblind-safe palette. Format: PDF and TIFF."}, {"front": "What is the &#39;figure-first analysis&#39; approach?", "back": "Visualize your data before running statistics. Distributions and scatter plots reveal patterns, outliers, and assumption violations that summary statistics hide. Anscombe&#39;s quartet proves identical stats can mask completely different data patterns."}, {"front": "How do you ensure color accessibility in figures?", "back": "Use colorblind-safe palettes (seaborn &#39;colorblind&#39;, matplotlib viridis). Never rely on red/green distinction alone. Add markers, patterns, or direct labels as redundant encodings. 8% of men have color vision deficiency."}, {"front": "What is the benefit of a reusable figure style module?", "back": "Every figure shares consistent fonts, sizes, colors, and spine styling. When a journal requests changes, update one file. Import it at the start of every figure script for visual consistency across your paper."}, {"front": "How do you choose between scatter plot, violin plot, and bar chart?", "back": "Scatter plot: two continuous variables showing relationship. Violin plot: comparing distributions across groups. Bar chart: comparing group means (best with individual data point overlay). Match the chart to what you want to communicate."}]}'></div>

</div>