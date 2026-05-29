# 🚀 Creator Intel - START HERE!

Welcome to Creator Intel! This is your complete AI-powered Instagram analytics platform with competitor analysis and content calendar.

## ⚡ Quick Start (5 minutes)

### Step 1: Get Your API Keys
You need 3 things:
1. **Supabase** - Database (free): https://supabase.com
2. **Instagram Business Account** - For insights: https://developers.facebook.com
3. **Claude API Key** - AI engine (free): https://console.anthropic.com

### Step 2: Create GitHub Repository
1. Go to https://github.com/new
2. Name: `creator-intel`
3. Click "Create repository"
4. Upload all files from this folder to GitHub

### Step 3: Create Supabase Tables
1. Go to Supabase → Your Project → SQL Editor
2. Copy this SQL and run it:

```sql
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instagram_username VARCHAR(255) UNIQUE NOT NULL,
  instagram_id VARCHAR(255) UNIQUE NOT NULL,
  followers_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE insight_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES creators ON DELETE CASCADE,
  metric_name VARCHAR(255) NOT NULL,
  metric_value DECIMAL(20,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES creators ON DELETE CASCADE,
  category VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(50) DEFAULT 'medium',
  ai_generated BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE content_calendar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES creators ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
  caption TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  estimated_reach INTEGER DEFAULT 0,
  estimated_engagement INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_content_calendar_creator_id ON content_calendar(creator_id);
CREATE INDEX idx_content_calendar_scheduled_date ON content_calendar(scheduled_date);
CREATE INDEX idx_content_calendar_status ON content_calendar(status);
```

### Step 4: Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repo
4. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your_supabase_url
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your_anon_key
   - `SUPABASE_SERVICE_ROLE_KEY` = your_service_key
   - `INSTAGRAM_ACCESS_TOKEN` = your_token
   - `INSTAGRAM_BUSINESS_ACCOUNT_ID` = your_account_id
   - `ANTHROPIC_API_KEY` = your_claude_key
5. Click "Deploy"

### Step 5: View Your App
After deployment, Vercel gives you a live URL. Click it and see your dashboard! 🎉

## 📚 Documentation

All documentation is in the `docs/` folder:
- `README.md` - Full documentation
- `QUICKSTART.md` - Quick setup guide
- `DEPLOYMENT.md` - Detailed deployment
- `NO_LOCAL_SETUP_GUIDE.md` - No Mac/terminal needed

## 🎯 Features

✨ **Instagram Analytics**
- Real-time metrics
- AI-powered insights
- Top posts analysis

🎯 **Competitor Analysis**
- Multi-competitor analysis
- SWOT analysis
- Industry benchmarks

📅 **Content Calendar**
- Plan posts in advance
- AI-generated ideas
- Optimal posting times

## 🚀 Next Steps

1. **Get API Keys** (most important!)
2. **Create GitHub Repo**
3. **Upload Files to GitHub**
4. **Deploy to Vercel**
5. **Enjoy your analytics dashboard!**

## 📞 Need Help?

Check the `docs/` folder for detailed guides.

---

**Let's get your Creator Intel running!** 🌟
