import axios from 'axios';

const INSTAGRAM_API_VERSION = 'v19.0';
const INSTAGRAM_API_BASE = `https://graph.instagram.com/${INSTAGRAM_API_VERSION}`;

interface InstagramMetrics {
  username: string;
  name: string;
  biography: string;
  followers_count: number;
  ig_id: string;
  profile_picture_url: string;
  website: string;
  posts: number;
  reach: number;
  impressions: number;
  engagement_rate: number;
  top_posts: Array<{
    id: string;
    caption: string;
    media_type: string;
    like_count: number;
    comments_count: number;
  }>;
  audience_insights: {
    top_cities: Array<{ city: string; percentage: number }>;
    top_countries: Array<{ country: string; percentage: number }>;
    gender_age: Array<{ bracket: string; percentage: number }>;
  };
}

class InstagramAPI {
  private accessToken: string;
  private businessAccountId: string;

  constructor() {
    this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || '';
    this.businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '';

    if (!this.accessToken) {
      throw new Error('Instagram access token is not configured');
    }
  }

  /**
   * Fetch creator's basic profile information
   */
  async getCreatorProfile(): Promise<any> {
    try {
      const response = await axios.get(
        `${INSTAGRAM_API_BASE}/${this.businessAccountId}`,
        {
          params: {
            fields: 'id,username,name,biography,followers_count,ig_id,profile_picture_url,website',
            access_token: this.accessToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching creator profile:', error);
      throw error;
    }
  }

  /**
   * Fetch detailed metrics for the creator
   */
  async getMetrics(): Promise<any> {
    try {
      const response = await axios.get(
        `${INSTAGRAM_API_BASE}/${this.businessAccountId}/insights`,
        {
          params: {
            metric: 'follower_count,impressions,reach,profile_views,get_directions_clicks,phone_call_clicks,text_message_clicks,email_clicks,website_clicks,website_clicks_by_button_type',
            period: 'day',
            access_token: this.accessToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  }

  /**
   * Fetch recent posts
   */
  async getRecentPosts(limit: number = 20): Promise<any> {
    try {
      const response = await axios.get(
        `${INSTAGRAM_API_BASE}/${this.businessAccountId}/media`,
        {
          params: {
            fields: 'id,caption,media_type,timestamp,like_count,comments_count,ig_id,media_product_type',
            limit: limit,
            access_token: this.accessToken,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      throw error;
    }
  }

  /**
   * Get engagement metrics for a specific post
   */
  async getPostInsights(postId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${INSTAGRAM_API_BASE}/${postId}/insights`,
        {
          params: {
            metric: 'engagement,impressions,reach,saved,shares,like_count,comments_count',
            access_token: this.accessToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching insights for post ${postId}:`, error);
      throw error;
    }
  }

  /**
   * Get audience demographics
   */
  async getAudienceDemographics(): Promise<any> {
    try {
      const response = await axios.get(
        `${INSTAGRAM_API_BASE}/${this.businessAccountId}/insights`,
        {
          params: {
            metric: 'audience_city,audience_country,audience_gender_age',
            period: 'lifetime',
            access_token: this.accessToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching audience demographics:', error);
      throw error;
    }
  }

  /**
   * Comprehensive insights fetch combining all data
   */
  async getComprehensiveInsights(): Promise<InstagramMetrics> {
    try {
      const [profile, metrics, posts, demographics] = await Promise.all([
        this.getCreatorProfile(),
        this.getMetrics(),
        this.getRecentPosts(10),
        this.getAudienceDemographics(),
      ]);

      const topPosts = posts.slice(0, 5).map((post: any) => ({
        id: post.id,
        caption: post.caption || 'No caption',
        media_type: post.media_type,
        like_count: post.like_count || 0,
        comments_count: post.comments_count || 0,
      }));

      // Calculate engagement rate
      const avgEngagement = topPosts.length > 0
        ? topPosts.reduce((sum: number, post: any) => sum + (post.like_count + post.comments_count), 0) / topPosts.length / (profile.followers_count || 1)
        : 0;

      return {
        username: profile.username,
        name: profile.name,
        biography: profile.biography,
        followers_count: profile.followers_count,
        ig_id: profile.ig_id,
        profile_picture_url: profile.profile_picture_url,
        website: profile.website,
        posts: posts.length,
        reach: metrics.data?.[0]?.values?.[0]?.value || 0,
        impressions: metrics.data?.[1]?.values?.[0]?.value || 0,
        engagement_rate: avgEngagement,
        top_posts: topPosts,
        audience_insights: {
          top_cities: this.parseAudienceData(demographics, 'audience_city'),
          top_countries: this.parseAudienceData(demographics, 'audience_country'),
          gender_age: this.parseAudienceData(demographics, 'audience_gender_age'),
        },
      };
    } catch (error) {
      console.error('Error fetching comprehensive insights:', error);
      throw error;
    }
  }

  /**
   * Helper method to parse audience data
   */
  private parseAudienceData(data: any, metric: string): any[] {
    const metricData = data.data?.find((item: any) => item.name === metric);
    if (!metricData || !metricData.values?.[0]?.value) {
      return [];
    }

    const values = metricData.values[0].value as Record<string, number>;
    return Object.entries(values)
      .map(([key, value]) => ({
        label: key,
        percentage: value,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);
  }
}

export default new InstagramAPI();
