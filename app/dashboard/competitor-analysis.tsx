'use client';

import { useEffect, useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Target,
  Zap,
  AlertCircle,
  Users,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CompetitorData {
  username: string;
  followers_count: number;
  engagement_rate: number;
  avg_post_engagement: number;
}

interface CompetitiveAnalysis {
  competitor: CompetitorData;
  comparison: {
    strengths: string[];
    opportunities: string[];
    threats: string[];
    recommendations: string[];
  };
}

export default function CompetitorAnalysis() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [competitors, setCompetitors] = useState<string>('');
  const [niche, setNiche] = useState('');
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [benchmarks, setBenchmarks] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!competitors.trim()) {
      setError('Please enter at least one competitor username');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/competitor-analysis?competitors=${encodeURIComponent(
          competitors
        )}&niche=${encodeURIComponent(niche)}`
      );

      if (!response.ok) {
        throw new Error('Failed to analyze competitors');
      }

      const data = await response.json();
      setAnalysisData(data.competitor_analysis);
      setBenchmarks(data.benchmarks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const ComparisonCard = ({ analysis }: { analysis: CompetitiveAnalysis }) => (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              @{analysis.competitor.username}
            </h3>
            <p className="text-slate-600 mt-1">
              Followers: {analysis.competitor.followers_count.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-indigo-600">
              {(analysis.competitor.engagement_rate * 100).toFixed(2)}%
            </p>
            <p className="text-sm text-slate-600">Engagement</p>
          </div>
        </div>

        {/* Comparison Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Your Strengths vs Competitor
            </h4>
            <ul className="space-y-1">
              {analysis.comparison.strengths.map((strength, i) => (
                <li key={i} className="text-sm text-green-700">
                  ✓ {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Their Threats to You
            </h4>
            <ul className="space-y-1">
              {analysis.comparison.threats.map((threat, i) => (
                <li key={i} className="text-sm text-amber-700">
                  ⚠ {threat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Opportunities & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" /> Opportunities
            </h4>
            <ul className="space-y-1">
              {analysis.comparison.opportunities.map((opp, i) => (
                <li key={i} className="text-sm text-blue-700">
                  → {opp}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Recommendations
            </h4>
            <ul className="space-y-1">
              {analysis.comparison.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-purple-700">
                  💡 {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">
          Competitive Analysis
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Competitor Usernames (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g., competitor1, competitor2, competitor3"
              value={competitors}
              onChange={(e) => setCompetitors(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Niche
            </label>
            <input
              type="text"
              placeholder="e.g., fashion, fitness, tech"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Analyzing...' : 'Analyze Competitors'}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="card bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysisData && (
        <>
          {/* Benchmarks */}
          {benchmarks && (
            <div className="card">
              <h3 className="text-xl font-bold mb-4 text-slate-900">
                Industry Benchmarks
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <p className="text-sm text-blue-600">Industry Avg Engagement</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {benchmarks.industry_avg_engagement || 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <p className="text-sm text-green-600">Your Performance</p>
                  <p className="text-2xl font-bold text-green-900">
                    {benchmarks.your_performance || 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <p className="text-sm text-purple-600">Benchmark Followers</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {benchmarks.benchmark_followers || 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg">
                  <p className="text-sm text-amber-600">Growth Potential</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {benchmarks.growth_potential || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Competitor Analysis Cards */}
          <div className="space-y-6">
            {Array.isArray(analysisData) &&
              analysisData.map((analysis: CompetitiveAnalysis, idx: number) => (
                <ComparisonCard key={idx} analysis={analysis} />
              ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!analysisData && !loading && (
        <div className="card text-center py-12">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">
            Enter competitor usernames to analyze their strategy
          </p>
        </div>
      )}
    </div>
  );
}
