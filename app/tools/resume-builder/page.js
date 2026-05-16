'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const EMPTY_RESUME = {
  name: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '',
  summary: '',
  experience: [{ company: '', role: '', dates: '', bullets: '' }],
  education: [{ school: '', degree: '', dates: '', details: '' }],
  skills: '',
  certifications: '',
};

function renderResume(data) {
  const exp = data.experience.filter(e => e.company || e.role).map(e => {
    const bullets = e.bullets.split('\n').filter(b => b.trim()).map(b =>
      `<li>${b.trim().replace(/^[-•]\s*/, '')}</li>`
    ).join('');
    return `<div class="rv-exp-item">
      <div class="rv-exp-header"><strong>${e.role || ''}</strong>${e.company ? ` — ${e.company}` : ''}</div>
      <div class="rv-exp-dates">${e.dates || ''}</div>
      ${bullets ? `<ul class="rv-bullets">${bullets}</ul>` : ''}
    </div>`;
  }).join('');

  const edu = data.education.filter(e => e.school || e.degree).map(e =>
    `<div class="rv-edu-item">
      <div class="rv-edu-header"><strong>${e.degree || ''}</strong>${e.school ? ` — ${e.school}` : ''}</div>
      <div class="rv-edu-dates">${e.dates || ''}</div>
      ${e.details ? `<div class="rv-edu-details">${e.details}</div>` : ''}
    </div>`
  ).join('');

  const contact = [data.email, data.phone, data.location, data.linkedin, data.website]
    .filter(Boolean).join(' | ');

  const skills = data.skills ? `<div class="rv-section"><div class="rv-section-title">Skills</div><p>${data.skills}</p></div>` : '';
  const certs = data.certifications ? `<div class="rv-section"><div class="rv-section-title">Certifications</div><p>${data.certifications}</p></div>` : '';

  return `<div class="rv-resume">
    <div class="rv-header">
      <div class="rv-name">${data.name || 'Your Name'}</div>
      ${data.title ? `<div class="rv-title">${data.title}</div>` : ''}
      ${contact ? `<div class="rv-contact">${contact}</div>` : ''}
    </div>
    ${data.summary ? `<div class="rv-section"><div class="rv-section-title">Summary</div><p>${data.summary}</p></div>` : ''}
    ${exp ? `<div class="rv-section"><div class="rv-section-title">Experience</div>${exp}</div>` : ''}
    ${edu ? `<div class="rv-section"><div class="rv-section-title">Education</div>${edu}</div>` : ''}
    ${skills}
    ${certs}
  </div>`;
}

