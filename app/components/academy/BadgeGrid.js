'use client';
import AchievementBadge from './AchievementBadge';

const ALL_BADGES = [
  // Milestone badges
  { id: 'first-lesson', emoji: '👣', name: 'First Steps', desc: 'Complete your first lesson' },
  { id: 'lessons-10', emoji: '📚', name: 'Getting Serious', desc: 'Complete 10 lessons' },
  { id: 'lessons-50', emoji: '🎓', name: 'Scholar', desc: 'Complete 50 lessons' },
  { id: 'lessons-100', emoji: '💯', name: 'Centurion', desc: 'Complete 100 lessons' },
  { id: 'first-course', emoji: '🏆', name: 'Course Clear', desc: 'Complete your first course' },
  { id: 'courses-5', emoji: '🌟', name: 'Polymath', desc: 'Complete 5 courses' },
  { id: 'courses-10', emoji: '👑', name: 'Academy Legend', desc: 'Complete 10 courses' },
  { id: 'streak-3', emoji: '🔥', name: 'On a Roll', desc: '3-day learning streak' },
  { id: 'streak-7', emoji: '⚔️', name: 'Week Warrior', desc: '7-day learning streak' },
  { id: 'streak-30', emoji: '💎', name: 'Unstoppable', desc: '30-day learning streak' },
  // Skill badges
  { id: 'skill-prompts', emoji: '⚡', name: 'Prompt Engineer', desc: 'Complete Advanced Prompt Engineering' },
  { id: 'skill-agents', emoji: '🤖', name: 'Agent Builder', desc: 'Complete Building AI Agents' },
  { id: 'skill-automation', emoji: '⚙️', name: 'Automation Pro', desc: 'Complete Make.com + Zapier' },
  { id: 'skill-data', emoji: '📊', name: 'Data Whisperer', desc: 'Complete Data Analysis with AI' },
  { id: 'skill-rag', emoji: '🔍', name: 'RAG Architect', desc: 'Complete RAG & Vector Search' },
  { id: 'skill-mcp', emoji: '🔌', name: 'MCP Developer', desc: 'Complete MCP Server Development' },
  { id: 'skill-claude', emoji: '🧠', name: 'Claude Expert', desc: 'Complete Claude Masterclass' },
  { id: 'skill-content', emoji: '🎨', name: 'AI Creator', desc: 'Complete AI Content Studio' },
  { id: 'skill-business', emoji: '💼', name: 'One-Person Army', desc: 'Complete One-Person AI Business' },
  { id: 'skill-cinema', emoji: '🎬', name: 'Cinema Director', desc: 'Complete AI Cinema Production' },
  // Rare badges
  { id: 'rare-night', emoji: '🦉', name: 'Night Owl', desc: 'Learn between midnight and 5am', rare: true },
  { id: 'rare-speed', emoji: '⚡', name: 'Speed Demon', desc: '3 lessons in one session', rare: true },
  { id: 'rare-explorer', emoji: '🗺️', name: 'Explorer', desc: 'Visit 20 different courses', rare: true },
  { id: 'rare-perfect', emoji: '💯', name: 'Perfectionist', desc: '100% on 5 quizzes', rare: true },
  { id: 'rare-early', emoji: '🌅', name: 'Early Adopter', desc: 'Joined in 2026', rare: true },
];

export default function BadgeGrid({ earnedBadges = [] }) {
  const earnedSet = new Set(earnedBadges);

  return (
    <div className="badge-grid-container">
      <div className="badge-grid-header">
        <h3>Badges</h3>
        <span className="badge-count">{earnedBadges.length}/{ALL_BADGES.length}</span>
      </div>
      <div className="badge-grid">
        {ALL_BADGES.map((badge) => (
          <AchievementBadge
            key={badge.id}
            emoji={badge.emoji}
            name={badge.name}
            desc={badge.desc}
            earned={earnedSet.has(badge.id)}
            rare={badge.rare}
          />
        ))}
      </div>
    </div>
  );
}
