# Deployment Guide

The AITS Smart Bus Tracking system is designed to be deployed on Vercel for the frontend/Next.js infrastructure, and Firebase for the backend/database infrastructure.

## 1. Firebase Backend Deployment

Before deploying the frontend, ensure your Firebase backend is secure and ready.

1. Install the Firebase CLI: `npm install -g firebase-tools`
2. Login to your Firebase account: `firebase login`
3. Initialize Firebase in the root directory if not already done: `firebase init`
   - Select `Firestore` and `Realtime Database`.
   - Select your existing Firebase project.
4. Deploy the security rules:
   ```bash
   firebase deploy --only firestore:rules,database:rules
   ```

## 2. Vercel Frontend Deployment

The easiest way to deploy a Next.js App Router application is via Vercel.

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your Git repository.
4. Open the **Environment Variables** tab before deploying.
5. Add all the variables from your `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
6. Click **Deploy**.

Vercel will automatically run `npm run build`, which triggers the `next-pwa` build process, compiles the TypeScript, and statically generates the pages.

## 3. Post-Deployment

- **PWA**: Open the production URL on a mobile device and you should be prompted to "Install App" or "Add to Homescreen".
- **Real-time Map**: Because Leaflet requires access to the `window` object, the maps are dynamically imported and rendered entirely client-side. Ensure no mixed-content warnings appear in the production console.
- **Monitoring**: The app logs core Web Vitals in development. For production, you may want to connect Vercel Analytics or Google Analytics.
