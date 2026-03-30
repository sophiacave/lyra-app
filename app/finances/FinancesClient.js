'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const APP_URL = 'https://app.likeone.ai';
const APP_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa25waHV3d2dhZ3R1ZXF0b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDcxNTgsImV4cCI6MjA4OTk4MzE1OH0.Wm7-plwu9N7sG2SzD_C9mHUwB4Ceh91F7fimraVBG_s';

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function categoryColor(cat) {
  const map = {
    'FOOD_AND_DRINK': '#fb923c',
    'TRANSPORTATION': '#38bdf8',
    'TRANSFER_IN': '#00b894',
    'TRANSFER_OUT': '#f87171',
    'INCOME': '#00b894',
    'LOAN_PAYMENTS': '#f87171',
    'ENTERTAINMENT': '#c084fc',
    'GENERAL_MERCHANDISE': '#a78bfa',
    'RENT_AND_UTILITIES': '#fbbf24',
  };
  return map[cat] || '#737373';
}

export default function FinancesClient() {
  const [sb, setSb] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(false);

  // Load Supabase client
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = () => {
      const client = window.supabase.createClient(APP_URL, APP_ANON);
      setSb(client);
    };
    document.head.appendChild(script);
  }, []);

  // Check auth
  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, s) => {
      setSession(s);
      if (!s) setLoading(false);
    });
    return () => subscription?.unsubscribe();
  }, [sb]);

  // Fetch finances when session ready
  useEffect(() => {
    if (!session) return;
    fetchFinances();
  }, [session]);

  async function fetchFinances() {
    setFetching(true);
    setError(null);
    try {
      const res = await fetch('/api/finances/', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      setData(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setFetching(false);
    }
  }

  // Styles
  const pageStyle = {
    minHeight: '100vh',
    background: '#08080a',
    color: '#e5e5e5',
    fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
  };
  const containerStyle = {
    maxWidth: 960,
    margin: '0 auto',
    padding: '40px 20px 80px',
  };
  const cardStyle = {
    background: '#111114',
    border: '1px solid #1e1e28',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  };
  const h1Style = {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 8,
  };
  const subtitleStyle = {
    color: '#737373',
    fontSize: 14,
    marginBottom: 32,
  };
  const summaryGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
    marginBottom: 32,
  };
  const statCard = {
    ...cardStyle,
    marginBottom: 0,
    textAlign: 'center',
  };
  const statValue = {
    fontSize: 28,
    fontWeight: 700,
    background: 'linear-gradient(135deg, #c084fc, #38bdf8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };
  const statLabel = {
    fontSize: 12,
    color: '#737373',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  };
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
  };
  const thStyle = {
    textAlign: 'left',
    padding: '10px 12px',
    borderBottom: '1px solid #1e1e28',
    color: '#737373',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: 600,
  };
  const tdStyle = {
    padding: '10px 12px',
    borderBottom: '1px solid #111118',
  };
  const badgeStyle = (color) => ({
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 500,
    background: color + '18',
    color: color,
  });

  // Not logged in
  if (!loading && !session) {
    return (
      <div style={pageStyle}>
        <Header variant="site" />
        <div style={{ ...containerStyle, textAlign: 'center', paddingTop: 120 }}>
          <h1 style={h1Style}>Finances</h1>
          <p style={{ color: '#737373', marginBottom: 24 }}>Sign in to view your financial dashboard.</p>
          <Link href="/account/" style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: 'linear-gradient(135deg, #c084fc, #d93280)',
            color: '#fff',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
          }}>Sign In</Link>
        </div>
        <Footer variant="site" />
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <Header variant="site" />
      <div style={containerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h1 style={h1Style}>Finances</h1>
          {data && (
            <button
              onClick={fetchFinances}
              disabled={fetching}
              style={{
                padding: '8px 16px',
                background: '#1e1e28',
                border: '1px solid #2a2a2a',
                borderRadius: 8,
                color: '#a0a0a0',
                cursor: fetching ? 'wait' : 'pointer',
                fontSize: 13,
              }}
            >
              {fetching ? 'Refreshing...' : 'Refresh'}
            </button>
          )}
        </div>
        <p style={subtitleStyle}>
          {data?.summary?.environment === 'sandbox' ? 'Sandbox mode — test data from First Platypus Bank' : 'Live financial data via Plaid'}
        </p>

        {loading && <p style={{ color: '#737373' }}>Loading...</p>}
        {error && (
          <div style={{ ...cardStyle, borderColor: '#7f1d1d', background: '#1a0505' }}>
            <p style={{ color: '#f87171' }}>{error}</p>
          </div>
        )}
        {fetching && !data && <p style={{ color: '#737373' }}>Connecting to Plaid...</p>}

        {data && (
          <>
            {/* Summary cards */}
            <div style={summaryGrid}>
              <div style={statCard}>
                <div style={statValue}>{formatCurrency(data.summary.total_balance)}</div>
                <div style={statLabel}>Total Balance</div>
              </div>
              <div style={statCard}>
                <div style={statValue}>{formatCurrency(data.summary.total_available)}</div>
                <div style={statLabel}>Available</div>
              </div>
              <div style={statCard}>
                <div style={{ ...statValue, fontSize: 28 }}>{data.summary.account_count}</div>
                <div style={statLabel}>Accounts</div>
              </div>
              <div style={statCard}>
                <div style={{ ...statValue, fontSize: 28 }}>{data.summary.transaction_count}</div>
                <div style={statLabel}>Transactions (30d)</div>
              </div>
            </div>

            {/* Accounts */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Accounts</h2>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Account</th>
                    <th style={thStyle}>Type</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Balance</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Available</th>
                  </tr>
                </thead>
                <tbody>
                  {data.accounts.map(a => (
                    <tr key={a.id}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 500 }}>{a.name}</div>
                        {a.official_name && <div style={{ fontSize: 12, color: '#737373' }}>{a.official_name}</div>}
                      </td>
                      <td style={tdStyle}>
                        <span style={badgeStyle('#a78bfa')}>{a.subtype || a.type}</span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(a.balance, a.currency)}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#a0a0a0' }}>
                        {a.available != null ? formatCurrency(a.available, a.currency) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Transactions */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Recent Transactions</h2>
              {data.transactions.length === 0 ? (
                <p style={{ color: '#737373' }}>No transactions in the last 30 days.</p>
              ) : (
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Date</th>
                      <th style={thStyle}>Description</th>
                      <th style={thStyle}>Category</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions.map(t => {
                      const isInflow = t.amount < 0; // Plaid: negative = money in
                      return (
                        <tr key={t.id}>
                          <td style={{ ...tdStyle, color: '#a0a0a0', whiteSpace: 'nowrap' }}>
                            {formatDate(t.date)}
                          </td>
                          <td style={tdStyle}>
                            <div style={{ fontWeight: 500 }}>{t.name}</div>
                            {t.pending && <span style={{ fontSize: 11, color: '#fbbf24' }}>Pending</span>}
                          </td>
                          <td style={tdStyle}>
                            <span style={badgeStyle(categoryColor(t.category))}>
                              {t.category.replace(/_/g, ' ').toLowerCase()}
                            </span>
                          </td>
                          <td style={{
                            ...tdStyle,
                            textAlign: 'right',
                            fontVariantNumeric: 'tabular-nums',
                            fontWeight: 500,
                            color: isInflow ? '#00b894' : '#e5e5e5',
                          }}>
                            {isInflow ? '+' : ''}{formatCurrency(Math.abs(t.amount))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer info */}
            <p style={{ color: '#525252', fontSize: 12, textAlign: 'center' }}>
              Last updated: {new Date(data.summary.as_of).toLocaleString()} · {data.summary.environment} environment
            </p>
          </>
        )}
      </div>
      <Footer variant="site" />
    </div>
  );
}
