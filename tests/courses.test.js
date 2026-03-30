import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CONTENT_DIR = join(process.cwd(), 'content', 'academy');
const COURSES_JSON = join(CONTENT_DIR, 'courses.json');

describe('academy courses', () => {
  it('courses.json exists and parses', () => {
    expect(existsSync(COURSES_JSON)).toBe(true);
    const data = JSON.parse(readFileSync(COURSES_JSON, 'utf-8'));
    const courses = data.tiers?.flatMap(t => t.courses || []) || data;
    expect(Array.isArray(courses)).toBe(true);
    expect(courses.length).toBeGreaterThan(0);
  });

  it('each course has required fields', () => {
    const data = JSON.parse(readFileSync(COURSES_JSON, 'utf-8'));
    const courses = data.tiers?.flatMap(t => t.courses || []) || data;
    for (const course of courses) {
      expect(course.slug, `Course missing slug`).toBeTruthy();
      expect(course.title, `${course.slug} missing title`).toBeTruthy();
      expect(course.description, `${course.slug} missing description`).toBeTruthy();
      expect(course.status, `${course.slug} missing status`).toBeTruthy();
    }
  });

  it('courses have valid tiers', () => {
    const data = JSON.parse(readFileSync(COURSES_JSON, 'utf-8'));
    const courses = data.tiers?.flatMap(t => t.courses || []) || data;
    const validTiers = ['beginner', 'intermediate', 'advanced', 'professional', 'specialist'];
    for (const course of courses) {
      expect(validTiers, `${course.slug} has invalid tier: ${course.tier}`).toContain(course.tier);
    }
  });

  it('no duplicate course slugs', () => {
    const data = JSON.parse(readFileSync(COURSES_JSON, 'utf-8'));
    const courses = data.tiers?.flatMap(t => t.courses || []) || data;
    const slugs = courses.map(c => c.slug);
    const unique = new Set(slugs);
    expect(slugs.length).toBe(unique.size);
  });

  it('tiers have names and slugs', () => {
    const data = JSON.parse(readFileSync(COURSES_JSON, 'utf-8'));
    expect(data.tiers).toBeTruthy();
    for (const tier of data.tiers) {
      expect(tier.name).toBeTruthy();
      expect(tier.slug).toBeTruthy();
      expect(Array.isArray(tier.courses)).toBe(true);
    }
  });
});
