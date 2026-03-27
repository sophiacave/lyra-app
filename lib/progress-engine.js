/**
 * Like One Progress Engine
 * XP, levels, streaks, achievements — all localStorage for MVP.
 * Designed to migrate to Supabase when auth is ready.
 */

const STORAGE_KEY = 'likeone-profile';
const LEGACY_KEY = 'likeone-progress';

// ── XP Values ──
const XP = {
  LESSON_COMPLETE: 50,
  EXERCISE_COMPLETE: 25,
  COURSE_COMPLETE: 200,
  STREAK_BONUS: 10, // per streak day
};

// ── Level Thresholds ──
const LEVELS = [
  { level: 1, xp: 0, name: 'Novice', emoji: '🌱' },
  { level: 2, xp: 100, name: 'Explorer', emoji: '🔭' },
  { level: 3, xp: 300, name: 'Practitioner', emoji: '⚡' },
  { level: 4, xp: 600, name: 'Builder', emoji: '🔧' },
  { level: 5, xp: 1000, name: 'Architect', emoji: '🏗️' },
  { level: 6, xp: 1500, name: 'Master', emoji: '🎯' },
  { level: 7, xp: 2500, name: 'Visionary', emoji: '🔮' },
  { level: 8, xp: 4000, name: 'Sage', emoji: '🧠' },
  { level: 9, xp: 6000, name: 'Legend', emoji: '⭐' },
  { level: 10, xp: 10000, name: 'Transcendent', emoji: '✦' },
];

// ── Achievement Definitions ──
const ACHIEVEMENTS = {
  'first-lesson': { name: 'First Steps', desc: 'Complete your first lesson', emoji: '👣', check: (p) => Object.keys(p.lessons).length >= 1 },
  'lessons-10': { name: 'Getting Serious', desc: 'Complete 10 lessons', emoji: '📚', check: (p) => Object.keys(p.lessons).length >= 10 },
  'lessons-50': { name: 'Scholar', desc: 'Complete 50 lessons', emoji: '🎓', check: (p) => Object.keys(p.lessons).length >= 50 },
  'lessons-100': { name: 'Centurion', desc: 'Complete 100 lessons', emoji: '💯', check: (p) => Object.keys(p.lessons).length >= 100 },
  'first-course': { name: 'Course Clear', desc: 'Complete your first course', emoji: '🏆', check: (p) => p.coursesCompleted >= 1 },
  'courses-5': { name: 'Polymath', desc: 'Complete 5 courses', emoji: '🌟', check: (p) => p.coursesCompleted >= 5 },
  'courses-10': { name: 'Academy Legend', desc: 'Complete 10 courses', emoji: '👑', check: (p) => p.coursesCompleted >= 10 },
  'streak-3': { name: 'On a Roll', desc: '3-day learning streak', emoji: '🔥', check: (p) => p.streak.best >= 3 },
  'streak-7': { name: 'Week Warrior', desc: '7-day learning streak', emoji: '⚔️', check: (p) => p.streak.best >= 7 },
  'streak-30': { name: 'Unstoppable', desc: '30-day learning streak', emoji: '💎', check: (p) => p.streak.best >= 30 },
  'xp-500': { name: 'Half K', desc: 'Earn 500 XP', emoji: '✨', check: (p) => p.xp >= 500 },
  'xp-1000': { name: 'Grand', desc: 'Earn 1,000 XP', emoji: '💫', check: (p) => p.xp >= 1000 },
  'xp-5000': { name: 'Five Star', desc: 'Earn 5,000 XP', emoji: '🌠', check: (p) => p.xp >= 5000 },
  'level-5': { name: 'Architect', desc: 'Reach Level 5', emoji: '🏗️', check: (p) => getLevel(p.xp).level >= 5 },
  'level-10': { name: 'Transcendent', desc: 'Reach Level 10', emoji: '✦', check: (p) => getLevel(p.xp).level >= 10 },
};

// ── Core Functions ──

function defaultProfile() {
  return {
    xp: 0,
    lessons: {},      // { "course/lesson": timestamp }
    exercises: {},     // { "course/lesson/idx": timestamp }
    streak: { current: 0, best: 0, lastDate: null },
    achievements: [],  // ["first-lesson", ...]
    coursesCompleted: 0,
    createdAt: Date.now(),
  };
}

export function getProfile() {
  if (typeof window === 'undefined') return defaultProfile();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultProfile(), ...JSON.parse(stored) };

    // Migrate from legacy progress format
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const lessons = JSON.parse(legacy);
      const profile = defaultProfile();
      profile.lessons = lessons;
      profile.xp = Object.keys(lessons).length * XP.LESSON_COMPLETE;
      saveProfile(profile);
      return profile;
    }

    return defaultProfile();
  } catch {
    return defaultProfile();
  }
}

