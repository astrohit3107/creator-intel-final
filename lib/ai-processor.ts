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
      return {
        summary: 'Analysis in progress',
        strengths: [],
        weaknesses: [],
        recommendations: [],
        nextSteps: [],
      };
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
   * Build the analysis prompt for Gemini
   */
  private buildAnalysisPrompt(metricsData: any): string {
    return `You are an expert Instagram growth strategist. Analyze this creator's metrics and provide insights.

Creator: ${metricsData.username || 'Creator'}
Followers: ${metricsData.followers_count || 0}
Engagement Rate: ${metricsData.engagement_rate ? (metricsData.engagement_rate * 100).toFixed(2) : 0}%

Provide analysis in JSON format with: summary, strengths (array), weaknesses (array), recommendations (array), nextSteps (array).`;
  }

  /**
   * Build the strategy prompt for Gemini
   */
  private buildStrategyPrompt(metricsData: any, pastAnalysis?: string): string {
    return `You are an Instagram content strategist. Generate 5 specific content recommendations.

Current metrics:
- Followers: ${metricsData.followers_count || 0}
- Engagement Rate: ${metricsData.engagement_rate ? (metricsData.engagement_rate * 100).toFixed(2) : 0}%

${pastAnalysis ? `Previous analysis: ${pastAnalysis}` : ''}

Return as JSON array of recommendations with: category, title, description, priority, actionItems.`;
  }

  /**
   * Parse Gemini's analysis response
   */
  private parseAnalysisResponse(response: string): AnalysisResult {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          summary: 'Analysis complete',
          strengths: [],
          weaknesses: [],
          recommendations: [],
          nextSteps: [],
        };
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        summary: parsed.summary || 'Analysis complete',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : [],
      };
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      return {
        summary: 'Analysis complete',
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
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return [];
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return Array.isArray(parsed)
        ? parsed.map((rec: any) => ({
            category: rec.category || 'General',
            title: rec.title || 'Recommendation',
            description: rec.description || '',
            priority: rec.priority || 'medium',
            actionItems: Array.isArray(rec.actionItems) ? rec.actionItems : [],
          }))
        : [];
    } catch (error) {
      console.error('Error parsing recommendations response:', error);
      return [];
    }
  }

  /**
   * Parse generic JSON response from Gemini
   */
  private parseJSONResponse(response: string): any {
    try {
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
