# Creator Intel - No Local Setup Required! 🚀

## Fast Track: Download → GitHub → Vercel (No Mac Needed!)

This guide shows you how to get your Creator Intel app live **without touching your Mac terminal**. Just download, upload to GitHub, and deploy to Vercel!

**Total time: ~10 minutes** ⏱️

---

## 📋 What You'll Do

1. ✅ Download all files (organized folder)
2. ✅ Create a new GitHub repository
3. ✅ Upload files to GitHub (using web interface)
4. ✅ Connect GitHub to Vercel
5. ✅ Click "Deploy"
6. ✅ See your app live!

---

## 🎯 Step-by-Step Instructions

### **STEP 1: Download All Files** 📥

**All files are in `/home/claude/`**

I've organized them perfectly for you. Here's what to download:

#### **Core Files to Download:**

```
app/
├── api/
│   ├── insights/route.ts
│   ├── recommendations/route.ts
│   ├── competitor-analysis/route.ts
│   └── content-calendar/route.ts
├── dashboard/
│   ├── page.tsx
│   ├── competitor-analysis.tsx
│   └── content-calendar.tsx
├── globals.css
├── layout.tsx
└── page.tsx

lib/
├── instagram-api.ts
├── ai-processor.ts
├── supabase.ts
├── competitor-analyzer.ts
└── content-calendar.ts

.github/
└── workflows/
    └── deploy.yml

supabase/
└── migrations/
    └── 001_create_content_calendar.sql

Configuration Files:
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── .eslintrc.json
├── .gitignore
└── .env.example

Documentation:
├── README.md
├── QUICKSTART.md
├── DEPLOYMENT.md
└── SETUP_SUMMARY.md
```

---

### **STEP 2: Create a New GitHub Repository** 🐙

1. Go to https://github.com/new
2. **Repository name:** `creator-intel`
3. **Description:** `AI-powered Instagram analytics with competitor analysis and content calendar`
4. **Public** or **Private** (your choice)
5. **Don't initialize with README** (uncheck that box)
6. Click **"Create repository"**

**You'll get a URL like:** `https://github.com/yourusername/creator-intel`

---

### **STEP 3: Upload Files to GitHub** 📤

**Option A: Using GitHub Web Interface (Easiest)**

1. Go to your new repository (the URL from Step 2)
2. Click **"Add file"** → **"Upload files"**
3. **Drag and drop ALL your downloaded files** into the upload area
4. Scroll down and click **"Commit changes"**
5. Done! All files on GitHub! ✅

**Option B: Using GitHub Desktop (Alternative)**

1. Download GitHub Desktop from desktop.github.com
2. Clone your repository
3. Drag downloaded files into the folder
4. Click "Commit to main"
5. Click "Push origin"

---

### **STEP 4: Add Environment Variables to GitHub** 🔐

**Important:** GitHub needs your secret API keys.

1. Go to your GitHub repo
2. Click **Settings** (top right)
3. Click **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**
5. Add these secrets (one by one):

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: your_supabase_url

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: your_supabase_anon_key

Name: SUPABASE_SERVICE_ROLE_KEY
Value: your_supabase_service_key

Name: INSTAGRAM_ACCESS_TOKEN
Value: your_instagram_token

Name: INSTAGRAM_BUSINESS_ACCOUNT_ID
Value: your_business_account_id

Name: ANTHROPIC_API_KEY
Value: your_claude_api_key
```

**Where to get these:**
- Supabase → https://supabase.com → Settings → API
- Instagram → https://developers.facebook.com
- Claude → https://console.anthropic.com → API Keys

---

### **STEP 5: Create Supabase Database Tables** 📊

Before deploying, create the database tables:

1. Go to https://supabase.com → Your project
2. Click **"SQL Editor"**
3. Click **"New Query"**
4. Copy and paste this:

```sql
-- Creators table
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instagram_username VARCHAR(255) UNIQUE NOT NULL,
  instagram_id VARCHAR(255) UNIQUE NOT NULL,
  followers_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insight Metrics table
