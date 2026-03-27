'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

  return (
    <div className="site-page">
      <Header variant="site" />

      {/* Hero */}
      <section className="forum-hero">
        <h1 className="forum-hero-title">
          Community <span className="text-purple">Forum</span>
        </h1>
        <p className="forum-hero-desc">
          Ask questions, share wins, help each other. This is where the convergence path becomes a shared journey.
        </p>
      </section>

      <main className="forum-main">
        {/* Tabs */}
        <div className="forum-tabs">
          {TABS.map(t => (
            <button
              key={t.slug}
              onClick={() => setCurrentSlug(t.slug)}
              className={`forum-tab${currentSlug === t.slug ? ' active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Auth badge */}
        {authUser && (
          <div className="forum-auth-badge">
            Posting as <strong>{authUser.name}</strong> &bull; <a href="/account">Edit profile</a>
          </div>
        )}

        {/* New post toggle */}
        {!showNewPost && (
          <button
            onClick={() => setShowNewPost(true)}
            className="forum-new-post-toggle"
          >
            + {authUser ? `Start a new conversation as ${authUser.name}...` : 'Start a new conversation...'}
          </button>
        )}

        {/* Messages */}
        {successMsg && (
          <div className="app-msg-success">{successMsg}</div>
        )}
        {errorMsg && (
          <div className="app-msg-error">{errorMsg}</div>
        )}

        {/* New post form */}
        {showNewPost && (
          <div className="app-card">
            <div className="app-form-row">
              <input type="text" placeholder="Your name" maxLength={100} value={postName} onChange={e => setPostName(e.target.value)} className="app-input flex-1" />
              <input type="email" placeholder="Your email (not shown publicly)" maxLength={255} value={postEmail} onChange={e => setPostEmail(e.target.value)} readOnly={!!authUser} className={`app-input flex-1${authUser ? ' readonly' : ''}`} />
            </div>
            <div className="app-form-group">
              <input type="text" placeholder="Post title" maxLength={200} value={postTitle} onChange={e => setPostTitle(e.target.value)} className="app-input" />
            </div>
            <div className="app-form-group">
              <textarea placeholder="What's on your mind? Ask a question, share something you learned, celebrate a win..." maxLength={5000} value={postBody} onChange={e => setPostBody(e.target.value)} className="app-input app-textarea app-textarea-md" />
            </div>
            <div className="app-form-actions">
              <span className="app-form-note">Email is used for rate limiting only — never shown or shared.</span>
              <div className="app-form-inline">
                <button onClick={() => setShowNewPost(false)} className="app-btn-link">Cancel</button>
                <button onClick={submitPost} disabled={postSubmitting} className="app-btn-submit">
                  {postSubmitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts list */}
        {loadingPosts ? (
          <div className="app-loading">Loading posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="app-empty">
            <div className="app-empty-icon">💬</div>
            <div className="app-empty-title">No posts yet</div>
            <div className="app-empty-desc">Be the first to start a conversation. We&rsquo;d love to hear from you.</div>
          </div>
        ) : (
          <div className="forum-posts">
            {filteredPosts.map(post => {
              const replies = allPosts.filter(r => r.parent_id === post.id);
              const isExpanded = expandedPosts.has(post.id);
              const rd = replyData[post.id] || {};
              return (
                <div key={post.id} className={`forum-post${post.is_pinned ? ' pinned' : ''}`}>
                  <div className="forum-post-header">
                    <div>
                      <div onClick={() => toggleExpand(post.id)} className="forum-post-title">{post.title || 'Untitled'}</div>
                      <div className="forum-post-meta">
                        <span className={`forum-post-author${post.is_faye_reply ? ' faye' : ''}`}>
                          {post.author_name}{post.is_faye_reply ? ' (Faye)' : ''}
                        </span>
                        <span className="forum-post-time">{timeAgo(post.created_at)}</span>
                        {post.is_pinned && <span className="forum-post-badge pinned">Pinned</span>}
                        {post.is_faye_reply && <span className="forum-post-badge faye">Faye</span>}
                      </div>
                    </div>
                  </div>

                  <div onClick={() => toggleExpand(post.id)} className={`forum-post-body${!isExpanded ? ' collapsed' : ''}`}>
                    {post.body}
                  </div>

                  <div className="forum-post-actions">
                    <button onClick={() => toggleExpand(post.id)} className="app-btn-link">
                      {isExpanded ? 'Collapse' : 'Read more'}
                    </button>
                    <button onClick={() => { setExpandedPosts(prev => new Set(prev).add(post.id)); }} className="app-btn-link">
                      Reply {replies.length > 0 ? `(${replies.length})` : ''}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="forum-replies">
                      {replies.map(r => (
                        <div key={r.id} className="forum-reply">
                          <div className="forum-post-meta">
                            <span className={`forum-post-author${r.is_faye_reply ? ' faye' : ''}`}>
                              {r.author_name}{r.is_faye_reply ? ' (Faye)' : ''}
                            </span>
                            <span className="forum-post-time">{timeAgo(r.created_at)}</span>
                            {r.is_faye_reply && <span className="forum-post-badge faye">Faye</span>}
                          </div>
                          <div className="forum-reply-body">{r.body}</div>
                        </div>
                      ))}

                      {/* Reply form */}
                      <div className="forum-reply-thread">
                        <div className="app-form-row">
                          <input type="text" placeholder="Your name" maxLength={100} value={rd.name ?? postName} onChange={e => updateReply(post.id, 'name', e.target.value)} className="app-input flex-1" />
                          <input type="email" placeholder="Email (not shown)" maxLength={255} value={rd.email ?? postEmail} onChange={e => updateReply(post.id, 'email', e.target.value)} readOnly={!!authUser} className={`app-input flex-1${authUser ? ' readonly' : ''}`} />
                        </div>
                        <textarea placeholder="Write a reply..." maxLength={5000} value={rd.body || ''} onChange={e => updateReply(post.id, 'body', e.target.value)} className="app-input app-textarea" />
                        <div className="app-form-actions-right">
                          <button onClick={() => submitReply(post.id)} className="app-btn-submit">Reply</button>
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
        <section className="forum-report-section">
          <div className="forum-report-divider">
            <h2 className="forum-report-title">Report an Issue</h2>
            <p className="forum-report-desc">
              Found a bug? Have a feature idea? Something not working? Let us know — we fix things fast.
            </p>

            {reportSuccess && (
              <div className="app-msg-success">{reportSuccess}</div>
            )}
            {reportError && (
              <div className="app-msg-error">{reportError}</div>
            )}

            <div className="app-card">
              <div className="app-form-row">
                <input type="text" placeholder="Your name" maxLength={100} value={reportName} onChange={e => setReportName(e.target.value)} className="app-input flex-1" />
                <input type="email" placeholder="Your email" maxLength={255} value={reportEmail} onChange={e => setReportEmail(e.target.value)} readOnly={!!authUser} className={`app-input flex-1${authUser ? ' readonly' : ''}`} />
              </div>
              <div className="app-form-row">
                <select value={reportCategory} onChange={e => setReportCategory(e.target.value)} className="app-input flex-1 app-select">
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="content">Content Issue</option>
                  <option value="other">Other</option>
                </select>
                <input type="text" placeholder="Page URL (optional)" maxLength={500} value={reportUrl} onChange={e => setReportUrl(e.target.value)} className="app-input flex-1" />
              </div>
              <textarea placeholder="Describe the issue or idea..." maxLength={5000} value={reportDesc} onChange={e => setReportDesc(e.target.value)} className="app-input app-textarea app-textarea-sm" />
              <div className="app-form-actions-right">
                <button onClick={submitReport} disabled={reportSubmitting} className="app-btn-submit">
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
