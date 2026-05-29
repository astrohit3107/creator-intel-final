import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Creator Intel - AI-Powered Instagram Analytics',
  description: 'Get AI-generated insights and actionable recommendations to grow your Instagram presence',
  keywords: ['Instagram', 'Analytics', 'Creator', 'Growth', 'AI', 'Insights'],
  authors: [{ name: 'Creator Intel Team' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Creator Intel',
    description: 'AI-Powered Instagram Analytics for Content Creators',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
