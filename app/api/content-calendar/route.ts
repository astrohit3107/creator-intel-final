import { NextRequest, NextResponse } from 'next/server';
import contentCalendar from '@/lib/content-calendar';
import instagramAPI from '@/lib/instagram-api';

export async function GET(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get('action');
    const creatorId = request.nextUrl.searchParams.get('creatorId');

    if (!creatorId) {
      return NextResponse.json(
        { error: 'Missing required parameter: creatorId' },
        { status: 400 }
      );
    }

    let response: any = {};

    switch (action) {
      case 'upcoming':
        response = await contentCalendar.getUpcomingPosts(creatorId);
        break;

      case 'month':
        const month = parseInt(request.nextUrl.searchParams.get('month') || '0');
        const year = parseInt(request.nextUrl.searchParams.get('year') || '0');
        if (!month || !year) {
          return NextResponse.json(
            { error: 'Missing month and year parameters' },
            { status: 400 }
          );
        }
        response = await contentCalendar.getCalendarMonth(
          creatorId,
          month,
          year
        );
        break;

      case 'stats':
        response = await contentCalendar.getContentStats(creatorId);
        break;

      case 'generate-ideas':
        const niche = request.nextUrl.searchParams.get('niche') || 'general';
        const metrics = await instagramAPI.getComprehensiveInsights();
        response = await contentCalendar.generateContentIdeas(
          metrics,
          niche,
          10
        );
        break;

      case 'posting-times':
        const metrics2 = await instagramAPI.getComprehensiveInsights();
        response = await contentCalendar.suggestOptimalPostingTimes(metrics2);
        break;

      case 'weekly-strategy':
        const niche2 = request.nextUrl.searchParams.get('niche') || 'general';
        const metrics3 = await instagramAPI.getComprehensiveInsights();
        response = await contentCalendar.generateWeeklyStrategy(metrics3, niche2);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error in content calendar API (GET):', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch content calendar data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, creatorId, plan, updates, planId } = body;

    if (!creatorId) {
      return NextRequest.json(
        { error: 'Missing required field: creatorId' },
        { status: 400 }
      );
    }

    let response: any = {};

    switch (action) {
      case 'create':
        if (!plan) {
          return NextResponse.json(
            { error: 'Missing required field: plan' },
            { status: 400 }
          );
        }
        response = await contentCalendar.createContentPlan({
          ...plan,
          creator_id: creatorId,
        });
        break;

      case 'update':
        if (!planId || !updates) {
          return NextResponse.json(
            { error: 'Missing required fields: planId or updates' },
            { status: 400 }
          );
        }
        response = await contentCalendar.updateContentPlan(planId, updates);
        break;

      case 'delete':
        if (!planId) {
          return NextResponse.json(
            { error: 'Missing required field: planId' },
            { status: 400 }
          );
        }
        await contentCalendar.deleteContentPlan(planId);
        response = { deleted: true };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error in content calendar API (POST):', error);
    return NextResponse.json(
      {
        error: 'Failed to process content calendar request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
