import { NextResponse } from 'next/server';
import instagramAPI from '@/lib/instagram-api';
import aiProcessor from '@/lib/ai-processor';

export async function GET() {
  try {
    // Fetch Instagram metrics
    const insights = await instagramAPI.getComprehensiveInsights();

    // Get AI analysis
    const analysis = await aiProcessor.analyzeInsights(insights);

    return NextResponse.json({
      success: true,
      insights,
      analysis,
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch insights',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
