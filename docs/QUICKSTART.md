# Creator Intel - Quick Start Guide 🚀

## 5-Minute Setup

This guide will get you from zero to deployed in about 5 minutes!

### Step 1: Get Your API Keys (2 minutes)

**Instagram API:**
1. Go to https://developers.facebook.com
2. Create a new app → "Business" type
3. Add "Instagram Graph API"
4. Create/connect Instagram Business Account
5. Generate long-lived token → Copy it

**Claude API:**
1. Go to https://console.anthropic.com
2. Sign up → Create API key
3. Copy it

**Supabase:**
1. Go to https://supabase.com
2. Create new project
3. Get URL and Anon Key from Settings → API

### Step 2: Clone & Setup Local (2 minutes)

```bash
# Clone the repo
git clone https://github.com/astrohit3107/v0-creatorintel-dashboard.git
cd v0-creatorintel-dashboard

# Install dependencies
npm install

# Create .env.local with your keys
echo "NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
INSTAGRAM_ACCESS_TOKEN=your_token_here
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id_here
ANTHROPIC_API_KEY=your_claude_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000" > .env.local

# Start development server
npm run dev
```

Visit http://localhost:3000 and see your Creator Intel dashboard! 🎉

### Step 3: Create Database Tables (1 minute)

1. Go to your Supabase project
2. Open SQL Editor
3. Paste this entire SQL block:

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
```

4. Click "Run" ✓

### Step 4: Deploy to Vercel (Optional but Recommended!)

**Option A: Super Easy (Recommended)**
1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial setup"
git push origin main
```

2. Go to https://vercel.com
3. Click "New Project"
4. Select your GitHub repo
5. Click "Deploy"
6. Add environment variables in Vercel Settings
7. Done! 🚀

**Option B: Manual with Vercel CLI**
```bash
npm i -g vercel
vercel
# Follow prompts, add env vars, deploy!
```

## File Structure You Just Created

```
├── app/
│   ├── api/
│   │   ├── insights/         ← Fetch IG data + Claude analysis
│   │   └── recommendations/  ← Save recommendations
│   ├── dashboard/            ← Beautiful UI dashboard
│   └── globals.css           ← Styling
├── lib/
│   ├── instagram-api.ts      ← Instagram integration
│   ├── ai-processor.ts       ← Claude AI integration
│   └── supabase.ts           ← Database client
├── .env.local                ← Your secrets (don't commit!)
└── README.md                 ← Full documentation
```

## What Just Happened? 🤔

Your app now:
- ✅ Fetches real Instagram data using Graph API
- ✅ Sends it to Claude AI for analysis
- ✅ Generates AI recommendations
- ✅ Stores everything in Supabase
- ✅ Shows beautiful dashboard with insights

## Next Steps

1. **Test it locally** - Visit http://localhost:3000
2. **Deploy to Vercel** - 1-click from GitHub
3. **Share your achievements** - Tag us @creatorintel

## Troubleshooting

### "Cannot find module '@anthropic-ai/sdk'"
```bash
npm install @anthropic-ai/sdk
```

### "Instagram token error"
- Token expires after 60 days - refresh it at developers.facebook.com
- Make sure it's a LONG-LIVED token

### "Supabase error"
- Check your .env.local has correct URL and keys
- Run the SQL in Supabase console
- Verify tables exist: inspect → Tables

### "Claude not working"
- Verify API key at console.anthropic.com
- Check you have credits/usage available

## Features You Have Now

✨ **Instagram Analytics**
- Real-time followers, engagement, reach
- Top posts analysis
- Audience demographics

🤖 **AI-Powered Insights**
- Automatic analysis of your profile
- Strengths & weaknesses detection
- Personalized recommendations

📊 **Beautiful Dashboard**
- Real-time metrics cards
- Performance charts
- Recommendation cards
- Analytics view

## Pro Tips 💡

1. **Auto-refresh**: Add to your dashboard:
```js
setInterval(() => fetchData(), 3600000); // Every hour
```

2. **Customize Claude prompts**: Edit `lib/ai-processor.ts` for different analysis types

3. **Add more metrics**: Extend `lib/instagram-api.ts` with more API calls

4. **Store history**: The app already stores metrics - build charts from them!

## Support

- 📖 Full docs: Check README.md
- 🐛 Issues: Open GitHub issue
- 💬 Questions: Start a discussion

---

**You're all set!** 🎉 Your Creator Intel dashboard is ready to help creators grow!
