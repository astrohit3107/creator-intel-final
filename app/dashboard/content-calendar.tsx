'use client';

import { useState } from 'react';
import { Calendar, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';

interface ContentPlan {
  id: string;
  title: string;
  description: string;
  scheduled_date: string;
  content_type: 'reel' | 'carousel' | 'static' | 'story';
  hashtags: string[];
  caption: string;
  status: 'draft' | 'scheduled' | 'published';
  estimated_reach: number;
  estimated_engagement: number;
}

export default function ContentCalendar() {
  const [plans, setPlans] = useState<ContentPlan[]>([]);
  const [showForm, setShowForm] = useState(false);

  const addPlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newPlan: ContentPlan = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      scheduled_date: formData.get('scheduled_date') as string,
      content_type: formData.get('content_type') as
        | 'reel'
        | 'carousel'
        | 'static'
        | 'story',
      hashtags: (formData.get('hashtags') as string).split(','),
      caption: formData.get('caption') as string,
      status: 'draft',
      estimated_reach: Math.floor(Math.random() * 10000),
      estimated_engagement: Math.floor(Math.random() * 1000),
    };

    setPlans([...plans, newPlan]);
    e.currentTarget.reset();
    setShowForm(false);
  };

  const deletePlan = (id: string) => {
    setPlans(plans.filter((plan) => plan.id !== id));
  };

  const updateStatus = (id: string, status: 'draft' | 'scheduled' | 'published') => {
    setPlans(
      plans.map((plan) =>
        plan.id === id ? { ...plan, status } : plan
      )
    );
  };

  const getContentTypeColor = (
    type: 'reel' | 'carousel' | 'static' | 'story'
  ) => {
    const colors = {
      reel: 'bg-purple-100 text-purple-800',
      carousel: 'bg-blue-100 text-blue-800',
      static: 'bg-green-100 text-green-800',
      story: 'bg-pink-100 text-pink-800',
    };
    return colors[type];
  };

  const upcomingPosts = plans.filter(
    (plan) => new Date(plan.scheduled_date) > new Date()
  );
  const publishedPosts = plans.filter((plan) => plan.status === 'published');

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Upcoming Posts</p>
              <p className="text-3xl font-bold">{upcomingPosts.length}</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Published</p>
              <p className="text-3xl font-bold">{publishedPosts.length}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg Engagement</p>
              <p className="text-3xl font-bold">
                {plans.length > 0
                  ? Math.floor(
                      plans.reduce((sum, p) => sum + p.estimated_engagement, 0) /
                        plans.length
                    )
                  : 0}
              </p>
            </div>
            <Clock className="w-10 h-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Add Plan Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          {showForm ? 'Cancel' : 'Add Post'}
        </button>
      </div>

      {/* Add Plan Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Plan New Post</h3>
          <form onSubmit={addPlan} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Post Title"
                required
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="date"
                name="scheduled_date"
                required
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <textarea
              name="description"
              placeholder="Description"
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            ></textarea>

            <textarea
              name="caption"
              placeholder="Caption/Text"
              rows={2}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            ></textarea>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="content_type"
                required
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select Type</option>
                <option value="reel">Reel</option>
                <option value="carousel">Carousel</option>
                <option value="static">Static</option>
                <option value="story">Story</option>
              </select>

              <input
                type="text"
                name="hashtags"
                placeholder="Hashtags (comma-separated)"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Save Post Plan
            </button>
          </form>
        </div>
      )}

      {/* Plans List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold">Your Content Plans</h3>
        </div>

        {plans.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No content plans yet. Start planning your posts!
          </div>
        ) : (
          <div className="divide-y">
            {plans.map((plan) => (
              <div key={plan.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg">{plan.title}</h4>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getContentTypeColor(
                          plan.content_type
                        )}`}
                      >
                        {plan.content_type}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">
                      {plan.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <span>📅 {new Date(plan.scheduled_date).toLocaleDateString()}</span>
                      <span>👁️ {plan.estimated_reach.toLocaleString()} reach</span>
                      <span>💬 {plan.estimated_engagement} engagement</span>
                    </div>

                    <div className="flex gap-2">
                      {(['draft', 'scheduled', 'published'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(plan.id, s)}
                          className={`px-3 py-1 rounded text-sm font-medium transition ${
                            plan.status === s
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
