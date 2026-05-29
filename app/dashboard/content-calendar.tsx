'use client';

import { useEffect, useState } from 'react';
import { Calendar, Plus, Trash2, Edit, CheckCircle, Clock } from 'lucide-react';

interface ContentPlan {
  id: string;
  title: string;
  description: string;
  scheduled_date: string;
  content_type: 'reel' | 'carousel' | 'static' | 'story';
  hashtags: string[];
  caption: string;
  status: 'draft' | 'scheduled' | 'published';
  estimated_reach?: number;
  estimated_engagement?: number;
}

interface ContentStats {
  total_planned: number;
  published: number;
  scheduled: number;
  draft: number;
  by_type: {
    reel: number;
    carousel: number;
    static: number;
    story: number;
  };
  estimated_reach: number;
  estimated_engagement: number;
}

export default function ContentCalendar({ creatorId }: { creatorId?: string }) {
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [upcomingPosts, setUpcomingPosts] = useState<ContentPlan[]>([]);
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: '',
    description: '',
    scheduled_date: new Date().toISOString().split('T')[0],
    content_type: 'reel' as const,
    hashtags: '',
    caption: '',
  });

  useEffect(() => {
    const fetchCalendarData = async () => {
      if (!creatorId) {
        setLoading(false);
        return;
      }

      try {
        const [upcomingRes, statsRes] = await Promise.all([
          fetch(`/api/content-calendar?action=upcoming&creatorId=${creatorId}`),
          fetch(`/api/content-calendar?action=stats&creatorId=${creatorId}`),
        ]);

        if (upcomingRes.ok) {
          const data = await upcomingRes.json();
          setUpcomingPosts(data.data || []);
        }

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [creatorId]);

  const handleCreatePlan = async () => {
    if (!creatorId || !newPlan.title.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/content-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          creatorId,
          plan: {
            ...newPlan,
            hashtags: newPlan.hashtags
              .split(',')
              .map((h) => h.trim())
              .filter(Boolean),
            status: 'draft',
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUpcomingPosts([...upcomingPosts, data.data]);
        setNewPlan({
          title: '',
          description: '',
          scheduled_date: new Date().toISOString().split('T')[0],
          content_type: 'reel',
          hashtags: '',
          caption: '',
        });
        setShowNewPlanForm(false);
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('Failed to create content plan');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!creatorId) return;

    try {
      const response = await fetch('/api/content-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          creatorId,
          planId,
        }),
      });

      if (response.ok) {
        setUpcomingPosts(upcomingPosts.filter((p) => p.id !== planId));
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const getContentTypeColor = (
    type: 'reel' | 'carousel' | 'static' | 'story'
  ) => {
    switch (type) {
      case 'reel':
        return 'bg-red-100 text-red-700';
      case 'carousel':
        return 'bg-blue-100 text-blue-700';
      case 'static':
        return 'bg-green-100 text-green-700';
      case 'story':
        return 'bg-purple-100 text-purple-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4" />;
      case 'scheduled':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Loading content calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="card">
            <p className="text-sm text-slate-600">Total Planned</p>
            <p className="text-2xl font-bold text-slate-900">
              {stats.total_planned}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-600">Published</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.published}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-600">Scheduled</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.scheduled}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-600">Draft</p>
            <p className="text-2xl font-bold text-amber-600">{stats.draft}</p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-600">Est. Reach</p>
            <p className="text-2xl font-bold text-indigo-600">
              {(stats.estimated_reach / 1000).toFixed(0)}K
            </p>
          </div>
        </div>
      )}

      {/* Content Types Breakdown */}
      {stats && (
        <div className="card">
          <h3 className="text-lg font-bold mb-4 text-slate-900">
            Content Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {stats.by_type.reel}
              </p>
              <p className="text-sm text-slate-600">Reels</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {stats.by_type.carousel}
              </p>
              <p className="text-sm text-slate-600">Carousels</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {stats.by_type.static}
              </p>
              <p className="text-sm text-slate-600">Static Posts</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {stats.by_type.story}
              </p>
              <p className="text-sm text-slate-600">Stories</p>
            </div>
          </div>
        </div>
      )}

      {/* Create New Plan Button */}
      <button
        onClick={() => setShowNewPlanForm(!showNewPlanForm)}
        className="btn btn-primary flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Create Content Plan
      </button>

      {/* New Plan Form */}
      {showNewPlanForm && (
        <div className="card">
          <h3 className="text-lg font-bold mb-4 text-slate-900">
            New Content Plan
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Content Title"
              value={newPlan.title}
              onChange={(e) =>
                setNewPlan({ ...newPlan, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={newPlan.description}
              onChange={(e) =>
                setNewPlan({ ...newPlan, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              rows={3}
            />
            <input
              type="date"
              value={newPlan.scheduled_date}
              onChange={(e) =>
                setNewPlan({ ...newPlan, scheduled_date: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
            <select
              value={newPlan.content_type}
              onChange={(e) =>
                setNewPlan({
                  ...newPlan,
                  content_type: e.target.value as any,
                })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            >
              <option value="reel">Reel</option>
              <option value="carousel">Carousel</option>
              <option value="static">Static Post</option>
              <option value="story">Story</option>
            </select>
            <textarea
              placeholder="Caption"
              value={newPlan.caption}
              onChange={(e) =>
                setNewPlan({ ...newPlan, caption: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              rows={2}
            />
            <input
              type="text"
              placeholder="Hashtags (comma-separated)"
              value={newPlan.hashtags}
              onChange={(e) =>
                setNewPlan({ ...newPlan, hashtags: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreatePlan}
                className="btn btn-primary flex-1"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewPlanForm(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Posts */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 text-slate-900">
          Upcoming Posts
        </h3>
        {upcomingPosts.length > 0 ? (
          <div className="space-y-3">
            {upcomingPosts.map((post) => (
              <div
                key={post.id}
                className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">
                        {post.title}
                      </h4>
                      <span className={`badge ${getContentTypeColor(post.content_type)}`}>
                        {post.content_type}
                      </span>
                      {getStatusIcon(post.status) && (
                        <span className="text-slate-400">
                          {getStatusIcon(post.status)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">
                      📅 {new Date(post.scheduled_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeletePlan(post.id)}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {post.caption && (
                  <p className="text-sm text-slate-700 mb-2">
                    {post.caption.substring(0, 100)}...
                  </p>
                )}
                {post.hashtags && post.hashtags.length > 0 && (
                  <p className="text-xs text-slate-500">
                    {post.hashtags.join(' ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 py-8">
            No upcoming posts scheduled
          </p>
        )}
      </div>
    </div>
  );
}
