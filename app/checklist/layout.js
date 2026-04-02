export const metadata = {
  title: 'AI Readiness Checklist — Score Your Team | Like One',
  description: "Assess your organization's AI readiness with our free interactive checklist. Score across 8 categories, identify gaps, and get a personalized AI adoption plan.",
  alternates: { canonical: 'https://likeone.ai/checklist/' },
  openGraph: {
    title: 'AI Readiness Checklist — Score Your Team | Like One',
    description: "Free interactive AI readiness assessment. Score across 8 categories and get your personalized adoption plan.",
    url: 'https://likeone.ai/checklist/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Readiness Checklist — Like One',
    description: 'Free interactive AI readiness assessment. Score your team across 8 categories.',
  },
};

export default function ChecklistLayout({ children }) {
  return children;
}
