'use client';
import { Component } from 'react';

/**
 * Error boundary for learn components.
 * If a QuizMC, FlashDeck, etc. throws, this catches it
 * and shows a graceful fallback instead of crashing the whole lesson.
 */
export default class LearnErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.warn(`[LearnComponent] ${this.props.name || 'Unknown'} crashed:`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          margin: '1.5rem 0',
          padding: '1rem 1.25rem',
          background: 'rgba(248, 113, 113, 0.06)',
          border: '1px solid rgba(248, 113, 113, 0.15)',
          borderRadius: '10px',
          fontSize: '0.85rem',
          color: '#a0a0b0',
        }}>
          <strong style={{ color: '#f87171' }}>Component unavailable</strong>
          <span style={{ margin: '0 0.5rem' }}>—</span>
          This interactive element couldn't load. The lesson content above is unaffected.
        </div>
      );
    }
    return this.props.children;
  }
}