CREATE TABLE insight_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES creators ON DELETE CASCADE,
  metric_name VARCHAR(255) NOT NULL,
  metric_value DECIMAL(20,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Recommendations table
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

-- Content Calendar table
CREATE TABLE content_calendar (
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

-- Create indexes
CREATE INDEX idx_content_calendar_creator_id ON content_calendar(creator_id);
CREATE INDEX idx_content_calendar_scheduled_date ON content_calendar(scheduled_date);
CREATE INDEX idx_content_calendar_status ON content_calendar(status);
```

5. Click **"Run"**
6. Done! Tables created! ✅

---

### **STEP 6: Deploy to Vercel** 🚀

**The easiest part!**

1. Go to https://vercel.com
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Paste your GitHub repo URL: `https://github.com/yourusername/creator-intel`
5. Click **"Import"**
6. Click **"Continue"**

**Add Environment Variables:**
1. You'll see "Environment Variables" section
2. Add the same secrets from Step 4:
   - `NEXT_PUBLIC_SUPABASE_URL` = your_url
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your_key
   - etc.
3. Click **"Deploy"**

**Wait 2-3 minutes...**

You'll see:
```
✓ Deployment Complete!
https://creator-intel.vercel.app
```

**Click the link and see your app live!** 🎉

---

## ✅ Checklist

- [ ] Downloaded all files
- [ ] Created GitHub repo
- [ ] Uploaded files to GitHub
- [ ] Added secrets to GitHub
- [ ] Created Supabase tables
- [ ] Deployed to Vercel
- [ ] Visit live URL
- [ ] See your Creator Intel dashboard!

---

## 🎯 Your Live App URLs

**After deployment:**
- GitHub: `https://github.com/yourusername/creator-intel`
- Live App: `https://creator-intel.vercel.app` (or your custom domain)

---

## 📝 Required API Keys

You'll need these (get them before starting):

1. **Supabase** (free tier available)
   - https://supabase.com
   - Project URL
   - Anon Key
   - Service Role Key

2. **Instagram Business**
   - https://developers.facebook.com
   - Business Account ID
   - Long-lived Access Token

3. **Claude API**
   - https://console.anthropic.com
   - API Key (free credits available)

---

## 🎨 What You Get

✨ **Features:**
- Real-time Instagram metrics
- AI-powered analysis (Claude)
- Competitor analysis
- Content calendar planning
- Responsive design
- Automatic GitHub → Vercel deployment

🎯 **3 Dashboard Tabs:**
1. Overview - Instagram insights
2. Recommendations - AI suggestions
3. Analytics - Performance metrics

---

## 🆘 Troubleshooting

**"Permission denied" on GitHub upload?**
- Make sure you own the repository
- Check GitHub login

**"Can't find files" on Vercel?**
- Make sure all files are in root directory
- Check folder structure matches

**"API error" when app loads?**
- Check environment variables in Vercel
- Verify API keys are correct
- Check Supabase tables exist

**"Supabase connection error"?**
- Verify URL and keys are exact
- Check tables were created
- Look at Supabase logs

---

## 🚀 Next Steps

1. **Get API Keys** (5 min)
2. **Create GitHub Repo** (2 min)
3. **Upload Files** (2 min)
4. **Deploy to Vercel** (3 min)
5. **Visit Live URL** (1 min)

**Total: ~13 minutes to live app!** ⏱️

---

## 💡 Pro Tips

✅ **Auto-Deploy:** Every time you push to GitHub, Vercel auto-deploys
✅ **Custom Domain:** Add your own domain in Vercel settings
✅ **Monitoring:** Check Vercel dashboard for errors
✅ **Preview URLs:** Every push gets a preview link before production

---

## 🎉 You're Ready!

**No Mac terminal needed!** Just:
1. Download files
2. Create GitHub repo
3. Upload files
4. Deploy to Vercel
5. See it live!

**Questions?** Check the full README.md for details.

**Let's go! 🚀**
