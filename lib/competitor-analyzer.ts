import axios from 'axios';
import aiProcessor from './ai-processor';

interface CompetitorMetrics {
  username: string;
  followers_count: number;
  engagement_rate: number;
  avg_post_engagement: number;
  total_posts: number;
  top_posts: Array<{
    caption: string;
    like_count: number;
    comments_count: number;
    engagement: number;
  }>;
}

interface CompetitiveAnalysis {
  competitor: CompetitorMetrics;
  your_metrics: any;
  comparison: {
    strengths: string[];
    opportunities: string[];
    threats: string[];
    recommendations: string[];
  };
}

const INSTAGRAM_API_VERSION = 'v19.0';
const INSTAGRAM_API_BASE = `https://graph.instagram.com/${INSTAGRAM_API_VERSION}`;

class CompetitorAnalyzer {
  private accessToken: string;

  constructor() {
    this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || '';
  }

  /**
   * Fetch competitor metrics by username
   */
  async getCompetitorMetrics(username: string): Promise<CompetitorMetrics> {
    try {
      // Search for user by username
      const searchResponse = await axios.get(
        `${INSTAGRAM_API_BASE}/ig_hashtag_search`,
        {
          params: {
            user_id: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
            fields: 'id,name',
            access_token: this.accessToken,
          },
        }
      );

      // Note: Direct user search by username requires additional permissions
      // This is a simplified version - in production, you might need:
      // 1. Additional API permissions
      // 2. User's approval to analyze their account
      // 3. Public data only approach

      const mockData = await this.generateMockCompetitorData(username);
      return mockData;
    } catch (error) {
      console.error(`Error fetching competitor metrics for ${username}:`, error);
      throw error;
    }
  }

  /**
   * Analyze multiple competitors
   */
  async analyzeCompetitors(
    competitors: string[],
    yourMetrics: any
  ): Promise<CompetitiveAnalysis[]> {
    try {
      const analyses: CompetitiveAnalysis[] = [];

      for (const competitor of competitors) {
        const competitorMetrics = await this.getCompetitorMetrics(competitor);
        const comparison = await this.compareMetrics(
          competitorMetrics,
          yourMetrics
        );

        analyses.push({
          competitor: competitorMetrics,
          your_metrics: yourMetrics,
          comparison,
        });
      }

      return analyses;
    } catch (error) {
      console.error('Error analyzing competitors:', error);
      throw error;
    }
  }

  /**
   * Compare your metrics with competitor
   */
  private async compareMetrics(
    competitor: CompetitorMetrics,
    yours: any
  ): Promise<any> {
    const comparisonPrompt = `
Compare these two Instagram creators' metrics and provide competitive insights:

YOUR METRICS:
- Followers: ${yours.followers_count}
- Engagement Rate: ${yours.engagement_rate * 100}%
- Top Post Engagement: ${yours.avg_engagement || 'N/A'}

COMPETITOR (${competitor.username}):
- Followers: ${competitor.followers_count}
- Engagement Rate: ${competitor.engagement_rate * 100}%
- Top Post Engagement: ${competitor.avg_post_engagement}

Provide analysis in JSON format:
{
  "strengths": ["Your advantages vs competitor"],
  "opportunities": ["Where you can improve to beat competitor"],
  "threats": ["Where competitor is beating you"],
  "recommendations": ["Specific actions to gain competitive advantage"]
}
`;

    try {
      const analysis = await aiProcessor.analyzeCompetitiveMetrics(
        comparisonPrompt
      );
      return analysis;
    } catch (error) {
      console.error('Error comparing metrics with Claude:', error);
      return {
        strengths: [],
        opportunities: [],
        threats: [],
        recommendations: [],
      };
    }
  }

  /**
   * Generate mock competitor data (for demo/testing)
   * In production, use real API data
   */
  private async generateMockCompetitorData(
    username: string
  ): Promise<CompetitorMetrics> {
    const baseFollowers = Math.floor(Math.random() * 100000) + 10000;
    const baseEngagement = Math.random() * 0.1;

    return {
      username,
      followers_count: baseFollowers,
      engagement_rate: baseEngagement,
      avg_post_engagement: baseEngagement * baseFollowers,
      total_posts: Math.floor(Math.random() * 500) + 50,
      top_posts: [
        {
          caption: `Top post from @${username}`,
          like_count: Math.floor(baseEngagement * baseFollowers * 0.8),
          comments_count: Math.floor(baseEngagement * baseFollowers * 0.2),
          engagement: baseEngagement,
        },
        {
          caption: `Popular post from @${username}`,
          like_count: Math.floor(baseEngagement * baseFollowers * 0.7),
          comments_count: Math.floor(baseEngagement * baseFollowers * 0.15),
          engagement: baseEngagement * 0.85,
        },
        {
          caption: `Viral moment from @${username}`,
          like_count: Math.floor(baseEngagement * baseFollowers * 0.9),
          comments_count: Math.floor(baseEngagement * baseFollowers * 0.25),
          engagement: baseEngagement * 1.1,
        },
      ],
    };
  }

  /**
   * Benchmark against industry standards
   */
  async getBenchmarks(niche: string, yourMetrics: any): Promise<any> {
    const benchmarkPrompt = `
Given this creator's metrics in the "${niche}" niche, provide industry benchmarks:

CREATOR METRICS:
- Followers: ${yourMetrics.followers_count}
- Engagement Rate: ${yourMetrics.engagement_rate * 100}%
- Content Type: ${niche}

Provide benchmarking analysis:
{
  "industry_avg_engagement": "percentage",
  "your_performance": "above/at/below average",
  "benchmark_followers": "typical followers in this niche",
  "growth_potential": "estimated growth capacity",
  "recommendations": ["specific improvements"]
}
`;

    try {
      const analysis = await aiProcessor.analyzeBenchmarks(benchmarkPrompt);
      return analysis;
    } catch (error) {
      console.error('Error analyzing benchmarks:', error);
      return {};
    }
  }
}

export default new CompetitorAnalyzer();
