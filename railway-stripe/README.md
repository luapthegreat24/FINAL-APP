# Railway Stripe Server

This is a simple Express.js server for handling Stripe payments, deployed on Railway.

## Deployment URL

The server will be available at: https://[railway-app-name].railway.app

## Endpoints

- GET / - Health check
- POST /create-checkout-session - Create Stripe checkout session

## Environment Variables

- STRIPE_SECRET_KEY: Your Stripe secret key (set in Railway dashboard)
- PORT: Automatically set by Railway

## Test the server

Once deployed, test with:

```bash
curl https://[your-railway-url].railway.app
```
