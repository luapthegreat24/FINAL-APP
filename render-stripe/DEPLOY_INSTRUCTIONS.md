# Quick Render Deployment Instructions

## 1. Create a new GitHub repository

- Go to GitHub.com
- Create a new repository named "stripe-server"
- Upload the files from this `render-stripe` folder

## 2. Deploy to Render

- Go to render.com
- Sign up/login
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Use these settings:
  - **Name**: stripe-server
  - **Environment**: Node
  - **Build Command**: npm install
  - **Start Command**: node server.js
  - **Plan**: Free

## 3. Environment Variables

Add in Render dashboard:

- **STRIPE_SECRET_KEY**: sk_test_51SDRD2KLsgahIll1V81w8mkMxJxuE2ar0GWiSqtbmpBvSHjJvKbWzS2InQV1qiiPwpZ7BH0WAfdS6LbsW8RQ7B5w00L3kJQOSe

## 4. Your deployed URL will be:

https://stripe-server-[random].onrender.com

## Alternative: Use this working server temporarily

Since deployment is complex, I'll create a simple localhost server for immediate testing.

**Current Issue**: Vercel has authentication protection enabled
**Solution**: Use Render deployment or local server on different port
