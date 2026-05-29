import { supabaseAdmin } from './supabase';
import aiProcessor from './ai-processor';

export interface ContentPlan {
  id?: string;
  creator_id: string;
  title: string;
  description: string;
  scheduled_date: string;
  content_type: 'reel' | 'carousel' | 'static' | 'story';
  hashtags: string[];
  caption: string;
  status: 'draft' | 'scheduled' | 'published';
  estimated_reach?: number;
  estimated_engagement?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ContentCalendarMonth {
  month: string;
  year: number;
  posts: ContentPlan[];
  total_posts: number;
  estimated_total_reach: number;
  estimated_total_engagement: number;
}

class ContentCalendar {
  /**
   * Generate AI-powered content ideas
   */
  async generateContentIdeas(
    creatorMetrics: any,
    niche: string,
    numberOfIdeas: number = 10
  ): Promise<ContentPlan[]> {
    const prompt = `You are a content strategist for a ${niche} creator.

Creator Profile:
- Followers: ${creatorMetrics.followers_count}
- Engagement Rate: ${(creatorMetrics.engagement_rate * 100).toFixed(2)}%
- Top Content Types: ${creatorMetrics.top_posts?.map((p: any) => p.media_type).join(', ')}

Generate ${numberOfIdeas} engaging content ideas as JSON array:
[
  {
    "title": "Content title",
    "description": "What this post is about",
    "content_type": "reel|carousel|static|story",
    "caption": "Sample Instagram caption (max 150 chars)",
    "hashtags": ["tag1", "tag2", "tag3"],
    "estimated_reach": number,
    "estimated_engagement": number
  }
]

Make ideas specific, actionable, and aligned with their niche. Include mix of content types.`;

    try {
      const response = await aiProcessor.generateContentPlan(prompt);
      return response;
    } catch (error) {
      console.error('Error generating content ideas:', error);
      return [];
    }
  }

