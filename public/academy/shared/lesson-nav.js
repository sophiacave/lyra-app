/**
 * Like One Academy — Lesson Navigation
 * Auto-detects course/lesson from URL, renders nav bar + progress.
 * Requires courses.js to be loaded first (window.ACADEMY_COURSES).
 */
(function () {
  'use strict';

  /* ── Design tokens ─────────────────────────────────────── */
  var C = {
    bg:      '#08080a',
    surface: '#111114',
    text:    '#e8e8ec',
    dim:     '#8888a0',
    accent:  '#c084fc',
    warm:    '#fb923c',
    border:  '#1e1e28'
  };

  /* ── Helpers ────────────────────────────────────────────── */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function parsePath() {
    // Expected: /academy/{courseSlug}/{lessonSlug}.html
    var parts = window.location.pathname.replace(/\/+$/, '').split('/');
    var lessonFile = parts.pop() || '';
    var courseSlug  = parts.pop() || '';
    var lessonSlug  = lessonFile.replace(/\.html$/, '');
    return { courseSlug: courseSlug, lessonSlug: lessonSlug };
  }

  function lessonHref(courseSlug, lessonSlug) {
    return '/academy/' + courseSlug + '/' + lessonSlug + '.html';
  }

  function storageKey(courseSlug) {
    return 'lo_progress_' + courseSlug;
  }

  function getCompleted(courseSlug) {
    try {
      return JSON.parse(localStorage.getItem(storageKey(courseSlug)) || '[]');
    } catch (e) { return []; }
  }

  function markComplete(courseSlug, lessonSlug) {
    var arr = getCompleted(courseSlug);
    if (arr.indexOf(lessonSlug) === -1) arr.push(lessonSlug);
    try { localStorage.setItem(storageKey(courseSlug), JSON.stringify(arr)); } catch (e) {}
    // Sync to server if signed in
    syncProgressToServer(courseSlug, lessonSlug);
  }

  /* ── Server sync ────────────────────────────────────────── */
  var SB_URL = 'https://vpaynwebgmmnwttqkwmh.supabase.co';
  var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwYXlud2ViZ21tbnd0dHFrd21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjc0OTksImV4cCI6MjA4ODg0MzQ5OX0.roRXPjkD1K4EXgaV2slcxGtnhrGfnJnTXz7R2GhQCxo';
  var _sb = null;
  function getSB() {
    if (_sb) return _sb;
    if (!window.supabase) return null;
    _sb = window.supabase.createClient(SB_URL, SB_ANON);
    return _sb;
  }

  function syncProgressToServer(courseSlug, lessonSlug) {
    try {
      var sb = getSB();
      if (!sb) return;
      sb.auth.getSession().then(function(res) {
        var session = res.data.session;
        if (!session) return;
        sb.from('lesson_progress').upsert({
          user_id: session.user.id,
          course_slug: courseSlug,
          lesson_slug: lessonSlug,
          completed: true,
          completed_at: new Date().toISOString()
        }, { onConflict: 'user_id,course_slug,lesson_slug' }).then(function() {});
      });
    } catch(e) {}
  }

  // Load server progress into localStorage on page load (merge, never lose local data)
  function loadProgressFromServer() {
    try {
      var sb = getSB();
      if (!sb) return;
      sb.auth.getSession().then(function(res) {
        var session = res.data.session;
        if (!session) return;
        sb.from('lesson_progress')
          .select('course_slug, lesson_slug')
          .eq('user_id', session.user.id)
          .eq('completed', true)
          .then(function(result) {
            if (!result.data || !result.data.length) return;
            // Group by course
            var byCourse = {};
            for (var i = 0; i < result.data.length; i++) {
              var r = result.data[i];
              if (!byCourse[r.course_slug]) byCourse[r.course_slug] = [];
              byCourse[r.course_slug].push(r.lesson_slug);
            }
            // Merge into localStorage (union — never lose local progress)
            for (var course in byCourse) {
              var local = getCompleted(course);
              var server = byCourse[course];
              var merged = local.slice();
              for (var j = 0; j < server.length; j++) {
                if (merged.indexOf(server[j]) === -1) merged.push(server[j]);
              }
              if (merged.length > local.length) {
                try { localStorage.setItem(storageKey(course), JSON.stringify(merged)); } catch(e) {}
              }
            }
          });
      });
    } catch(e) {}
  }

  // Run on every page load
  loadProgressFromServer();

  /* ── Global API ─────────────────────────────────────────── */
  window.LO_NAV = {
    goNext: function () {
      var info = parsePath();
      var course = (window.ACADEMY_COURSES || {})[info.courseSlug];
      if (!course) return;
      var lessons = course.lessons;
      for (var i = 0; i < lessons.length; i++) {
        if (lessons[i].slug === info.lessonSlug) {
          markComplete(info.courseSlug, info.lessonSlug);
          if (i < lessons.length - 1) {
            window.location.href = lessonHref(info.courseSlug, lessons[i + 1].slug);
          } else {
            window.location.href = '/academy/' + info.courseSlug + '/';
          }
          return;
        }
      }
    }
  };

  /* ── Main ───────────────────────────────────────────────── */
  ready(function () {
    var courses = window.ACADEMY_COURSES;
    if (!courses) return; // graceful degrade

    var info   = parsePath();
    var course = courses[info.courseSlug];
    if (!course) return; // unknown course — do nothing

    var lessons    = course.lessons;
    var idx        = -1;
    for (var i = 0; i < lessons.length; i++) {
      if (lessons[i].slug === info.lessonSlug) { idx = i; break; }
    }
    if (idx === -1) return; // unknown lesson

    var total      = lessons.length;
    var num        = idx + 1;
    var isFirst    = idx === 0;
    var isLast     = idx === total - 1;
    var prevLesson = isFirst ? null : lessons[idx - 1];
    var nextLesson = isLast  ? null : lessons[idx + 1];
    var pct        = Math.round((num / total) * 100);

    /* ── Inject styles ────────────────────────────────────── */
    var style = document.createElement('style');
    style.textContent = [
      '/* Lesson Nav */',
      '.lo-progress-bar{position:fixed;top:0;left:0;width:100%;height:3px;z-index:1000;background:transparent}',
      '.lo-progress-fill{height:100%;background:' + C.accent + ';transition:width .4s ease}',
      '.lo-lesson-badge{display:block;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:' + C.accent + ';margin-bottom:8px;font-family:Inter,system-ui,sans-serif}',
      '.lo-bottom-bar{position:fixed;bottom:0;left:0;width:100%;background:rgba(8,8,10,.95);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid ' + C.border + ';padding:12px 24px;z-index:999;display:flex;align-items:center;justify-content:space-between;font-family:Inter,system-ui,sans-serif;box-sizing:border-box}',
      '.lo-bottom-bar *{box-sizing:border-box}',
      '.lo-nav-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;transition:opacity .15s,background .15s;font-family:Inter,system-ui,sans-serif;line-height:1.4}',
      '.lo-nav-btn:hover{opacity:.85}',
      '.lo-btn-prev{background:transparent;border:1px solid ' + C.border + ';color:' + C.text + '}',
      '.lo-btn-next{background:' + C.warm + ';border:none;color:#000;font-weight:700}',
      '.lo-btn-back{background:transparent;border:1px solid ' + C.border + ';color:' + C.text + '}',
      '.lo-btn-hidden{visibility:hidden;pointer-events:none}',
      '.lo-center-info{text-align:center;color:' + C.dim + ';font-size:13px;line-height:1.4}',
      '.lo-center-info strong{color:' + C.text + ';font-weight:600}',
      'body{padding-bottom:72px}',
      '@media(max-width:600px){',
      '  .lo-bottom-bar{padding:10px 12px}',
      '  .lo-nav-btn{padding:8px 12px;font-size:13px}',
      '  .lo-center-info{font-size:11px}',
      '}'
    ].join('\n');
    document.head.appendChild(style);

    /* ── Progress bar (top) ───────────────────────────────── */
    var bar = document.createElement('div');
    bar.className = 'lo-progress-bar';
    bar.innerHTML = '<div class="lo-progress-fill" style="width:' + pct + '%"></div>';
    document.body.appendChild(bar);

    /* ── Lesson badge (above first h1) ────────────────────── */
    var h1 = document.querySelector('h1');
    if (h1) {
      var badge = document.createElement('span');
      badge.className = 'lo-lesson-badge';
      badge.textContent = 'Lesson ' + num + ' of ' + total;
      h1.parentNode.insertBefore(badge, h1);
    }

    /* ── Bottom navigation bar ────────────────────────────── */
    var nav = document.createElement('nav');
    nav.className = 'lo-bottom-bar';

    // Previous button
    var prevHTML;
    if (isFirst) {
      prevHTML = '<span class="lo-nav-btn lo-btn-prev lo-btn-hidden">&larr; Previous</span>';
    } else {
      prevHTML = '<a class="lo-nav-btn lo-btn-prev" href="' + lessonHref(info.courseSlug, prevLesson.slug) + '">&larr; Previous</a>';
    }

    // Center
    var centerHTML = '<div class="lo-center-info"><strong>Lesson ' + num + ' of ' + total + '</strong><br>' + course.title + '</div>';

    // Next / Back to Course
    var nextHTML;
    if (isLast) {
      nextHTML = '<a class="lo-nav-btn lo-btn-back" href="/academy/' + info.courseSlug + '/">Back to Course</a>';
    } else {
      nextHTML = '<a class="lo-nav-btn lo-btn-next" href="' + lessonHref(info.courseSlug, nextLesson.slug) + '">Next &rarr;</a>';
    }

    nav.innerHTML = prevHTML + centerHTML + nextHTML;
    document.body.appendChild(nav);

    /* ── Intercept "Complete & Continue" buttons ──────────── */
    function interceptComplete(btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Mark current lesson complete
        markComplete(info.courseSlug, info.lessonSlug);

        // Navigate to next lesson or back to course page
        if (nextLesson) {
          window.location.href = lessonHref(info.courseSlug, nextLesson.slug);
        } else {
          window.location.href = '/academy/' + info.courseSlug + '/';
        }
      });
    }

    // Bind existing buttons
    var completeBtns = document.querySelectorAll('[data-action="complete"], .complete-btn, .complete-and-continue');
    for (var b = 0; b < completeBtns.length; b++) {
      interceptComplete(completeBtns[b]);
    }

    // Watch for dynamically added buttons
    if (window.MutationObserver) {
      var observer = new MutationObserver(function (mutations) {
        for (var m = 0; m < mutations.length; m++) {
          var nodes = mutations[m].addedNodes;
          for (var n = 0; n < nodes.length; n++) {
            var node = nodes[n];
            if (node.nodeType !== 1) continue;
            if (node.matches && (node.matches('[data-action="complete"]') || node.matches('.complete-btn') || node.matches('.complete-and-continue'))) {
              interceptComplete(node);
            }
            if (node.querySelectorAll) {
              var inner = node.querySelectorAll('[data-action="complete"], .complete-btn, .complete-and-continue');
              for (var j = 0; j < inner.length; j++) interceptComplete(inner[j]);
            }
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
})();
