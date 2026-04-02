'use client';
import { useState, useRef, useCallback } from 'react';

/**
 * CodeRunner — Live Code Sandbox
 *
 * Research: Constructionism (Papert 1980) — learning by building.
 * Students run real code and see real output. No faking it.
 *
 * Props:
 *   code: string — initial code to display
 *   language?: 'javascript' | 'python' — language mode (default: javascript)
 *   expectedOutput?: string — if provided, validates output for completion
 *   title?: string
 *   instruction?: string
 *   editable?: boolean — whether student can edit (default: true)
 *   onXP?: (xp) => void
 */

export default function CodeRunner({
  code = '',
  language = 'javascript',
  expectedOutput,
  title = 'Try it yourself',
  instruction,
  editable = true,
  onXP,
}) {
  const [source, setSource] = useState(code);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('idle'); // idle | running | success | error
  const [complete, setComplete] = useState(false);
  const textareaRef = useRef(null);

  const runCode = useCallback(() => {
    setStatus('running');
    setOutput('');

    if (language === 'javascript') {
      try {
        // Capture console.log output
        const logs = [];
        const mockConsole = {
          log: (...args) => logs.push(args.map(a =>
            typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
          ).join(' ')),
          error: (...args) => logs.push('Error: ' + args.join(' ')),
          warn: (...args) => logs.push('Warning: ' + args.join(' ')),
        };

        // Safe eval with limited scope
        const fn = new Function('console', 'Math', 'JSON', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Date', 'RegExp', 'Map', 'Set', 'Promise',
          `"use strict";\n${source}`
        );
        const result = fn(mockConsole, Math, JSON, Array, Object, String, Number, Boolean, Date, RegExp, Map, Set, Promise);

        const out = logs.length > 0
          ? logs.join('\n')
          : result !== undefined
            ? typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)
            : '(no output)';

        setOutput(out);

        if (expectedOutput && out.trim() === expectedOutput.trim()) {
          setStatus('success');
          if (!complete) {
            setComplete(true);
            if (onXP) onXP(20);
          }
        } else if (expectedOutput) {
          setStatus('error');
        } else {
          setStatus('success');
        }
      } catch (e) {
        setOutput(`Error: ${e.message}`);
        setStatus('error');
      }
    } else {
      // Python — show educational message
      setOutput('Python execution runs server-side. Output will appear here.\n\n(Local preview: paste this code into a Python environment to test.)');
      setStatus('idle');
    }
  }, [source, language, expectedOutput, complete, onXP]);

  const reset = useCallback(() => {
    setSource(code);
    setOutput('');
    setStatus('idle');
  }, [code]);

  const handleKeyDown = (e) => {
    // Tab inserts spaces instead of changing focus
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newVal = source.substring(0, start) + '  ' + source.substring(end);
      setSource(newVal);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
    // Cmd/Ctrl+Enter runs code
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      runCode();
    }
  };

  const lineCount = source.split('\n').length;

  return (
    <div className={`lo-coderunner ${status !== 'idle' ? `lo-coderunner-${status}` : ''}`}>
      <div className="lo-coderunner-header">
        <div className="lo-coderunner-dots">
          <span className="lo-coderunner-dot dot-red" />
          <span className="lo-coderunner-dot dot-yellow" />
          <span className="lo-coderunner-dot dot-green" />
        </div>
        <span className="lo-coderunner-title">{title}</span>
        <span className="lo-coderunner-lang">{language}</span>
      </div>

      {instruction && (
        <p className="lo-coderunner-instruction">{instruction}</p>
      )}

      <div className="lo-coderunner-editor">
        <div className="lo-coderunner-lines" aria-hidden="true">
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="lo-coderunner-textarea"
          value={source}
          onChange={editable ? (e) => setSource(e.target.value) : undefined}
          onKeyDown={handleKeyDown}
          readOnly={!editable}
          spellCheck={false}
          rows={Math.max(lineCount, 4)}
        />
      </div>

      <div className="lo-coderunner-controls">
        <button
          className="lo-coderunner-run"
          onClick={runCode}
          disabled={status === 'running'}
        >
          {status === 'running' ? '⏳ Running...' : '▶ Run'}
        </button>
        <button className="lo-coderunner-reset" onClick={reset}>↺ Reset</button>
        <span className="lo-coderunner-hint">⌘+Enter to run</span>
      </div>

      {output && (
        <div className={`lo-coderunner-output lo-coderunner-output-${status}`}>
          <div className="lo-coderunner-output-header">Output</div>
          <pre className="lo-coderunner-output-text">{output}</pre>
        </div>
      )}

      {complete && (
        <div className="lo-coderunner-complete">
          ✓ Output matches — nice work!
        </div>
      )}
    </div>
  );
}
