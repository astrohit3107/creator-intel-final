'use client';

import { useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface CompetitorData {
  username: string;
  followers: number;
  engagement_rate: number;
  avg_likes: number;
  avg_comments: number;
}

interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export default function CompetitorAnalysis() {
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [swotData, setSWOTData] = useState<SWOTAnalysis | null>(null);

  const analyzeCompetitors = async () => {
    if (!niche || competitors.length === 0) {
      alert('Please enter a niche and add at least one competitor');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/competitor-analysis', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to analyze competitors');

      const data = await response.json();
      setSWOTData(data.data);
    } catch (error) {
      console.error('Error analyzing competitors:', error);
      alert('Failed to analyze competitors');
    } finally {
      setLoading(false);
    }
  };

  const addCompetitor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const followers = parseInt(formData.get('followers') as string);
    const engagement_rate = parseFloat(
      formData.get('engagement_rate') as string
    );

    if (!username || !followers || !engagement_rate) {
      alert('Please fill in all fields');
      return;
    }

    setCompetitors([
      ...competitors,
      {
        username,
        followers,
        engagement_rate,
        avg_likes: Math.floor(followers * (engagement_rate / 100) * 0.7),
        avg_comments: Math.floor(followers * (engagement_rate / 100) * 0.3),
      },
    ]);

    e.currentTarget.reset();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Competitor Analysis
        </h2>

        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Niche</label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g., Fitness, Fashion, Tech"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <form onSubmit={addCompetitor} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="username"
                placeholder="Competitor Username"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="number"
                name="followers"
                placeholder="Followers"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="number"
                name="engagement_rate"
                placeholder="Engagement Rate (%)"
                step="0.1"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Competitor
            </button>
          </form>
        </div>

        {/* Competitors List */}
        {competitors.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Added Competitors</h3>
            <div className="space-y-2">
              {competitors.map((comp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{comp.username}</span>
                  <button
                    onClick={() =>
                      setCompetitors(competitors.filter((_, i) => i !== idx))
                    }
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={analyzeCompetitors}
          disabled={loading}
          className="mt-6 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {loading ? 'Analyzing...' : 'Analyze Competitors'}
        </button>
      </div>

      {/* SWOT Analysis */}
      {swotData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-green-50 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Strengths
            </h3>
            <ul className="space-y-2">
              {swotData.strengths.map((item, idx) => (
                <li key={idx} className="text-green-700">
                  • {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-red-50 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Weaknesses
            </h3>
            <ul className="space-y-2">
              {swotData.weaknesses.map((item, idx) => (
                <li key={idx} className="text-red-700">
                  • {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="bg-blue-50 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Opportunities
            </h3>
            <ul className="space-y-2">
              {swotData.opportunities.map((item, idx) => (
                <li key={idx} className="text-blue-700">
                  • {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="bg-orange-50 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-orange-600" />
              Threats
            </h3>
            <ul className="space-y-2">
              {swotData.threats.map((item, idx) => (
                <li key={idx} className="text-orange-700">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
