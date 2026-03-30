import { describe, it, expect } from 'vitest';
import { site, colors, fonts, nav, academy, footer } from '../lib/site-config.js';

describe('site-config', () => {
  it('has required site fields', () => {
    expect(site.name).toBe('Like One');
    expect(site.domain).toBe('likeone.ai');
    expect(site.url).toBe('https://likeone.ai');
    expect(site.email).toContain('@likeone.ai');
    expect(site.founder).toBeTruthy();
  });

  it('has brand colors', () => {
    expect(colors.purple).toBeTruthy();
    expect(colors.blue).toBeTruthy();
    expect(colors.pageBg).toBe('#08080a');
    expect(colors.textPrimary).toBeTruthy();
  });

  it('has font config', () => {
    expect(fonts.primary).toContain('Inter');
    expect(fonts.mono).toContain('Mono');
  });

  it('has nav variants with links', () => {
    expect(nav.core.length).toBeGreaterThan(0);
    expect(nav.main.length).toBeGreaterThan(0);
    expect(nav.blog.length).toBeGreaterThan(0);
    expect(nav.site.length).toBeGreaterThan(0);
    // All links have label and href
    for (const variant of [nav.core, nav.main, nav.blog, nav.site]) {
      for (const link of variant) {
        expect(link.label).toBeTruthy();
        expect(link.href).toBeTruthy();
      }
    }
  });

  it('has academy config', () => {
    expect(academy.courseCount).toBeGreaterThan(0);
    expect(academy.lessonCount).toBeGreaterThan(0);
    expect(academy.monthlyPrice).toContain('$');
  });

  it('has footer config with legal links', () => {
    expect(footer.text).toContain('Like One');
    expect(footer.links.length).toBeGreaterThanOrEqual(2);
    const hasPrivacy = footer.links.some(l => l.label.toLowerCase().includes('privacy'));
    const hasTerms = footer.links.some(l => l.label.toLowerCase().includes('terms'));
    expect(hasPrivacy).toBe(true);
    expect(hasTerms).toBe(true);
  });
});
