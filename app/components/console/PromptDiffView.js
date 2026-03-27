'use client';

export default function PromptDiffView({ badPrompt, goodPrompt, onTryGood }) {
  if (!badPrompt || !goodPrompt) return null;

  return (
    <div className="lo-diff">
      <div className="lo-diff-header">
        <span className="lo-diff-icon">⚡</span>
        <span className="lo-diff-title">Prompt Comparison</span>
      </div>

      <div className="lo-diff-panels">
        <div className="lo-diff-panel lo-diff-bad">
          <div className="lo-diff-panel-label">
            <span className="lo-diff-dot lo-diff-dot-bad" />
            Weak prompt
          </div>
          <div className="lo-diff-text">{badPrompt}</div>
        </div>

        <div className="lo-diff-arrow">→</div>

        <div className="lo-diff-panel lo-diff-good">
          <div className="lo-diff-panel-label">
            <span className="lo-diff-dot lo-diff-dot-good" />
            Strong prompt
          </div>
          <div className="lo-diff-text">{goodPrompt}</div>
        </div>
      </div>

      {onTryGood && (
        <button className="lo-diff-try" onClick={onTryGood}>
          Try the strong version →
        </button>
      )}
    </div>
  );
}
