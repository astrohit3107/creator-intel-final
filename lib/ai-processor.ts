import { GoogleGenerativeAI } from "@google/generative-ai";

interface AIRecommendation {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionItems?: string[];
}

interface AnalysisResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: AIRecommendation[];
  nextSteps: string[];
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

class AIProcessor {
  /**
   * Analyze Instagram metrics and generate insights using Google Gemini
   */
  async analyzeInsights(metricsData: any): Promise<AnalysisResult> {
    const prompt = this.buildAnalysisPrompt(metricsData);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAnalysisResponse(text);
    } catch (error) {
      console.error('Error analyzing insights with Gemini:', error);
      throw error;
    }
  }

  /**
   * Generate personalized recommendations for content strategy
   */
  async generateContentStrategy(metricsData: any, pastAnalysis?: string): Promise<AIRecommendation[]> {
    const prompt = this.buildStrategyPrompt(metricsData, pastAnalysis);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseRecommendationsResponse(text);
    } catch (error) {
      console.error('Error generating content strategy:', error);
      throw error;
    }
  }

  /**
   * Build the analysis prompt for Gemini
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
- Top Cities: ${metricsData.audience_insights?.top_cities?.map((c: any) => c.label + ' (' + c.percentage + '%)').join(', ')}
- Top Countries: ${metricsData.audience_insights?.top_countries?.map((c: any) => c.label + ' (' + c.percentage + '%)').join(', ')}

Please provide analysis in this EXACT JSON format:
{
  "summary": "A brief summary of their current performance",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "recommendations": [
    {
      "category": "Category Name",
      "title": "Recommendation Title",
      "description": "Detailed description",
      "priority": "high",
      "actionItems": ["action 1", "action 2"]
    }
  ],
  "nextSteps": ["step 1", "step 2", "step 3"]
}`;
  }

  /**
   * Build the strategy prompt for Gemini
   */
  private buildStrategyPrompt(metricsData: any, pastAnalysis?: string): string {
    return `You are an expert Instagram content strategist. Based on the following creator's metrics, generate specific content recommendations.

Current Metrics:
- Followers: ${metricsData.followers_count?.toLocaleString()}
- Engagement Rate: ${(metricsData.engagement_rate * 100).toFixed(2)}%
- Average Reach: ${metricsData.reach?.toLocaleString()}
${pastAnalysis ? '- Previous Analysis: ' + pastAnalysis : ''}

Top Performing Content:
${metricsData.top_posts?.map((post: any) => '- ' + post.media_type + ': ' + (post.like_count + post.comments_count) + ' total engagements').join('\n')}

Audience Focus:
- Primary Audience: ${metricsData.audience_insights?.top_countries?.slice(0, 3).map((c: any) => c.label).join(', ')}

Generate 5 specific, actionable content recommendations in this EXACT JSON format:
[
  {
    "category": "Category (e.g., 'Posting Frequency', 'Content Type')",
    "title": "Recommendation Title",
    "description": "Detailed, specific recommendation",
    "priority": "high",
    "actionItems": ["specific action 1", "specific action 2", "specific action 3"]
  }
]

Make sure it's valid JSON array. Be specific and actionable.`;
  }

  /**
   * Parse Gemini's analysis response
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
   * Parse Gemini's recommendations response
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
   * Analyze competitive metrics using Gemini
   */
  async analyzeCompetitiveMetrics(prompt: string): Promise<any> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseJSONResponse(text);
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
   * Analyze benchmarks using Gemini
   */
  async analyzeBenchmarks(prompt: string): Promise<any> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseJSONResponse(text);
    } catch (error) {
      console.error('Error analyzing benchmarks:', error);
      return {};
    }
  }

  /**
   * Generate content plan using Gemini
   */
  async generateContentPlan(prompt: string): Promise<any[]> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const parsed = this.parseJSONResponse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error generating content plan:', error);
      return [];
    }
  }

  /**
   * Suggest optimal posting times using Gemini
   */
  async suggestPostingTimes(prompt: string): Promise<string[]> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const parsed = this.parseJSONResponse(text);
      return Array.isArray(parsed) ? parsed : ['09:00', '14:00', '20:00'];
    } catch (error) {
      console.error('Error suggesting posting times:', error);
      return ['09:00', '14:00', '20:00'];
    }
  }

  /**
   * Parse generic JSON response from Gemini
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

