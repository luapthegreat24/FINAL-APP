# Hosted Stripe Server

A simple Express.js server for handling Stripe payments.

## Deploy to Render

1. Push this code to GitHub
2. Connect to Render.com
3. Deploy as Web Service
4. Set build command: `npm install`
5. Set start command: `npm start`

## Environment Variables

- PORT: Auto-set by Render
- NODE_ENV: production

## Endpoints

- GET `/` - Health check
- POST `/create-checkout-session` - Create Stripe checkout
- GET `/checkout-session/:sessionId` - Get session details
