# RENDER DEPLOYMENT - COPY & PASTE GUIDE

# ========================================

## 🚀 DEPLOY YOUR STRIPE SERVER (5 MINUTES)

### Step 1: Sign Up on Render

1. Go to: https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended) or email

### Step 2: Create New Web Service

1. Click "New +" in top right
2. Select "Web Service"
3. Choose "Public Git repository" (or connect your GitHub)

### Step 3: Repository Setup

If using public Git repository:

- You'll need to push your code to GitHub first
- OR use the manual upload option

**For now, let's use Render's manual approach:**

1. Click "Deploy without connecting a repository"
2. Or connect GitHub and select your repo

### Step 4: Configuration Settings

**COPY & PASTE THESE EXACT VALUES:**

```
Name: chip-happens-stripe-server
Region: Oregon (US West) - or closest to you
Branch: main
Root Directory: (leave empty)
Environment: Node
Build Command: npm install
Start Command: node stripe-server.js
Plan: Free
```

### Step 5: Environment Variables

Click "Advanced" → "Add Environment Variable"

**ADD THESE 3 VARIABLES:**

```
Variable Name: STRIPE_SECRET_KEY
Value: sk_test_51SDRD2KLsgahIll1V81w8mkMxJxuE2ar0GWiSqtbmpBvSHjJvKbWzS2InQV1qiiPwpZ7BH0WAfdS6LbsW8RQ7B5w00L3kJQOSe

Variable Name: FRONTEND_URL
Value: http://localhost:8100

Variable Name: PORT
Value: 4242
```

### Step 6: Deploy!

1. Click "Create Web Service"
2. Wait 2-3 minutes for deployment
3. Your URL will be: `https://chip-happens-stripe-server.onrender.com` (or similar)

---

## 📋 AFTER DEPLOYMENT - UPDATE YOUR APP

### 1. Copy Your Render URL

After deployment completes, copy your service URL from Render dashboard.

Example: `https://chip-happens-stripe-server-abc123.onrender.com`

### 2. Update Frontend Environment Variable

Open your `.env` file and update:

```
REACT_APP_STRIPE_API_URL=https://YOUR-RENDER-URL-HERE.onrender.com
```

### 3. Restart Your Local Dev Server

```bash
npm run dev
```

### 4. Test It!

- Add items to cart
- Go to checkout
- Click "Pay with Stripe"
- Should redirect to Stripe (now using remote server!)

---

## 🔧 ALTERNATIVE: DEPLOY WITHOUT GITHUB

If you don't want to use GitHub, here's the easiest way:

### Option A: Use Render's Render.yaml (Manual Deploy)

1. Zip your `stripe-server.js` and `package.json`
2. Upload to Render via their manual deploy option

### Option B: Use Vercel (Easiest!)

1. Install: `npm install -g vercel`
2. Run: `vercel login`
3. Run: `vercel`
4. Follow prompts
5. Copy URL

---

## ⚠️ IMPORTANT NOTES

### Free Tier Limitations

- Render free tier: Server sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- After that, it's instant
- 750 hours/month free (plenty for testing)

### Security

- ✅ Your Stripe secret key is stored securely on Render
- ✅ Never commit .env files to Git
- ✅ Use HTTPS (Render provides this automatically)

### When You Deploy Frontend to Production

Update the `FRONTEND_URL` environment variable on Render:

1. Go to your service on Render
2. Click "Environment"
3. Edit `FRONTEND_URL` to your production URL
4. Example: `https://chip-happens.netlify.app`
5. Click "Save Changes"

---

## 🆘 TROUBLESHOOTING

### Server Not Responding

- Check Render logs (click "Logs" tab)
- Verify environment variables are set correctly
- Ensure `stripe-server.js` is in root directory

### Payment Fails

- Check if STRIPE_SECRET_KEY is correct
- Verify FRONTEND_URL matches your app URL
- Check Render logs for errors

### CORS Errors

- Update cors() in stripe-server.js if needed
- Verify frontend URL is correct

---

## 📞 NEED HELP?

If you run into issues:

1. Check Render logs
2. Verify all environment variables
3. Test locally first: `node stripe-server.js`
4. Check Stripe dashboard for payment errors

---

## ✅ SUCCESS CHECKLIST

- [ ] Render account created
- [ ] Web service created and deployed
- [ ] Environment variables added (all 3)
- [ ] Service status shows "Live"
- [ ] Render URL copied
- [ ] Frontend .env updated with Render URL
- [ ] Frontend restarted
- [ ] Test payment completed successfully

---

## 🎉 YOU'RE DONE!

Your Stripe server is now hosted remotely and accessible from anywhere!

**Your production URL:** https://chip-happens-stripe-server.onrender.com

Use this URL in your frontend's `REACT_APP_STRIPE_API_URL` environment variable.

Good luck! 🚀🍪
