# Deploying Creator Intel to Vercel 🚀

This guide will walk you through deploying your Creator Intel app to Vercel in detail.

## Prerequisites

✅ You have completed the local setup (npm install, .env.local, npm run dev works)
✅ You have a GitHub account with your code pushed to a repository
✅ You have all API keys ready:
   - Supabase URL & Keys
   - Instagram Access Token & Account ID
   - Anthropic API Key

## Step 1: Prepare Your GitHub Repository

### Make sure your code is pushed:

```bash
# Navigate to your project directory
cd creator-intel

# Make sure you've committed everything
git add .
git commit -m "Creator Intel initial setup"

# Push to your GitHub repository
git push origin main
```

### Important: Verify .gitignore

Make sure your `.gitignore` contains:
```
.env.local
node_modules/
.next/
```

This ensures your secrets are NOT pushed to GitHub.

## Step 2: Create Vercel Account & Connect GitHub

### 2.1 Sign Up for Vercel

1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### 2.2 Import Your Project

1. You'll see your GitHub repos
2. Find `v0-creatorintel-dashboard`
3. Click "Import"
4. Click "Continue"

## Step 3: Configure Environment Variables

### 3.1 Add Environment Variables in Vercel

This is crucial! Missing env vars will cause deployment to fail.

1. You'll see the "Configure Project" step
2. Under "Environment Variables", add all these:

**Supabase Variables:**
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY = your_service_role_key_here
```

**Instagram Variables:**
```
INSTAGRAM_ACCESS_TOKEN = your_long_lived_token_here
INSTAGRAM_BUSINESS_ACCOUNT_ID = your_business_account_id_here
```

**Anthropic Variables:**
```
ANTHROPIC_API_KEY = your_claude_api_key_here
```

**App Variables:**
```
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
```

### 3.2 Get Your Values from the Right Places

**For Supabase:**
1. Go to https://supabase.com → Your Project
2. Click Settings → API
3. Copy "Project URL" → paste as `NEXT_PUBLIC_SUPABASE_URL`
4. Copy "anon public" key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy "service_role" key → paste as `SUPABASE_SERVICE_ROLE_KEY`

**For Instagram:**
1. Go to https://developers.facebook.com
2. Your App → Settings → Basic
3. Find your Business Account ID
4. Your App → Instagram → Graph API → Access Tokens → Copy long-lived token

**For Claude:**
1. Go to https://console.anthropic.com
2. API Keys → Copy your active key

## Step 4: Deploy

### 4.1 Final Deployment

1. After adding all environment variables, click "Deploy"
2. Vercel will automatically:
   - Clone your repo
   - Install dependencies (`npm install`)
   - Build your project (`npm run build`)
   - Deploy to production

### 4.2 Wait for Deployment

You'll see:
```
✓ Preparing...
✓ Installing...
✓ Building...
✓ Uploading...
✓ Deployed!
```

This takes about 2-3 minutes.

### 4.3 Access Your App

Once deployed, you'll see:
```
✓ Your deployment is ready!
https://your-app.vercel.app
```

Click the link to visit your live Creator Intel dashboard! 🎉

## Step 5: Verify Everything Works

### Test Your Deployment

1. Open https://your-app.vercel.app
2. You should see the Creator Intel dashboard loading
3. After a few seconds, you should see your Instagram data

### If you see errors:

**"Cannot find environment variables"**
- Go back to Vercel dashboard
- Project Settings → Environment Variables
- Verify all variables are there
- Redeploy (click "Deployments" → "..." → "Redeploy")

**"Instagram API Error"**
- Check your token is long-lived
- Verify Business Account ID is correct
- Verify token permissions include Instagram Graph API

**"Claude API Error"**
- Verify API key in console.anthropic.com
- Check you have available API quota
- Make sure key is not expired

**"Supabase Connection Error"**
- Verify URL and keys are correct
- Check that database tables exist in Supabase
- Verify RLS policies allow access

## Step 6: Set Up Automatic Deployments

Your Vercel deployment is now connected to GitHub. This means:

✅ Every time you push to `main` branch → Automatic deployment
✅ Every pull request → Preview deployment
✅ Failed builds → Email notification

### To modify deployment behavior:

1. Go to your Vercel Project Dashboard
2. Settings → Git
3. Customize deployment options as needed

## Step 7: Custom Domain (Optional)

### Add Your Own Domain

1. Vercel Dashboard → Your Project → Settings → Domains
2. Enter your domain (e.g., `creatorintel.com`)
3. Follow DNS setup instructions
4. Done! 🎯

## Monitoring & Troubleshooting

### View Deployment Logs

1. Vercel Dashboard → Deployments
2. Click the latest deployment
3. Click "Logs" to see build output
4. Look for errors in red

### Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Build fails with "Missing env vars" | Add all env vars in Project Settings |
| "Cannot connect to Supabase" | Verify URL and keys, check tables exist |
| "Instagram auth error" | Refresh your access token |
| "Claude API timeout" | Check API key credits at console.anthropic.com |
| "App shows blank page" | Check browser console for errors (F12) |

### Environment Variable Tips

- `NEXT_PUBLIC_*` vars are visible in browser (safe for public values)
- Other vars are secret (use for tokens & keys)
- Changes to env vars require redeploy
- Can't edit `.env.local` in production (use Vercel Settings)

## Performance Tips

1. **Enable Caching**: Vercel does this automatically
2. **Monitor Usage**: Check Claude API usage in console
3. **Database Optimization**: Archive old metrics after 6 months
4. **CDN**: Vercel's global CDN is enabled by default

## Next Steps

✅ App is deployed!
✅ Auto-deploys on git push!
✅ Live domain assigned!

Now:
1. Share your app link!
2. Add custom domain (optional)
3. Set up monitoring
4. Customize the AI prompts
5. Add more features!

## Rollback to Previous Version

If something breaks after a deployment:

1. Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"
4. Done! Back to previous version

## Questions?

📧 Check the README.md for more details
🐛 Stuck? Open a GitHub issue
💬 Need help? Start a discussion

---

**Congratulations! 🎉 Your Creator Intel is now live on the internet!**
