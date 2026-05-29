import { NextRequest, NextResponse } from 'next/server';
import instagramAPI from '@/lib/instagram-api';
import aiProcessor from '@/lib/ai-processor';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Fetch Instagram metrics
    const insights = await instagramAPI.getComprehensiveInsights();

    if (!insights) {
      return NextResponse.json(
        { error: 'Failed to fetch Instagram insights' },
        { status: 500 }
      );
    }

    // Analyze with Claude
    const analysis = await aiProcessor.analyzeInsights(insights);

    // Store in Supabase
    const { data: creator, error: creatorError } = await supabaseAdmin
      .from('creators')
      .upsert(
        {
          instagram_username: insights.username,
          instagram_id: insights.ig_id,
          followers_count: insights.followers_count,
          engagement_rate: insights.engagement_rate,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'instagram_id' }
      )
      .select()
      .single();

    if (creatorError) {
      console.error('Error storing creator:', creatorError);
    }

    // Store metrics
    if (creator) {
      const metricsToStore = [
        { metric_name: 'followers_count', metric_value: insights.followers_count },
        { metric_name: 'engagement_rate', metric_value: insights.engagement_rate },
        { metric_name: 'reach', metric_value: insights.reach },
        { metric_name: 'impressions', metric_value: insights.impressions },
      ];

      for (const metric of metricsToStore) {
        await supabaseAdmin.from('insight_metrics').insert({
          creator_id: creator.id,
          metric_name: metric.metric_name,
          metric_value: metric.metric_value,
        });
      }
    }

    return NextResponse.json({
      success: true,
      insights,
      analysis,
      creatorId: creator?.id,
    });
  } catch (error) {
    console.error('Error in insights API:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch and analyze insights',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
