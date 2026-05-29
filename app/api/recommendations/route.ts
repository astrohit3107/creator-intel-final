import { NextRequest, NextResponse } from 'next/server';
import aiProcessor from '@/lib/ai-processor';
import instagramAPI from '@/lib/instagram-api';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const creatorId = request.nextUrl.searchParams.get('creatorId');

    if (!creatorId) {
      // Generate new recommendations
      const insights = await instagramAPI.getComprehensiveInsights();
      const recommendations = await aiProcessor.generateContentStrategy(insights);

      return NextResponse.json({
        success: true,
        recommendations,
      });
    } else {
      // Retrieve existing recommendations from Supabase
      const { data, error } = await supabaseAdmin
        .from('recommendations')
        .select('*')
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return NextResponse.json({
        success: true,
        recommendations: data || [],
      });
    }
  } catch (error) {
    console.error('Error in recommendations API:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch recommendations',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { creatorId, insights } = body;

    if (!creatorId || !insights) {
      return NextResponse.json(
        { error: 'Missing required fields: creatorId, insights' },
        { status: 400 }
      );
    }

    // Generate recommendations using Claude
    const recommendations = await aiProcessor.generateContentStrategy(insights);

    // Store in Supabase
    const stored = [];
    for (const rec of recommendations) {
      const { data, error } = await supabaseAdmin
        .from('recommendations')
        .insert({
          creator_id: creatorId,
          category: rec.category,
          title: rec.title,
          description: rec.description,
          priority: rec.priority,
          ai_generated: true,
        })
        .select()
        .single();

      if (!error && data) {
        stored.push(data);
      }
    }

    return NextResponse.json({
      success: true,
      recommendations: stored,
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate recommendations',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
