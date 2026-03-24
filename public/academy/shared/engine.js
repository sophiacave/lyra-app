/**
 * LIKE ONE ACADEMY — Progress Engine v2.0
 * Stripped to essentials. Learning first, always.
 *
 * Keeps: lesson completion, progress tracking, page transitions
 * Removed: XP counter, particles, sounds, achievements, streaks, badges
 */

const LO = {
  // ─── LESSON COMPLETION ───
  completeLesson(courseKey, lessonNum) {
    const key = `${courseKey}_lesson_${lessonNum}`;
    if (localStorage.getItem(key) === 'complete') return;
    localStorage.setItem(key, 'complete');
  },

  // ─── CHECK IF LESSON IS COMPLETE ───
  isComplete(courseKey, lessonNum) {
    return localStorage.getItem(`${courseKey}_lesson_${lessonNum}`) === 'complete';
  },

  // ─── COUNT COMPLETED LESSONS ───
  completedCount(courseKey, totalLessons) {
    let count = 0;
    for (let i = 1; i <= totalLessons; i++) {
      if (this.isComplete(courseKey, i)) count++;
    }
    return count;
  },

  // ─── TOAST (subtle, for completion only) ───
  showToast(msg) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(10px);background:#111114;color:#e5e5e5;border:1px solid #2a2a38;padding:10px 24px;border-radius:10px;font-family:Inter,sans-serif;font-weight:600;font-size:14px;z-index:99999;opacity:0;transition:all .3s;pointer-events:none;';
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(-50%) translateY(0)'; });
    setTimeout(() => { toast.style.opacity = '0'; }, 2500);
    setTimeout(() => toast.remove(), 3000);
  },

  // ─── INIT ───
  init() {
    // Smooth page fade-in
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity .25s';
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
  }
};

// Backward compatibility — lessons that call addXP or sfx won't break
LO.addXP = function() {};
LO.sfx = { click(){}, success(){}, error(){}, xp(){}, badge(){}, complete(){} };
LO.unlockAchievement = function() {};
LO.updateStreak = function() {};
LO.spawnParticles = function() {};
LO.updateXPDisplay = function() {};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => LO.init());
} else {
  LO.init();
}
