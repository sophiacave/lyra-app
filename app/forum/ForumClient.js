'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { colors } from '../../lib/site-config';

const SUPABASE_URL = 'https://blknphuwwgagtueqtoji.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa25waHV3d2dhZ3R1ZXF0b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDcxNTgsImV4cCI6MjA4OTk4MzE1OH0.Wm7-plwu9N7sG2SzD_C9mHUwB4Ceh91F7fimraVBG_s';

const TABS = [
  { slug: 'general', label: 'All Posts' },
  { slug: 'introductions', label: 'Introductions' },
  { slug: 'questions', label: 'Questions' },
  { slug: 'wins', label: 'Wins' },
  { slug: 'ai-foundations', label: 'AI Foundations' },
  { slug: 'mcp-masterclass', label: 'MCP' },
];

function esc(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  if (s < 604800) return Math.floor(s / 86400) + 'd ago';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getSaved(key) { try { return localStorage.getItem('forum_' + key) || ''; } catch { return ''; } }
function setSaved(key, val) { try { localStorage.setItem('forum_' + key, val); } catch {} }

export default function ForumClient() {
  const [currentSlug, setCurrentSlug] = useState('general');
  const [allPosts, setAllPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [showNewPost, setShowNewPost] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // New post form
  const [postName, setPostName] = useState('');
  const [postEmail, setPostEmail] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [postSubmitting, setPostSubmitting] = useState(false);

  // Reply state per post
  const [replyData, setReplyData] = useState({});

  // Report form
  const [reportName, setReportName] = useState('');
  const [reportEmail, setReportEmail] = useState('');
  const [reportCategory, setReportCategory] = useState('bug');
  const [reportUrl, setReportUrl] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState('');
  const [reportError, setReportError] = useState('');

  // Auth user
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    // Check auth state from auth-state.js / localStorage
    setTimeout(() => {
      const user = window.__likeone_user;
      if (user && user.signed_in) {
        const name = user.name || localStorage.getItem('lo_display_name') || user.email.split('@')[0];
        setAuthUser({ name, email: user.email });
        setPostName(name);
        setPostEmail(user.email);
        setReportName(name);
        setReportEmail(user.email);
      } else {
        setPostName(getSaved('name'));
        setPostEmail(getSaved('email'));
        setReportName(getSaved('name'));
        setReportEmail(getSaved('email'));
      }
    }, 100);
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/forum_posts?select=*&order=is_pinned.desc,created_at.desc`,
        { headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } }
      );
      if (!res.ok) throw new Error();
      setAllPosts(await res.json());
    } catch {
      setErrorMsg('Failed to load posts. Please refresh.');
    }
    setLoadingPosts(false);
  }

  function toggleExpand(postId) {
    setExpandedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId); else next.add(postId);
      return next;
    });
  }

  const filteredPosts = allPosts.filter(p => !p.parent_id).filter(p => currentSlug === 'general' || p.course_slug === currentSlug);

  async function submitPost() {
    if (!postName || !postEmail || !postTitle || !postBody) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    setPostSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/forum-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON_KEY}` },
        body: JSON.stringify({
          author_name: postName,
          author_email: postEmail,
          title: postTitle,
          body: postBody,
          course_slug: currentSlug === 'general' ? 'general' : currentSlug,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post');
      setSaved('name', postName);
      setSaved('email', postEmail);
      setPostTitle('');
      setPostBody('');
      setShowNewPost(false);
      setSuccessMsg('Your post is live! Thanks for contributing.');
      setTimeout(() => setSuccessMsg(''), 5000);
      await loadPosts();
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong.');
    }
    setPostSubmitting(false);
  }

  async function submitReply(postId) {
    const rd = replyData[postId] || {};
    const name = rd.name || postName;
    const email = rd.email || postEmail;
    const body = rd.body || '';
    if (!name || !email || !body) {
      setErrorMsg('Please fill in all fields to reply.');
      return;
    }
    setErrorMsg('');
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/forum-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON_KEY}` },
        body: JSON.stringify({ author_name: name, author_email: email, body, parent_id: postId, course_slug: 'general' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reply');
      setSaved('name', name);
      setSaved('email', email);
      setReplyData(prev => ({ ...prev, [postId]: { ...prev[postId], body: '' } }));
      await loadPosts();
      setExpandedPosts(prev => new Set(prev).add(postId));
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong.');
    }
  }

  async function submitReport() {
    if (!reportName || !reportEmail || !reportDesc) {
      setReportError('Please fill in name, email, and description.');
      return;
    }
    setReportSubmitting(true);
    setReportError('');
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/report-issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON_KEY}` },
        body: JSON.stringify({ reporter_name: reportName, reporter_email: reportEmail, category: reportCategory, page_url: reportUrl || null, description: reportDesc }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');
      setSaved('name', reportName);
      setSaved('email', reportEmail);
      setReportDesc('');
      setReportUrl('');
      setReportSuccess('Report submitted! We\'ll look into it. Thank you.');
      setTimeout(() => setReportSuccess(''), 5000);
    } catch (err) {
      setReportError(err.message || 'Something went wrong.');
    }
    setReportSubmitting(false);
  }

  function updateReply(postId, field, value) {
    setReplyData(prev => ({ ...prev, [postId]: { ...prev[postId], [field]: value } }));
  }

  const inputStyle = { width: '100%', padding: '.6rem .85rem', background: '#08080a', border: '1px solid #1e1e28', borderRadius: '8px', color: '#e8e8ec', fontSize: '.9rem', fontFamily: 'inherit', outline: 'none' };
  const btnSubmit = { background: colors.orange, color: '#000', padding: '.6rem 1.5rem', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '.85rem', cursor: 'pointer', fontFamily: 'inherit' };

  return (
    <div style={{ background: '#08080a', color: '#e8e8ec', fontFamily: "'Inter', -apple-system, system-ui, sans-serif", minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      <Header variant="site" />

      {/* Hero */}
      <section style={{ padding: '4rem 2rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '.75rem' }}>
          Community <span style={{ color: colors.purple }}>Forum</span>
        </h1>
        <p style={{ color: '#8888a0', fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
          Ask questions, share wins, help each other. This is where the convergence path becomes a shared journey.
        </p>
      </section>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem 3rem' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', margin: '2rem 0 1.5rem', flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button
              key={t.slug}
              onClick={() => setCurrentSlug(t.slug)}
              style={{
                padding: '8px 16px',
                background: currentSlug === t.slug ? colors.purple : 'transparent',
                border: `1px solid ${currentSlug === t.slug ? colors.purple : '#1e1e28'}`,
                borderRadius: '6px',
                color: currentSlug === t.slug ? '#000' : '#8888a0',
                fontSize: '.8rem',
                fontWeight: currentSlug === t.slug ? 700 : 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Auth badge */}
        {authUser && (
          <div style={{ textAlign: 'center', padding: '.5rem 1rem', marginBottom: '1rem', background: 'rgba(192,132,252,.06)', border: '1px solid rgba(192,132,252,.15)', borderRadius: '8px', fontSize: '.8rem', color: '#8888a0' }}>
            Posting as <strong style={{ color: colors.purple }}>{authUser.name}</strong> &bull; <a href="/account" style={{ color: colors.purple, textDecoration: 'none', fontSize: '.75rem' }}>Edit profile</a>
          </div>
        )}

        {/* New post toggle */}
        {!showNewPost && (
          <button
            onClick={() => setShowNewPost(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '.75rem 1.25rem', background: '#111114', border: '1px solid #1e1e28', borderRadius: '10px', color: '#8888a0', fontSize: '.9rem', cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'left', marginBottom: '1.5rem' }}
          >
            + {authUser ? `Start a new conversation as ${authUser.name}...` : 'Start a new conversation...'}
          </button>
        )}

        {/* Messages */}
        {successMsg && (
          <div style={{ background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.3)', borderRadius: '8px', padding: '.75rem 1rem', color: '#4ade80', fontSize: '.85rem', fontWeight: 600, marginBottom: '1rem' }}>{successMsg}</div>
        )}
        {errorMsg && (
          <div style={{ background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.3)', borderRadius: '8px', padding: '.75rem 1rem', color: '#f87171', fontSize: '.85rem', fontWeight: 600, marginBottom: '1rem' }}>{errorMsg}</div>
        )}

        {/* New post form */}
        {showNewPost && (
          <div style={{ background: '#111114', border: '1px solid #1e1e28', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input type="text" placeholder="Your name" maxLength={100} value={postName} onChange={e => setPostName(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <input type="email" placeholder="Your email (not shown publicly)" maxLength={255} value={postEmail} onChange={e => setPostEmail(e.target.value)} readOnly={!!authUser} style={{ ...inputStyle, flex: 1, opacity: authUser ? 0.6 : 1 }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input type="text" placeholder="Post title" maxLength={200} value={postTitle} onChange={e => setPostTitle(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <textarea placeholder="What's on your mind? Ask a question, share something you learned, celebrate a win..." maxLength={5000} value={postBody} onChange={e => setPostBody(e.target.value)} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', lineHeight: 1.6 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <span style={{ color: '#8a8aaa', fontSize: '.75rem' }}>Email is used for rate limiting only — never shown or shared.</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowNewPost(false)} style={{ background: 'none', border: 'none', color: '#8a8aaa', fontSize: '.85rem', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                <button onClick={submitPost} disabled={postSubmitting} style={{ ...btnSubmit, opacity: postSubmitting ? 0.5 : 1 }}>
                  {postSubmitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts list */}
        {loadingPosts ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#8a8aaa', fontSize: '.9rem' }}>Loading posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '.5rem' }}>No posts yet</div>
            <div style={{ color: '#8888a0', fontSize: '.9rem' }}>Be the first to start a conversation. We&rsquo;d love to hear from you.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredPosts.map(post => {
              const replies = allPosts.filter(r => r.parent_id === post.id);
              const isExpanded = expandedPosts.has(post.id);
              const rd = replyData[post.id] || {};
              return (
                <div key={post.id} style={{ background: '#111114', border: `1px solid ${post.is_pinned ? colors.orange : '#1e1e28'}`, borderRadius: '12px', padding: '1.25rem 1.5rem', ...(post.is_pinned ? { background: 'rgba(251,146,60,.03)' } : {}) }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '.5rem' }}>
                    <div>
                      <div onClick={() => toggleExpand(post.id)} style={{ fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer' }}>{post.title || 'Untitled'}</div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '.8rem', fontWeight: 600, color: post.is_faye_reply ? colors.orange : colors.purple }}>
                          {post.author_name}{post.is_faye_reply ? ' (Faye)' : ''}
                        </span>
                        <span style={{ fontSize: '.75rem', color: '#8a8aaa' }}>{timeAgo(post.created_at)}</span>
                        {post.is_pinned && <span style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '.5px', background: colors.orange, color: '#000' }}>Pinned</span>}
                        {post.is_faye_reply && <span style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '.5px', background: 'rgba(251,146,60,.15)', color: colors.orange, border: '1px solid rgba(251,146,60,.3)' }}>Faye</span>}
                      </div>
                    </div>
                  </div>

                  <div onClick={() => toggleExpand(post.id)} style={{ color: '#8888a0', fontSize: '.9rem', lineHeight: 1.7, margin: '.5rem 0', cursor: 'pointer', ...(!isExpanded ? { maxHeight: '4.8em', overflow: 'hidden' } : {}) }}>
                    {post.body}
                  </div>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '.75rem' }}>
                    <button onClick={() => toggleExpand(post.id)} style={{ background: 'none', border: 'none', color: '#8a8aaa', fontSize: '.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {isExpanded ? 'Collapse' : 'Read more'}
                    </button>
                    <button onClick={() => { setExpandedPosts(prev => new Set(prev).add(post.id)); }} style={{ background: 'none', border: 'none', color: '#8a8aaa', fontSize: '.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Reply {replies.length > 0 ? `(${replies.length})` : ''}
                    </button>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #1e1e28', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {replies.map(r => (
                        <div key={r.id} style={{ padding: '.75rem 1rem', background: '#08080a', border: '1px solid #1e1e28', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '.8rem', fontWeight: 600, color: r.is_faye_reply ? colors.orange : colors.purple }}>
                              {r.author_name}{r.is_faye_reply ? ' (Faye)' : ''}
                            </span>
                            <span style={{ fontSize: '.75rem', color: '#8a8aaa' }}>{timeAgo(r.created_at)}</span>
                            {r.is_faye_reply && <span style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '.5px', background: 'rgba(251,146,60,.15)', color: colors.orange, border: '1px solid rgba(251,146,60,.3)' }}>Faye</span>}
                          </div>
                          <div style={{ color: '#8888a0', fontSize: '.9rem', lineHeight: 1.7, margin: '.25rem 0 0' }}>{r.body}</div>
                        </div>
                      ))}

                      {/* Reply form */}
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                          <input type="text" placeholder="Your name" maxLength={100} value={rd.name ?? postName} onChange={e => updateReply(post.id, 'name', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                          <input type="email" placeholder="Email (not shown)" maxLength={255} value={rd.email ?? postEmail} onChange={e => updateReply(post.id, 'email', e.target.value)} readOnly={!!authUser} style={{ ...inputStyle, flex: 1, opacity: authUser ? 0.6 : 1 }} />
                        </div>
                        <textarea placeholder="Write a reply..." maxLength={5000} value={rd.body || ''} onChange={e => updateReply(post.id, 'body', e.target.value)} style={{ ...inputStyle, minHeight: '60px', resize: 'vertical', lineHeight: 1.6 }} />
                        <div style={{ textAlign: 'right', marginTop: '6px' }}>
                          <button onClick={() => submitReply(post.id)} style={{ ...btnSubmit, fontSize: '.8rem', padding: '.5rem 1rem' }}>Reply</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Report section */}
        <section style={{ paddingTop: '3rem' }}>
          <div style={{ borderTop: '1px solid #1e1e28', paddingTop: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '.5rem' }}>Report an Issue</h2>
            <p style={{ color: '#8888a0', fontSize: '.9rem', marginBottom: '1.5rem' }}>
              Found a bug? Have a feature idea? Something not working? Let us know — we fix things fast.
            </p>

            {reportSuccess && (
              <div style={{ background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.3)', borderRadius: '8px', padding: '.75rem 1rem', color: '#4ade80', fontSize: '.85rem', fontWeight: 600, marginBottom: '1rem' }}>{reportSuccess}</div>
            )}
            {reportError && (
              <div style={{ background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.3)', borderRadius: '8px', padding: '.75rem 1rem', color: '#f87171', fontSize: '.85rem', fontWeight: 600, marginBottom: '1rem' }}>{reportError}</div>
            )}

            <div style={{ background: '#111114', border: '1px solid #1e1e28', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input type="text" placeholder="Your name" maxLength={100} value={reportName} onChange={e => setReportName(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                <input type="email" placeholder="Your email" maxLength={255} value={reportEmail} onChange={e => setReportEmail(e.target.value)} readOnly={!!authUser} style={{ ...inputStyle, flex: 1, opacity: authUser ? 0.6 : 1 }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <select value={reportCategory} onChange={e => setReportCategory(e.target.value)} style={{ ...inputStyle, flex: 1, cursor: 'pointer' }}>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="content">Content Issue</option>
                  <option value="other">Other</option>
                </select>
                <input type="text" placeholder="Page URL (optional)" maxLength={500} value={reportUrl} onChange={e => setReportUrl(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              </div>
              <textarea placeholder="Describe the issue or idea..." maxLength={5000} value={reportDesc} onChange={e => setReportDesc(e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
              <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <button onClick={submitReport} disabled={reportSubmitting} style={{ ...btnSubmit, opacity: reportSubmitting ? 0.5 : 1 }}>
                  {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer variant="site" />
    </div>
  );
}
