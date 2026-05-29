import { NextResponse } from 'next/server';
import instagramAPI from '@/lib/instagram-api';
import aiProcessor from '@/lib/ai-processor';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch Instagram metrics
    const insights = await instagramAPI.getComprehensiveInsights();

    // Get AI analysis
    const analysis = await aiProcessor.analyzeInsights(insights);

    // Store in database if needed
    if (insights.id) {
      await supabase.from('insight_metrics').insert({
        creator_id: insights.id,
        metric_name: 'engagement_rate',
        metric_value: insights.engagement_rate,
      });
    }

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
