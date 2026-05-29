'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, TrendingUp, Users, Eye, MessageSquare, Zap } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Insight {
  username: string;
  followers_count: number;
  engagement_rate: number;
  reach: number;
  impressions: number;
  top_posts: Array<{
    id: string;
    caption: string;
    media_type: string;
    like_count: number;
    comments_count: number;
  }>;
}

interface Recommendation {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionItems?: string[];
}

interface Analysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: Recommendation[];
  nextSteps: string[];
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<Insight | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'analytics'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/insights');
        
        if (!response.ok) {
          throw new Error('Failed to fetch insights');
        }

        const data = await response.json();
        setInsights(data.insights);
        setAnalysis(data.analysis);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const StatCard = ({ icon: Icon, label, value, unit = '' }: any) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {unit && <span className="text-sm ml-1">{unit}</span>}
          </p>
        </div>
        <div className="p-3 bg-indigo-100 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-400 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading your Creator Intel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900">Error Loading Data</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <p className="text-red-600 text-sm mt-2">Please check your API configuration and try again.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="section-container py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Zap className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Creator Intel</h1>
              <p className="text-slate-600">AI-powered insights for {insights?.username}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="section-container py-12">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={Users}
            label="Followers"
            value={insights?.followers_count}
          />
          <StatCard
            icon={TrendingUp}
            label="Engagement Rate"
            value={(insights?.engagement_rate || 0) * 100}
            unit="%"
          />
          <StatCard
            icon={Eye}
            label="Reach"
            value={insights?.reach}
          />
          <StatCard
            icon={MessageSquare}
            label="Impressions"
            value={insights?.impressions}
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-8">
            {(['overview', 'recommendations', 'analytics'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 font-medium transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && analysis && (
          <div className="space-y-8">
            {/* Summary */}
            <div className="card">
              <h2 className="text-xl font-bold mb-3 text-slate-900">Performance Summary</h2>
              <p className="text-slate-700 leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-bold mb-4 text-slate-900">💪 Strengths</h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-green-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card">
                <h3 className="text-lg font-bold mb-4 text-slate-900">📈 Areas for Improvement</h3>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-amber-600 font-bold mt-1">!</span>
                      <span className="text-slate-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Next Steps */}
            <div className="card bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <h3 className="text-lg font-bold mb-4 text-indigo-900">🎯 Next Steps</h3>
              <ol className="space-y-2">
                {analysis.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-indigo-900">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analysis.recommendations.map((rec, idx) => (
              <div key={idx} className={`card border-l-4 ${getPriorityColor(rec.priority)}`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-slate-900">{rec.title}</h3>
                  <span className={`badge ${getPriorityColor(rec.priority)}`}>
                    {rec.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-700 mb-4">{rec.description}</p>
                {rec.actionItems && rec.actionItems.length > 0 && (
                  <ul className="space-y-1">
                    {rec.actionItems.map((item, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-indigo-600 mt-1">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && insights && (
          <div className="space-y-8">
            {/* Top Posts Chart */}
            <div className="card">
              <h3 className="text-lg font-bold mb-6 text-slate-900">Top Performing Posts</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={insights.top_posts.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="caption" width={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="like_count" fill="#6366f1" name="Likes" />
                  <Bar dataKey="comments_count" fill="#a78bfa" name="Comments" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Posts List */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4 text-slate-900">Recent Posts</h3>
              <div className="space-y-3">
                {insights.top_posts.slice(0, 5).map((post, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-900 text-sm mb-2">
                      {post.caption?.substring(0, 60)}...
                    </p>
                    <div className="flex gap-4 text-sm text-slate-600">
                      <span>👍 {post.like_count} likes</span>
                      <span>💬 {post.comments_count} comments</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="section-container py-8">
          <p className="text-slate-600 text-sm">
            Powered by Creator Intel • Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </footer>
    </div>
  );
}
