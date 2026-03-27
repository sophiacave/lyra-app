'use client';
import Link from 'next/link';

export default function ConsoleTopBar({ appName = 'Academy', appEmoji = '📚' }) {
  return (
    <div className="lo-topbar">
      <div className="lo-topbar-left">
        <div className="lo-traffic-lights">
          <Link href="/" className="lo-dot lo-dot-red" aria-label="Home" title="Back to Like One" />
          <span className="lo-dot lo-dot-yellow" />
          <span className="lo-dot lo-dot-green" />
        </div>
        <span className="lo-topbar-app">
          <span className="lo-topbar-emoji">{appEmoji}</span>
          <span className="lo-topbar-appname">{appName}</span>
        </span>
      </div>
      <div className="lo-topbar-center">
        <span className="lo-topbar-brand">
          like<span className="lo-topbar-accent">one</span>
        </span>
      </div>
      <div className="lo-topbar-right">
        <span className="lo-topbar-status">
          <span className="lo-status-dot" />
          <span className="lo-status-text">online</span>
        </span>
      </div>
    </div>
  );
}