  /**
   * Create a content plan
   */
  async createContentPlan(plan: ContentPlan): Promise<ContentPlan> {
    try {
      const { data, error } = await supabaseAdmin
        .from('content_calendar')
        .insert([
          {
            creator_id: plan.creator_id,
            title: plan.title,
            description: plan.description,
            scheduled_date: plan.scheduled_date,
            content_type: plan.content_type,
            hashtags: plan.hashtags,
            caption: plan.caption,
            status: plan.status || 'draft',
            estimated_reach: plan.estimated_reach,
            estimated_engagement: plan.estimated_engagement,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating content plan:', error);
      throw error;
    }
  }

  /**
   * Update content plan
   */
  async updateContentPlan(
    planId: string,
    updates: Partial<ContentPlan>
  ): Promise<ContentPlan> {
    try {
      const { data, error } = await supabaseAdmin
        .from('content_calendar')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', planId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating content plan:', error);
      throw error;
    }
  }

  /**
   * Delete content plan
   */
  async deleteContentPlan(planId: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('content_calendar')
        .delete()
        .eq('id', planId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting content plan:', error);
      throw error;
    }
  }

  /**
   * Get content calendar for a specific month
   */
  async getCalendarMonth(
    creatorId: string,
    month: number,
    year: number
  ): Promise<ContentCalendarMonth> {
    try {
      const startDate = new Date(year, month - 1, 1)
        .toISOString()
        .split('T')[0];
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      const { data, error } = await supabaseAdmin
        .from('content_calendar')
        .select('*')
        .eq('creator_id', creatorId)
        .gte('scheduled_date', startDate)
        .lte('scheduled_date', endDate)
        .order('scheduled_date');

      if (error) throw error;

      const posts = data || [];
      const totalReach = posts.reduce(
        (sum: number, post: any) => sum + (post.estimated_reach || 0),
        0
      );
      const totalEngagement = posts.reduce(
        (sum: number, post: any) => sum + (post.estimated_engagement || 0),
        0
      );

      return {
        month: new Date(year, month - 1).toLocaleDateString('en-US', {
          month: 'long',
        }),
        year,
        posts,
        total_posts: posts.length,
        estimated_total_reach: totalReach,
        estimated_total_engagement: totalEngagement,
      };
    } catch (error) {
      console.error('Error fetching calendar month:', error);
      return {
        month: '',
        year,
        posts: [],
        total_posts: 0,
        estimated_total_reach: 0,
        estimated_total_engagement: 0,
      };
    }
  }

  /**
   * Get all upcoming posts
   */
  async getUpcomingPosts(
    creatorId: string,
    daysAhead: number = 30
  ): Promise<ContentPlan[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const { data, error } = await supabaseAdmin
        .from('content_calendar')
        .select('*')
        .eq('creator_id', creatorId)
        .gte('scheduled_date', today)
        .lte('scheduled_date', futureDate)
        .in('status', ['scheduled', 'draft'])
        .order('scheduled_date');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching upcoming posts:', error);
      return [];
    }
  }

  /**
   * Get content statistics
   */
  async getContentStats(creatorId: string): Promise<any> {
    try {
      const { data, error } = await supabaseAdmin
        .from('content_calendar')
        .select('*')
        .eq('creator_id', creatorId);

      if (error) throw error;

      const posts = data || [];

      const stats = {
        total_planned: posts.length,
        published: posts.filter((p: any) => p.status === 'published').length,
        scheduled: posts.filter((p: any) => p.status === 'scheduled').length,
        draft: posts.filter((p: any) => p.status === 'draft').length,
        by_type: {
          reel: posts.filter((p: any) => p.content_type === 'reel').length,
          carousel: posts.filter((p: any) => p.content_type === 'carousel')
            .length,
          static: posts.filter((p: any) => p.content_type === 'static').length,
          story: posts.filter((p: any) => p.content_type === 'story').length,
        },
        estimated_reach: posts.reduce(
          (sum: number, p: any) => sum + (p.estimated_reach || 0),
          0
        ),
        estimated_engagement: posts.reduce(
          (sum: number, p: any) => sum + (p.estimated_engagement || 0),
          0
        ),
      };

      return stats;
    } catch (error) {
      console.error('Error fetching content stats:', error);
      return {};
    }
  }

  /**
   * Suggest optimal posting times
   */
  async suggestOptimalPostingTimes(
    creatorMetrics: any
  ): Promise<string[]> {
    const prompt = `Based on this creator's audience:
- Followers: ${creatorMetrics.followers_count}
- Top Countries: ${creatorMetrics.audience_insights?.top_countries?.map((c: any) => c.label).join(', ')}
- Engagement Rate: ${(creatorMetrics.engagement_rate * 100).toFixed(2)}%

Suggest optimal times to post (in 24hr format, EST timezone). 
Return as JSON array of times: ["09:00", "14:00", "20:00"]`;

    try {
      const response = await aiProcessor.suggestPostingTimes(prompt);
      return response;
    } catch (error) {
      console.error('Error suggesting posting times:', error);
      return ['09:00', '14:00', '20:00']; // Default times
    }
  }

  /**
   * Generate weekly content strategy
   */
  async generateWeeklyStrategy(
    creatorMetrics: any,
    niche: string
  ): Promise<ContentPlan[]> {
    const prompt = `Create a week's worth (7 days) of Instagram content strategy for a ${niche} creator.

Metrics:
- Followers: ${creatorMetrics.followers_count}
- Engagement Rate: ${(creatorMetrics.engagement_rate * 100).toFixed(2)}%

Requirements:
- Mix of content types (reels, carousels, stories, static posts)
- Themed days (e.g., Monday Motivation, Wednesday Tips, etc.)
- Optimal spacing throughout the week

Return as JSON array of ContentPlan objects with all required fields.`;

    try {
      const response = await aiProcessor.generateContentPlan(prompt);
      return response;
    } catch (error) {
      console.error('Error generating weekly strategy:', error);
      return [];
    }
  }
}

export default new ContentCalendar();
