import { NextResponse } from 'next/server';
import instagramAPI from '@/lib/instagram-api';
import aiProcessor from '@/lib/ai-processor';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Step 1: Check environment variables
    console.log('=== DIAGNOSTICS START ===');
    console.log('Step 1: Checking environment variables...');

    const requiredEnvVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ SET' : '✗ MISSING',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ SET' : '✗ MISSING',
      GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY ? '✓ SET' : '✗ MISSING',
      INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN ? '✓ SET' : '✗ MISSING',
      INSTAGRAM_BUSINESS_ACCOUNT_ID: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID ? '✓ SET' : '✗ MISSING',
    };

    console.log('Environment Variables:', requiredEnvVars);

    // Step 2: Test Supabase connection
    console.log('Step 2: Testing Supabase connection...');
    try {
      const { data: testData, error: testError } = await supabaseAdmin
        .from('creators')
        .select('count(*)', { count: 'exact', head: true });
      
      if (testError) {
        console.error('❌ Supabase Error:', testError);
        return NextResponse.json({
          error: 'Supabase Connection Failed',
          details: testError.message,
          step: 'Supabase connection test',
          envStatus: requiredEnvVars,
        }, { status: 500 });
      }
      console.log('✅ Supabase connection OK');
    } catch (supabaseErr) {
      console.error('❌ Supabase connection error:', supabaseErr);
      return NextResponse.json({
        error: 'Supabase Error',
        details: supabaseErr instanceof Error ? supabaseErr.message : 'Unknown error',
        step: 'Supabase connection',
        envStatus: requiredEnvVars,
      }, { status: 500 });
    }

    // Step 3: Test Instagram API
    console.log('Step 3: Testing Instagram API...');
    try {
      const insights = await instagramAPI.getComprehensiveInsights();
      
      if (!insights) {
        console.error('❌ No insights returned from Instagram API');
        return NextResponse.json({
          error: 'Instagram API Failed',
          details: 'No insights data returned',
          step: 'Instagram API call',
          envStatus: requiredEnvVars,
        }, { status: 500 });
      }
      console.log('✅ Instagram API OK, got insights for:', insights.username);

      // Step 4: Test Gemini AI
      console.log('Step 4: Testing Google Gemini AI...');
      try {
        const analysis = await aiProcessor.analyzeInsights(insights);
        console.log('✅ Gemini AI OK');

        // Step 5: Store in database
        console.log('Step 5: Storing in database...');
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
          console.error('⚠️ Warning - Creator insert error:', creatorError);
        } else {
          console.log('✅ Creator stored OK');
        }

        // Step 6: Store metrics
        if (creator) {
          console.log('Step 6: Storing metrics...');
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
          console.log('✅ Metrics stored OK');
        }

        console.log('=== ALL DIAGNOSTICS PASSED ===');

        return NextResponse.json({
          success: true,
          insights,
          analysis,
          creatorId: creator?.id,
          diagnostics: 'All systems operational',
        });

      } catch (aiError) {
        console.error('❌ Gemini AI Error:', aiError);
        return NextResponse.json({
          error: 'Google Gemini AI Failed',
          details: aiError instanceof Error ? aiError.message : 'Unknown error',
          step: 'AI Analysis',
          tip: 'Check GOOGLE_AI_API_KEY in environment variables',
          envStatus: requiredEnvVars,
        }, { status: 500 });
      }

    } catch (igError) {
      console.error('❌ Instagram API Error:', igError);
      return NextResponse.json({
        error: 'Instagram API Failed',
        details: igError instanceof Error ? igError.message : 'Unknown error',
        step: 'Instagram API',
        tip: 'Check INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID',
        envStatus: requiredEnvVars,
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ CRITICAL ERROR:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error',
      step: 'Unknown',
      envStatus: {
        GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY ? '✓ SET' : '✗ MISSING',
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ SET' : '✗ MISSING',
      },
    }, { status: 500 });
  }
}
