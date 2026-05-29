import Anthropic from '@anthropic-ai/sdk';

interface AIRecommendation {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionItems: string[];
}

interface AnalysisResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: AIRecommendation[];
  nextSteps: string[];
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

class AIProcessor {
  /**
   * Analyze Instagram metrics and generate insights using Claude
   */
  async analyzeInsights(metricsData: any): Promise<AnalysisResult> {
    const prompt = this.buildAnalysisPrompt(metricsData);

    try {
      const message = await client.messages.create({
        model: 'claude-opus-4-1',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText =
        message.content[0].type === 'text' ? message.content[0].text : '';
      return this.parseAnalysisResponse(responseText);
    } catch (error) {
      console.error('Error analyzing insights with Claude:', error);
      throw error;
    }
  }

  /**
   * Generate personalized recommendations for content strategy
   */
  async generateContentStrategy(metricsData: any, pastAnalysis?: string): Promise<AIRecommendation[]> {
    const prompt = this.buildStrategyPrompt(metricsData, pastAnalysis);

    try {
      const message = await client.messages.create({
        model: 'claude-opus-4-1',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText =
        message.content[0].type === 'text' ? message.content[0].text : '';
      return this.parseRecommendationsResponse(responseText);
    } catch (error) {
      console.error('Error generating content strategy:', error);
      throw error;
    }
  }

  /**
   * Build the analysis prompt for Claude
   */
  private buildAnalysisPrompt(metricsData: any): string {
    return `You are an expert Instagram growth strategist and content analyst. Analyze the following creator's Instagram metrics and provide actionable insights.

Creator Information:
- Username: ${metricsData.username}
- Followers: ${metricsData.followers_count?.toLocaleString()}
- Engagement Rate: ${(metricsData.engagement_rate * 100).toFixed(2)}%
- Profile Reach: ${metricsData.reach?.toLocaleString()}
- Profile Impressions: ${metricsData.impressions?.toLocaleString()}

Top Performing Posts:
${metricsData.top_posts
  ?.map(
    (post: any, i: number) => `
${i + 1}. "${post.caption?.substring(0, 50)}..."
   - Likes: ${post.like_count}
   - Comments: ${post.comments_count}
   - Total Engagement: ${post.like_count + post.comments_count}
`
  )
  .join('\n')}

Audience Demographics:
- Top Cities: ${metricsData.audience_insights?.top_cities?.map((c: any) => `${c.label} (${c.percentage}%)`).join(', ')}
- Top Countries: ${metricsData.audience_insights?.top_countries?.map((c: any) => `${c.label} (${c.percentage}%)`).join(', ')}

Please provide:
1. A summary of their current performance
2. Key strengths in their content strategy
3. Areas for improvement
4. Specific, actionable recommendations (with priority levels: high/medium/low)
5. Next immediate steps to take

Format your response as a structured JSON object with the following schema:
{
  "summary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommendations": [
    {
      "category": "string",
      "title": "string",
      "description": "string",
      "priority": "high|medium|low",
      "actionItems": ["string"]
    }
  ],
  "nextSteps": ["string"]
}`;
  }

  /**
   * Build the strategy prompt for Claude
   */
  private buildStrategyPrompt(metricsData: any, pastAnalysis?: string): string {
    return `You are an expert Instagram content strategist. Based on the following creator's metrics, generate specific content recommendations.

Current Metrics:
- Followers: ${metricsData.followers_count?.toLocaleString()}
- Engagement Rate: ${(metricsData.engagement_rate * 100).toFixed(2)}%
- Average Reach: ${metricsData.reach?.toLocaleString()}
${pastAnalysis ? `- Previous Analysis: ${pastAnalysis}` : ''}

Top Performing Content:
${metricsData.top_posts?.map((post: any) => `- ${post.media_type}: ${post.like_count + post.comments_count} total engagements`).join('\n')}

Audience Focus:
- Primary Audience: ${metricsData.audience_insights?.top_countries?.slice(0, 3).map((c: any) => c.label).join(', ')}

Generate 5 specific, actionable content recommendations with the following JSON structure:
[
  {
    "category": "string (e.g., 'Posting Frequency', 'Content Type', 'Caption Strategy')",
    "title": "string",
    "description": "detailed recommendation",
    "priority": "high|medium|low",
    "actionItems": ["specific action 1", "specific action 2"]
  }
]`;
  }

  /**
   * Parse Claude's analysis response
   */
  private parseAnalysisResponse(response: string): AnalysisResult {
    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        summary: parsed.summary || 'Unable to generate summary',
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        recommendations: parsed.recommendations || [],
        nextSteps: parsed.nextSteps || [],
      };
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      return {
        summary: 'Analysis completed but parsing failed',
        strengths: [],
        weaknesses: [],
        recommendations: [],
        nextSteps: [],
      };
    }
  }

  /**
   * Parse Claude's recommendations response
   */
  private parseRecommendationsResponse(response: string): AIRecommendation[] {
    try {
      // Extract JSON array from the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return Array.isArray(parsed)
        ? parsed.map((rec: any) => ({
            category: rec.category || 'General',
            title: rec.title || 'Recommendation',
            description: rec.description || '',
            priority: rec.priority || 'medium',
            actionItems: rec.actionItems || [],
          }))
        : [];
    } catch (error) {
      console.error('Error parsing recommendations response:', error);
      return [];
    }
  }

  /**
   * Analyze competitive metrics using Claude
   */
  async analyzeCompetitiveMetrics(prompt: string): Promise<any> {
    try {
      const message = await client.messages.create({
        model: 'claude-opus-4-1',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText =
        message.content[0].type === 'text' ? message.content[0].text : '';
      return this.parseJSONResponse(responseText);
    } catch (error) {
      console.error('Error analyzing competitive metrics:', error);
      return {
        strengths: [],
        opportunities: [],
        threats: [],
        recommendations: [],
      };
    }
  }

  /**
   * Analyze benchmarks using Claude
   */
  async analyzeBenchmarks(prompt: string): Promise<any> {
    try {
      const message = await client.messages.create({
        model: 'claude-opus-4-1',
        max_tokens: 1200,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText =
        message.content[0].type === 'text' ? message.content[0].text : '';
      return this.parseJSONResponse(responseText);
    } catch (error) {
      console.error('Error analyzing benchmarks:', error);
      return {};
    }
  }

  /**
   * Generate content plan using Claude
   */
  async generateContentPlan(prompt: string): Promise<any[]> {
    try {
      const message = await client.messages.create({
        model: 'claude-opus-4-1',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText =
        message.content[0].type === 'text' ? message.content[0].text : '';
      const parsed = this.parseJSONResponse(responseText);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error generating content plan:', error);
      return [];
    }
  }

  /**
   * Suggest optimal posting times using Claude
   */
  async suggestPostingTimes(prompt: string): Promise<string[]> {
    try {
      const message = await client.messages.create({
        model: 'claude-opus-4-1',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText =
        message.content[0].type === 'text' ? message.content[0].text : '';
      const parsed = this.parseJSONResponse(responseText);
      return Array.isArray(parsed) ? parsed : ['09:00', '14:00', '20:00'];
    } catch (error) {
      console.error('Error suggesting posting times:', error);
      return ['09:00', '14:00', '20:00'];
    }
  }

  /**
   * Parse generic JSON response from Claude
   */
  private parseJSONResponse(response: string): any {
    try {
      // Try to extract JSON (array or object)
      const arrayMatch = response.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        return JSON.parse(arrayMatch[0]);
      }

      const objectMatch = response.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        return JSON.parse(objectMatch[0]);
      }

      return null;
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      return null;
    }
  }
}

export default new AIProcessor();