export default function ResumeBuilder() {
  const [data, setData] = useState(EMPTY_RESUME);
  const [generated, setGenerated] = useState(false);
  const previewRef = useRef(null);

  function update(field, value) {
    setData(prev => ({ ...prev, [field]: value }));
  }

  function updateExp(index, field, value) {
    setData(prev => {
      const exp = [...prev.experience];
      exp[index] = { ...exp[index], [field]: value };
      return { ...prev, experience: exp };
    });
  }

  function addExp() {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', role: '', dates: '', bullets: '' }],
    }));
  }

  function updateEdu(index, field, value) {
    setData(prev => {
      const edu = [...prev.education];
      edu[index] = { ...edu[index], [field]: value };
      return { ...prev, education: edu };
    });
  }

  function addEdu() {
    setData(prev => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', dates: '', details: '' }],
    }));
  }

  function generate() {
    setGenerated(true);
  }

  function downloadPdf() {
    const printWindow = window.open('', '_blank');
    const html = renderResume(data);
    printWindow.document.write(`<!DOCTYPE html><html><head>
      <title>${data.name || 'Resume'}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; line-height: 1.5; padding: 40px 50px; max-width: 800px; margin: 0 auto; }
        .rv-resume { font-size: 11pt; }
        .rv-header { text-align: center; margin-bottom: 16px; border-bottom: 2px solid #1a1a1a; padding-bottom: 12px; }
        .rv-name { font-size: 22pt; font-weight: 700; letter-spacing: 0.5px; }
        .rv-title { font-size: 11pt; color: #555; margin-top: 2px; }
        .rv-contact { font-size: 9pt; color: #666; margin-top: 6px; }
        .rv-section { margin-bottom: 14px; }
        .rv-section-title { font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-bottom: 8px; color: #333; }
        .rv-section p { font-size: 10.5pt; color: #333; }
        .rv-exp-item { margin-bottom: 10px; }
        .rv-exp-header { font-size: 10.5pt; }
        .rv-exp-dates { font-size: 9pt; color: #666; margin-bottom: 4px; }
        .rv-bullets { padding-left: 18px; font-size: 10pt; color: #333; }
        .rv-bullets li { margin-bottom: 2px; }
        .rv-edu-item { margin-bottom: 6px; }
        .rv-edu-header { font-size: 10.5pt; }
        .rv-edu-dates { font-size: 9pt; color: #666; }
        .rv-edu-details { font-size: 9.5pt; color: #555; }
        @media print { body { padding: 20px 30px; } }
      </style>
    </head><body>${html}</body></html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
  }

  return (
    <div className="site-page">
      <Header variant="site" />
      <main id="main-content" className="tool-main">
        <section className="site-section-sm text-center">
          <span className="site-section-tag">Free Tool</span>
          <h1 className="tool-title">Resume Builder</h1>
          <p className="tool-desc">
            Build a clean, ATS-optimized resume in minutes. Professional formatting. Print to PDF. No signup.
          </p>
        </section>

        <section className="site-section-sm">
          <div className="site-container tool-container">
            <div className="tool-grid">
              {/* LEFT: Form */}
              <div className="tool-form">
                <div className="tool-field">
                  <label className="tool-label">Full Name</label>
                  <input type="text" className="tool-input" placeholder="Sophie Cave" value={data.name} onChange={e => update('name', e.target.value)} />
                </div>
                <div className="tool-field">
                  <label className="tool-label">Title</label>
                  <input type="text" className="tool-input" placeholder="AI Engineer" value={data.title} onChange={e => update('title', e.target.value)} />
                </div>
                <div className="tool-row-3">
                  <div className="tool-field">
                    <label className="tool-label">Email</label>
                    <input type="email" className="tool-input" placeholder="you@email.com" value={data.email} onChange={e => update('email', e.target.value)} />
                  </div>
                  <div className="tool-field">
                    <label className="tool-label">Phone</label>
                    <input type="tel" className="tool-input" placeholder="555-123-4567" value={data.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                  <div className="tool-field">
                    <label className="tool-label">Location</label>
                    <input type="text" className="tool-input" placeholder="San Francisco, CA" value={data.location} onChange={e => update('location', e.target.value)} />
                  </div>
                </div>
                <div className="tool-field">
                  <label className="tool-label">Professional Summary</label>
                  <textarea className="tool-textarea" rows={3} placeholder="2-3 sentences about your experience and what you bring..."
                    value={data.summary} onChange={e => update('summary', e.target.value)} />
                </div>

                {/* Experience */}
                <div className="tool-field">
                  <label className="tool-label">Experience</label>
                  {data.experience.map((exp, i) => (
                    <div key={i} className="tool-group">
                      <div className="tool-row-3">
                        <div className="tool-field"><input type="text" className="tool-input" placeholder="Company" value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} /></div>
                        <div className="tool-field"><input type="text" className="tool-input" placeholder="Role / Title" value={exp.role} onChange={e => updateExp(i, 'role', e.target.value)} /></div>
                        <div className="tool-field"><input type="text" className="tool-input" placeholder="2024 - Present" value={exp.dates} onChange={e => updateExp(i, 'dates', e.target.value)} /></div>
                      </div>
                      <textarea className="tool-textarea" rows={3} placeholder="Key accomplishments (one per line)..." value={exp.bullets} onChange={e => updateExp(i, 'bullets', e.target.value)} />
                    </div>
                  ))}
                  <button className="tool-detect-toggle" onClick={addExp} type="button">+ Add Experience</button>
                </div>

                {/* Education */}
                <div className="tool-field">
                  <label className="tool-label">Education</label>
                  {data.education.map((edu, i) => (
                    <div key={i} className="tool-group">
                      <div className="tool-row-3">
                        <div className="tool-field"><input type="text" className="tool-input" placeholder="School" value={edu.school} onChange={e => updateEdu(i, 'school', e.target.value)} /></div>
                        <div className="tool-field"><input type="text" className="tool-input" placeholder="Degree" value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} /></div>
                        <div className="tool-field"><input type="text" className="tool-input" placeholder="2020 - 2024" value={edu.dates} onChange={e => updateEdu(i, 'dates', e.target.value)} /></div>
                      </div>
                    </div>
                  ))}
                  <button className="tool-detect-toggle" onClick={addEdu} type="button">+ Add Education</button>
                </div>

                <div className="tool-field">
                  <label className="tool-label">Skills</label>
                  <textarea className="tool-textarea" rows={2} placeholder="Python, TypeScript, React, AWS, Claude API, MCP..."
                    value={data.skills} onChange={e => update('skills', e.target.value)} />
                </div>

                <div className="tool-field">
                  <label className="tool-label">Certifications <span className="tool-optional">(optional)</span></label>
                  <input type="text" className="tool-input" placeholder="AWS Solutions Architect, PMP..." value={data.certifications} onChange={e => update('certifications', e.target.value)} />
                </div>

                <button onClick={generate} className="tool-generate-btn" type="button">
                  Generate Resume
                </button>
              </div>

              {/* RIGHT: Preview */}
              <div className="tool-output-panel" ref={previewRef}>
                <div className="tool-output-header">
                  <span className="tool-output-title">Resume Preview</span>
                  {generated && (
                    <div className="tool-output-actions">
                      <button onClick={downloadPdf} className="tool-action-btn tool-action-primary" type="button">
                        Print / Save PDF
                      </button>
                    </div>
                  )}
                </div>
                <div className="rv-preview-container">
                  {generated ? (
                    <div dangerouslySetInnerHTML={{ __html: renderResume(data) }} />
                  ) : (
                    <div className="rv-placeholder">Fill in your details and click Generate to preview your resume</div>
                  )}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="tool-cta">
              <h3 className="tool-cta-title">Level up your career with AI</h3>
              <p className="tool-cta-desc">
                Learn to build AI agents, automate workflows, and stand out in the job market.
                52 courses, 520+ lessons.
              </p>
              <div className="tool-cta-btns">
                <Link href="/academy/" className="site-btn-primary">Browse AI Courses</Link>
                <Link href="/pricing/" className="tool-cta-secondary">65% off Annual Plan</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="site" />
    </div>
  );
}
