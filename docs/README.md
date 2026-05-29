# Creator Intel 🚀

**AI-Powered Instagram Analytics & Growth Recommendations**

Creator Intel is a full-stack Next.js application that connects to your Instagram Business Account, analyzes your metrics using Claude AI, and provides actionable recommendations to grow your audience.

## Features ✨

- 📊 **Real-time Instagram Insights** - Fetch followers, engagement rate, reach, and impressions
- 🤖 **AI-Powered Analysis** - Claude AI analyzes your metrics and generates recommendations
- 💡 **Actionable Recommendations** - Get specific, prioritized recommendations to improve your profile
- 📈 **Performance Tracking** - Monitor your progress with detailed analytics
- 🎯 **Audience Demographics** - Understand your audience by location, gender, and age
- 📱 **Responsive Design** - Beautiful, modern UI that works on all devices

## Tech Stack 🛠️

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Recharts
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API
- **API Integration**: Instagram Graph API
- **Deployment**: Vercel

## Prerequisites 📋

Before you start, you'll need:

1. **Node.js** 18.17+ and npm
2. **GitHub Account** - Fork or clone the repo
3. **Vercel Account** - For deployment (free)
4. **Supabase Account** - For database (free tier available)
5. **Anthropic API Key** - For Claude AI (get at https://console.anthropic.com)
6. **Instagram Business Account** - With Graph API access
7. **Instagram Graph API Credentials**:
   - Access Token
   - Business Account ID

## Setup Instructions 🎯

### 1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/creator-intel.git
cd creator-intel
npm install
```

### 2. **Set Up Supabase Database**

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your **Project URL** and **Anon Key** from Settings → API
3. Run these SQL queries in your Supabase SQL editor:

```sql
-- Creators table
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
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
  timestamp TIMESTAMP DEFAULT NOW(),
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

-- Enable RLS (Row Level Security) if needed
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE insight_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
```

### 3. **Get Instagram Graph API Credentials**

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a Facebook App (Business type)
3. Add Instagram Graph API product
4. Create an Instagram Business Account or connect existing one
5. Generate a long-lived Access Token
6. Get your Business Account ID

### 4. **Get Claude API Key**

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to API keys section
4. Create a new API key
5. Keep it safe (you'll need it in the next step)

### 5. **Configure Environment Variables**

Create a `.env.local` file in the root directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Instagram Graph API
INSTAGRAM_ACCESS_TOKEN=your_long_lived_token_here
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_account_id_here

# Anthropic Claude API
ANTHROPIC_API_KEY=your_claude_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 6. **Run Locally**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and you should see the dashboard!

## Deployment to Vercel 🚀

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial Creator Intel setup"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"

### Step 3: Add Environment Variables

In Vercel project settings:

1. Go to **Settings → Environment Variables**
2. Add all variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `INSTAGRAM_ACCESS_TOKEN`
   - `INSTAGRAM_BUSINESS_ACCOUNT_ID`
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain)

### Step 4: Deploy

Click "Deploy" and Vercel will automatically build and deploy your app!

Your site will be live at `https://your-project.vercel.app`

## API Endpoints 📡

### GET `/api/insights`
Fetches Instagram insights and analyzes with Claude

**Response:**
```json
{
  "success": true,
  "insights": { /* Instagram metrics */ },
  "analysis": { /* Claude AI analysis */ },
  "creatorId": "uuid"
}
```

### GET `/api/recommendations?creatorId=<id>`
Retrieves saved recommendations for a creator

### POST `/api/recommendations`
Generates and saves new recommendations

**Body:**
```json
{
  "creatorId": "uuid",
  "insights": { /* metrics data */ }
}
```

## Project Structure 📁

```
creator-intel/
├── app/
│   ├── api/
│   │   ├── insights/
│   │   │   └── route.ts
│   │   └── recommendations/
│   │       └── route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── ai-processor.ts
│   ├── instagram-api.ts
│   └── supabase.ts
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Usage Guide 📖

1. **First Load**: The app fetches your Instagram data automatically
2. **View Insights**: See your followers, engagement rate, reach, and impressions
3. **Read Analysis**: Claude AI provides a summary, strengths, and areas for improvement
4. **Check Recommendations**: Get prioritized recommendations on the "Recommendations" tab
5. **Monitor Analytics**: View your top posts and engagement trends

## Customization 🎨

### Styling
- Modify colors in `tailwind.config.ts`
- Update component styles in `app/globals.css`
- Customize dashboard layout in `app/dashboard/page.tsx`

### AI Prompts
- Edit analysis prompt in `lib/ai-processor.ts` → `buildAnalysisPrompt()`
- Edit strategy prompt in `lib/ai-processor.ts` → `buildStrategyPrompt()`

### API Metrics
- Add more Instagram metrics in `lib/instagram-api.ts`
- Update dashboard cards in `app/dashboard/page.tsx`

## Troubleshooting 🔧

### "Failed to fetch insights"
- Check that `INSTAGRAM_ACCESS_TOKEN` is valid and not expired
- Verify `INSTAGRAM_BUSINESS_ACCOUNT_ID` is correct
- Ensure Instagram account has Graph API permissions

### "Claude API error"
- Verify `ANTHROPIC_API_KEY` is correct
- Check your API quota at console.anthropic.com
- Ensure the model name is correct in `lib/ai-processor.ts`

### "Supabase connection error"
- Check `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Verify database tables are created
- Check RLS policies allow access

### "Build fails on Vercel"
- Clear Vercel cache and redeploy
- Check all environment variables are set
- Review Vercel build logs for specific errors

## Best Practices 💡

1. **Refresh Token**: Refresh your Instagram token every 60 days
2. **Monitor Usage**: Check Claude API usage in console.anthropic.com
3. **Database Maintenance**: Archive old metrics to keep queries fast
4. **Update Prompts**: Refine AI prompts based on recommendations quality
5. **Security**: Never commit `.env.local` to git (it's in `.gitignore`)

## Support & Contributing 🤝

- 📧 Email: support@creatorintel.com
- 🐛 Issues: Report bugs on GitHub
- 💬 Discussions: Share ideas and feedback

## License 📄

MIT License - feel free to use this project for personal or commercial purposes!

## Roadmap 🗺️

- [ ] Multi-account support
- [ ] TikTok & YouTube integration
- [ ] Advanced competitor analysis
- [ ] Email reports
- [ ] Collaboration features
- [ ] Custom AI training

---

**Made with ❤️ by the Creator Intel Team**

**Questions?** Check our [documentation](https://docs.creatorintel.com) or open an issue on GitHub!
