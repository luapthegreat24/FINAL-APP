# 🔑 YOUR DEPLOYMENT KEYS & DETAILS

# ====================================

## 📋 QUICK REFERENCE

### Your Stripe Test Key

```
sk_test_51SDRD2KLsgahIll1V81w8mkMxJxuE2ar0GWiSqtbmpBvSHjJvKbWzS2InQV1qiiPwpZ7BH0WAfdS6LbsW8RQ7B5w00L3kJQOSe
```

⚠️ **For Production:** Get your LIVE key from https://dashboard.stripe.com/apikeys

- Live key starts with: `sk_live_...`

---

## 🌐 YOUR CURRENT URLS

### Development (Local)

```
Frontend:  http://localhost:8100
Backend:   http://localhost:4242
```

### Production (After Deployment)

```
Frontend:  TBD - will be something like https://chip-happens.netlify.app
Backend:   https://cookie-59enfc4zk-qpgdbraganza-4961s-projects.vercel.app ✅ DEPLOYED!
```

---

## ⚙️ ENVIRONMENT VARIABLES

### Frontend (.env)

```env
REACT_APP_STRIPE_API_URL=http://localhost:4242
REACT_APP_ENV=development
```

**After Backend Deployment, Update To:**

```env
REACT_APP_STRIPE_API_URL=https://cookie-59enfc4zk-qpgdbraganza-4961s-projects.vercel.app
REACT_APP_ENV=production
```

✅ **ALREADY DONE! Your .env is updated!**

### Backend (Railway/Render Dashboard)

```env
STRIPE_SECRET_KEY=sk_test_51SDRD2KLsgahIll1V81w8mkMxJxuE2ar0GWiSqtbmpBvSHjJvKbWzS2InQV1qiiPwpZ7BH0WAfdS6LbsW8RQ7B5w00L3kJQOSe
FRONTEND_URL=http://localhost:8100
PORT=4242
```

**After Frontend Deployment, Update To:**

```env
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY (get from Stripe dashboard)
FRONTEND_URL=https://YOUR-FRONTEND-URL.netlify.app
PORT=4242
```

---

## 💳 TEST CREDIT CARDS (Stripe Test Mode)

### Success Payment

```
Card Number:  4242 4242 4242 4242
Expiry Date:  12/34 (any future date)
CVC:          123 (any 3 digits)
ZIP Code:     12345 (any 5 digits)
```

### Declined Payment (For Testing)

```
Card Number:  4000 0000 0000 0002
Expiry:       12/34
CVC:          123
```

### Requires Authentication (3D Secure)

```
Card Number:  4000 0025 0000 3155
Expiry:       12/34
CVC:          123
```

More test cards: https://stripe.com/docs/testing

---

## 🚀 DEPLOYMENT PLATFORMS (Choose One)

### Option 1: Railway (RECOMMENDED)

- **URL:** https://railway.app
- **Free Tier:** $5/month credit
- **Sleep:** No sleeping ✅
- **Speed:** Fast
- **Best For:** Backend servers

**Setup Steps:**

1. Sign up at Railway
2. New Project → Empty Service
3. Name: `stripe-server`
4. Settings:
   - Build: `npm install`
   - Start: `node stripe-server.js`
5. Variables: Add the 3 env vars above
6. Deploy → Generate Domain
7. Copy URL

### Option 2: Render

- **URL:** https://render.com
- **Free Tier:** 750 hours/month
- **Sleep:** Yes (after 15 min) ⚠️
- **Speed:** Slow wake-up (~30 sec)
- **Best For:** Testing

**Setup Steps:**

1. Sign up at Render
2. New Web Service
3. Settings:
   - Build: `npm install`
   - Start: `node stripe-server.js`
4. Environment: Add 3 vars
5. Deploy
6. Copy URL

### Option 3: Vercel

- **URL:** https://vercel.com
- **Free Tier:** Good limits
- **Sleep:** No ✅
- **Speed:** Very fast
- **Best For:** Serverless functions

**Setup Steps:**

1. Install: `npm install -g vercel`
2. Run: `vercel login`
3. Run: `vercel`
4. Copy URL

---

## 📝 DEPLOYMENT CHECKLIST

### Before Deployment

- [ ] `stripe-server.js` is updated with environment variables ✅
- [ ] `Checkout.tsx` uses `REACT_APP_STRIPE_API_URL` ✅
- [ ] `.env` file created ✅
- [ ] `server/.env` created ✅
- [ ] `.gitignore` protects secrets ✅

### During Deployment

- [ ] Sign up on platform (Railway/Render/Vercel)
- [ ] Create new service/project
- [ ] Configure build & start commands
- [ ] Add environment variables
- [ ] Deploy and wait for completion
- [ ] Copy deployed URL

### After Deployment

- [ ] Update frontend `.env` with backend URL
- [ ] Restart frontend dev server
- [ ] Test checkout flow
- [ ] Verify Stripe redirect works
- [ ] Check order confirmation page
- [ ] Test COD payment

---

## 🔐 SECURITY CHECKLIST

- [ ] Never commit `.env` files to Git
- [ ] Use environment variables for all secrets
- [ ] Use HTTPS in production (auto with Netlify/Vercel/Railway)
- [ ] Get Stripe LIVE keys for production
- [ ] Keep test/live keys separate
- [ ] Monitor Stripe dashboard for suspicious activity

---

## 📞 SUPPORT & RESOURCES

### Stripe

- Dashboard: https://dashboard.stripe.com
- Test Cards: https://stripe.com/docs/testing
- API Docs: https://stripe.com/docs/api

### Hosting

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com

### Your Files

- Backend Config: `stripe-server.js`
- Frontend Config: `src/pages/Checkout.tsx`
- Env Template: `.env.example`
- Deployment Guide: `EASY_DEPLOY.md`

---

## 🎯 NEXT STEPS

### 1. Deploy Backend (5 minutes)

- Go to Railway/Render/Vercel
- Follow steps in `EASY_DEPLOY.md`
- Copy your deployed URL

### 2. Update Frontend (1 minute)

- Open `.env`
- Update `REACT_APP_STRIPE_API_URL`
- Restart: `npm run dev`

### 3. Test Everything (5 minutes)

- Add to cart
- Checkout
- Pay with test card
- Verify order confirmation

### 4. Deploy Frontend (Optional)

- Deploy to Netlify
- Update backend `FRONTEND_URL`
- Get production Stripe keys
- Test live!

---

## 📊 COSTS

### Development (Free)

- Stripe: Free (test mode)
- Backend: Free tier
- Frontend: Free (localhost)

### Production

- Stripe: 2.9% + ₱15 per transaction
- Railway: $5/month free credit
- Render: 750 hours free/month
- Netlify: 100GB bandwidth free/month

**Total: $0 for testing, ~$5-10/month for production**

---

## ✅ EVERYTHING YOU NEED

This file contains:

- ✅ Your Stripe test key
- ✅ Environment variable templates
- ✅ Test credit cards
- ✅ Deployment platform options
- ✅ Complete checklists
- ✅ Next steps

**You're ready to deploy!** 🚀

Choose a platform from above and follow the steps in `EASY_DEPLOY.md`

Good luck! 🍪
