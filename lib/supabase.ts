import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase instance with service role
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

// Database types
export interface Creator {
  id: string;
  user_id: string;
  instagram_username: string;
  instagram_id: string;
  followers_count: number;
  engagement_rate: number;
  created_at: string;
  updated_at: string;
}

export interface InsightMetric {
  id: string;
  creator_id: string;
  metric_name: string;
  metric_value: number;
  timestamp: string;
  created_at: string;
}

export interface Recommendation {
  id: string;
  creator_id: string;
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}
