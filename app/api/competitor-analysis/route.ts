import { NextRequest, NextResponse } from 'next/server';
import competitorAnalyzer from '@/lib/competitor-analyzer';
import instagramAPI from '@/lib/instagram-api';

export async function GET(request: NextRequest) {
  try {
    const competitors = request.nextUrl.searchParams.get('competitors');
    const niche = request.nextUrl.searchParams.get('niche') || 'general';

    if (!competitors) {
      return NextResponse.json(
        { error: 'Missing required parameter: competitors (comma-separated)' },
        { status: 400 }
      );
    }

    // Get your metrics
    const yourMetrics = await instagramAPI.getComprehensiveInsights();

    // Parse competitor list
    const competitorList = competitors.split(',').map((c: string) => c.trim());

    // Analyze competitors
    const analysis = await competitorAnalyzer.analyzeCompetitors(
      competitorList,
      yourMetrics
    );

    // Get benchmarks
    const benchmarks = await competitorAnalyzer.getBenchmarks(niche, yourMetrics);

    return NextResponse.json({
      success: true,
      your_metrics: yourMetrics,
      competitor_analysis: analysis,
      benchmarks,
    });
  } catch (error) {
    console.error('Error in competitor analysis API:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze competitors',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
