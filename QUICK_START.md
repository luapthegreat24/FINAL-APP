# ⚡ QUICK START - 2 STEPS TO GO LIVE!

## 🚨 DO THIS NOW (3 minutes):

### Step 1: Add Environment Variables (2 min)

**Go to:** https://vercel.com/qpgdbraganza-4961s-projects/cookie_app/settings/environment-variables

**Add these 2 variables:**

**Variable 1:**

```
Key:   STRIPE_SECRET_KEY
Value: sk_test_51SDRD2KLsgahIll1V81w8mkMxJxuE2ar0GWiSqtbmpBvSHjJvKbWzS2InQV1qiiPwpZ7BH0WAfdS6LbsW8RQ7B5w00L3kJQOSe
Env:   Production
```

**Variable 2:**

```
Key:   FRONTEND_URL
Value: http://localhost:8100
Env:   Production
```

### Step 2: Redeploy (1 min)

```powershell
cd C:\Users\PaulB\cookie_app
vercel --prod
```

## ✅ DONE! Now test:

```powershell
# Test on Android:
npx cap open android

# OR test on web:
npm run dev
```

**Test Card:** `4242 4242 4242 4242` | Expiry: `12/34` | CVC: `123`

---

## 📋 YOUR URLS:

**Backend:** https://cookie-59enfc4zk-qpgdbraganza-4961s-projects.vercel.app
**Frontend:** http://localhost:8100 (for now)
**Stripe Dashboard:** https://dashboard.stripe.com/test/payments

---

**Full Guide:** See `VERCEL_DEPLOYMENT_COMPLETE.md` 📖
