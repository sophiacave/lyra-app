/**
 * LIKE ONE ACADEMY — Game Engine v1.0
 * Shared across all 64 lessons. Handles:
 * - Global XP tracking
 * - Achievement system
 * - Streak tracking
 * - Particle effects
 * - Sound feedback (Web Audio API)
 * - Progress persistence
 * - Smooth transitions
 * - Toast notifications
 */

const LO = {
  // ─── STATE ───
  xp: parseInt(localStorage.getItem('lo_total_xp') || '0'),
  streak: parseInt(localStorage.getItem('lo_streak') || '0'),
  lastLesson: localStorage.getItem('lo_last_lesson_date') || '',
  achievements: JSON.parse(localStorage.getItem('lo_achievements') || '[]'),

  // ─── AUDIO ───
  audioCtx: null,
  initAudio() {
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  },
  playTone(freq, duration, type = 'sine', vol = 0.15) {
    try {
      this.initAudio();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = vol;
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch(e) {}
  },
  sfx: {
    click()  { LO.playTone(800, 0.06, 'sine', 0.08); },
    success(){ LO.playTone(523, 0.1); setTimeout(() => LO.playTone(659, 0.1), 100); setTimeout(() => LO.playTone(784, 0.15), 200); },
    error()  { LO.playTone(200, 0.2, 'sawtooth', 0.1); },
    xp()     { LO.playTone(1047, 0.08); setTimeout(() => LO.playTone(1319, 0.12), 80); },
    badge()  { LO.playTone(523, 0.1); setTimeout(() => LO.playTone(659, 0.08), 120); setTimeout(() => LO.playTone(784, 0.08), 200); setTimeout(() => LO.playTone(1047, 0.2), 280); },
    complete(){ LO.playTone(440, 0.15); setTimeout(() => LO.playTone(554, 0.15), 150); setTimeout(() => LO.playTone(659, 0.15), 300); setTimeout(() => LO.playTone(880, 0.3), 450); }
  },

  // ─── XP ───
  addXP(amount) {
    this.xp += amount;
    localStorage.setItem('lo_total_xp', this.xp);
    this.sfx.xp();
    this.showToast(`+${amount} XP`, '#c084fc');
    this.spawnParticles(window.innerWidth / 2, window.innerHeight / 2, '#c084fc', 12);
    this.checkAchievements();
    this.updateXPDisplay();
  },

  updateXPDisplay() {
    const el = document.getElementById('lo-xp-display');
    if (el) el.textContent = `${this.xp.toLocaleString()} XP`;
  },

  // ─── STREAK ───
  updateStreak() {
    const today = new Date().toDateString();
    if (this.lastLesson === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (this.lastLesson === yesterday) {
      this.streak++;
    } else if (this.lastLesson !== today) {
      this.streak = 1;
    }
    this.lastLesson = today;
    localStorage.setItem('lo_streak', this.streak);
    localStorage.setItem('lo_last_lesson_date', today);
    if (this.streak >= 3) this.showToast(`🔥 ${this.streak} day streak!`, '#fb923c');
  },

  // ─── ACHIEVEMENTS ───
  BADGES: {
    first_lesson: { name: 'First Step', icon: '👣', desc: 'Complete your first lesson' },
    quiz_master: { name: 'Quiz Master', icon: '🧠', desc: 'Score 100% on any quiz' },
    speed_demon: { name: 'Speed Demon', icon: '⚡', desc: 'Complete a lesson in under 2 minutes' },
    streak_3: { name: 'On Fire', icon: '🔥', desc: '3-day streak' },
    streak_7: { name: 'Unstoppable', icon: '💫', desc: '7-day streak' },
    xp_100: { name: 'Century', icon: '💯', desc: 'Earn 100 XP' },
    xp_500: { name: 'Scholar', icon: '📚', desc: 'Earn 500 XP' },
    xp_1000: { name: 'Expert', icon: '🎓', desc: 'Earn 1,000 XP' },
    xp_5000: { name: 'Cyborg', icon: '🤖', desc: 'Earn 5,000 XP' },
    course_complete: { name: 'Graduate', icon: '🎉', desc: 'Complete a full course' },
  },

  unlockAchievement(id) {
    if (this.achievements.includes(id)) return;
    this.achievements.push(id);
    localStorage.setItem('lo_achievements', JSON.stringify(this.achievements));
    const badge = this.BADGES[id];
    if (badge) {
      this.sfx.badge();
      this.showBadge(badge);
      this.spawnParticles(window.innerWidth / 2, 100, '#fb923c', 30);
    }
  },

  checkAchievements() {
    if (this.xp >= 100) this.unlockAchievement('xp_100');
    if (this.xp >= 500) this.unlockAchievement('xp_500');
    if (this.xp >= 1000) this.unlockAchievement('xp_1000');
    if (this.xp >= 5000) this.unlockAchievement('xp_5000');
    if (this.streak >= 3) this.unlockAchievement('streak_3');
    if (this.streak >= 7) this.unlockAchievement('streak_7');
  },

  // ─── LESSON COMPLETION ───
  completeLesson(courseKey, lessonNum, xpAmount) {
    const key = `${courseKey}_lesson_${lessonNum}`;
    if (localStorage.getItem(key) === 'complete') return; // Already done
    localStorage.setItem(key, 'complete');
    this.addXP(xpAmount || 50);
    this.updateStreak();
    if (!this.achievements.includes('first_lesson')) {
      this.unlockAchievement('first_lesson');
    }
    this.sfx.complete();
  },

  // ─── PARTICLES ───
  spawnParticles(x, y, color, count = 15) {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;overflow:hidden';
    document.body.appendChild(container);
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const vel = 80 + Math.random() * 120;
      const size = 4 + Math.random() * 6;
      p.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${color};border-radius:50%;opacity:1;pointer-events:none;`;
      container.appendChild(p);
      const dx = Math.cos(angle) * vel;
      const dy = Math.sin(angle) * vel - 60;
      p.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px,${dy + 100}px) scale(0)`, opacity: 0 }
      ], { duration: 600 + Math.random() * 400, easing: 'cubic-bezier(.2,.6,.3,1)', fill: 'forwards' });
    }
    setTimeout(() => container.remove(), 1200);
  },

  // ─── TOAST ───
  showToast(msg, color = '#c084fc') {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = `position:fixed;top:20px;right:20px;background:${color};color:#000;padding:10px 20px;border-radius:10px;font-family:Inter,sans-serif;font-weight:700;font-size:14px;z-index:99999;opacity:0;transform:translateY(-10px);transition:all .3s;pointer-events:none;`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; });
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(-10px)'; }, 2000);
    setTimeout(() => toast.remove(), 2500);
  },

  // ─── BADGE OVERLAY ───
  showBadge(badge) {
    const overlay = document.createElement('div');
    overlay.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:99999;opacity:0;transition:opacity .3s" id="lo-badge-overlay">
        <div style="background:#111114;border:2px solid #fb923c;border-radius:24px;padding:40px;text-align:center;max-width:320px;transform:scale(.8);transition:transform .4s cubic-bezier(.34,1.56,.64,1)">
          <div style="font-size:64px;margin-bottom:12px">${badge.icon}</div>
          <div style="font-size:11px;color:#fb923c;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Achievement Unlocked</div>
          <div style="font-size:24px;font-weight:800;color:#e5e5e5;margin-bottom:8px">${badge.name}</div>
          <div style="font-size:14px;color:#737373">${badge.desc}</div>
          <button onclick="document.getElementById('lo-badge-overlay').remove()" style="margin-top:20px;background:#fb923c;color:#000;border:none;padding:8px 24px;border-radius:8px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Nice!</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    const el = document.getElementById('lo-badge-overlay');
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.querySelector('div > div').style.transform = 'scale(1)';
    });
  },

  // ─── INIT ───
  init() {
    this.updateXPDisplay();
    // Add floating XP indicator if not exists
    if (!document.getElementById('lo-xp-float')) {
      const xpFloat = document.createElement('div');
      xpFloat.id = 'lo-xp-float';
      xpFloat.innerHTML = `<span id="lo-xp-display">${this.xp.toLocaleString()} XP</span>`;
      xpFloat.style.cssText = 'position:fixed;top:16px;right:16px;background:rgba(17,17,20,.9);backdrop-filter:blur(8px);border:1px solid rgba(192,132,252,.2);padding:6px 14px;border-radius:20px;font-family:Inter,sans-serif;font-size:13px;font-weight:700;color:#c084fc;z-index:9998;';
      document.body.appendChild(xpFloat);
    }
    // Fade-in page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity .3s';
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
  }
};

// Auto-init on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => LO.init());
} else {
  LO.init();
}
