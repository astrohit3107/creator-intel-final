-- Create content_calendar table for storing planned content
CREATE TABLE IF NOT EXISTS content_calendar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES creators ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('reel', 'carousel', 'static', 'story')),
  hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
  caption TEXT,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
  estimated_reach INTEGER DEFAULT 0,
  estimated_engagement INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_content_calendar_creator_id ON content_calendar(creator_id);
CREATE INDEX idx_content_calendar_scheduled_date ON content_calendar(scheduled_date);
CREATE INDEX idx_content_calendar_status ON content_calendar(status);

-- Enable RLS if needed
ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;
