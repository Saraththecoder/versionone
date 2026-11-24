# Installation & Local Setup

Follow these steps to run the AITS Smart Bus Tracking system on your local machine.

## Prerequisites

1. **Node.js**: Ensure you have Node.js version 20 or higher installed.
2. **NPM**: Package manager (comes with Node.js).
3. **Firebase Account**: You need a Firebase project set up.

## 1. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. **Enable Authentication**: Turn on Google Sign-In and Email/Password providers.
3. **Enable Firestore**: Create a Firestore database. Deploy the security rules found in `firestore.rules`.
4. **Enable Realtime Database**: Create a RTDB. Deploy the security rules found in `database.rules.json`.
5. **Project Settings**: Go to Project Settings > General > Your Apps, and create a new Web App. Copy the Firebase SDK configuration object.

## 2. Environment Variables

Create a file named `.env.local` in the root of the repository and populate it with your Firebase configuration values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id.firebaseio.com
```

## 3. Installation

Run the following command to install the required dependencies:

```bash
npm install
```

## 4. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 5. Bootstrapping Admin Access

By default, nobody has access to the `/admin` portal. To bootstrap your first admin:

1. Log in via Google on the student/admin login page so your user account is created in Firebase Auth.
2. Go to the Firebase Console -> Firestore -> Create a collection named `admins`.
3. Add a document where the Document ID is your Firebase Authentication UID.
4. Refresh the application and you will now have access to the Admin Dashboard.