export function saveProfile(profile) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    // Keep legacy key in sync for backward compatibility
    localStorage.setItem(LEGACY_KEY, JSON.stringify(profile.lessons));
    // Notify listeners (status bar, etc.)
    window.dispatchEvent(new Event('likeone-progress'));
  } catch {}
}

export function getLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(xp) {
  const current = getLevel(xp);
  const idx = LEVELS.findIndex(l => l.level === current.level);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function getLevelProgress(xp) {
  const current = getLevel(xp);
  const next = getNextLevel(xp);
  if (!next) return 100; // max level
  const range = next.xp - current.xp;
  const progress = xp - current.xp;
  return Math.round((progress / range) * 100);
}

// ── Streak Logic ──

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function updateStreak(profile) {
  const today = todayStr();
  if (profile.streak.lastDate === today) return; // already counted today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (profile.streak.lastDate === yesterdayStr) {
    // Continuing streak
    profile.streak.current += 1;
  } else {
    // Streak broken or first day
    profile.streak.current = 1;
  }

  profile.streak.lastDate = today;
  if (profile.streak.current > profile.streak.best) {
    profile.streak.best = profile.streak.current;
  }

  // Streak bonus XP
  profile.xp += XP.STREAK_BONUS * Math.min(profile.streak.current, 30);
}

// ── Achievement Check ──

export function checkAchievements(profile) {
  const newAchievements = [];
  for (const [id, def] of Object.entries(ACHIEVEMENTS)) {
    if (!profile.achievements.includes(id) && def.check(profile)) {
      profile.achievements.push(id);
      newAchievements.push({ id, ...def });
    }
  }
  return newAchievements;
}

// ── Actions ──

export function completeLesson(courseSlug, lessonSlug) {
  const profile = getProfile();
  const key = `${courseSlug}/${lessonSlug}`;

  if (profile.lessons[key]) return { profile, newAchievements: [], leveledUp: false, xpGained: 0 };

  const prevLevel = getLevel(profile.xp);

  profile.lessons[key] = Date.now();
  profile.xp += XP.LESSON_COMPLETE;
  updateStreak(profile);

  const newAchievements = checkAchievements(profile);
  const newLevel = getLevel(profile.xp);
  const leveledUp = newLevel.level > prevLevel.level;

  saveProfile(profile);
  return { profile, newAchievements, leveledUp, xpGained: XP.LESSON_COMPLETE, newLevel: leveledUp ? newLevel : null };
}

export function uncompleteLesson(courseSlug, lessonSlug) {
  const profile = getProfile();
  const key = `${courseSlug}/${lessonSlug}`;

  if (!profile.lessons[key]) return { profile };

  delete profile.lessons[key];
  // Don't remove XP — it's earned permanently
  saveProfile(profile);
  return { profile };
}

export function completeExercise(courseSlug, lessonSlug, exerciseIndex) {
  const profile = getProfile();
  const key = `${courseSlug}/${lessonSlug}/${exerciseIndex}`;

  if (profile.exercises[key]) return { profile, newAchievements: [], leveledUp: false, xpGained: 0 };

  const prevLevel = getLevel(profile.xp);

  profile.exercises[key] = Date.now();
  profile.xp += XP.EXERCISE_COMPLETE;

  const newAchievements = checkAchievements(profile);
  const newLevel = getLevel(profile.xp);
  const leveledUp = newLevel.level > prevLevel.level;

  saveProfile(profile);
  return { profile, newAchievements, leveledUp, xpGained: XP.EXERCISE_COMPLETE, newLevel: leveledUp ? newLevel : null };
}

export function completeCourse(courseSlug) {
  const profile = getProfile();
  const prevLevel = getLevel(profile.xp);

  profile.coursesCompleted = (profile.coursesCompleted || 0) + 1;
  profile.xp += XP.COURSE_COMPLETE;

  const newAchievements = checkAchievements(profile);
  const newLevel = getLevel(profile.xp);
  const leveledUp = newLevel.level > prevLevel.level;

  saveProfile(profile);
  return { profile, newAchievements, leveledUp, xpGained: XP.COURSE_COMPLETE, newLevel: leveledUp ? newLevel : null };
}

// ── Getters ──

export function getAchievementDef(id) {
  return ACHIEVEMENTS[id] || null;
}

export function getAllAchievements() {
  return Object.entries(ACHIEVEMENTS).map(([id, def]) => ({ id, ...def }));
}

export function getLevels() {
  return LEVELS;
}

export { XP, LEVELS, ACHIEVEMENTS };
