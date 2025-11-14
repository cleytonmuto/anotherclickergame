# Firebase Setup Guide

This guide will help you set up Firebase for the Disadventurous Capitalist game.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

## Step 2: Enable Google Authentication

1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Click on **Google** provider
3. Enable it and configure your project support email
4. Click **Save**

## Step 3: Enable Firestore Database

1. Go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Select **Start in production mode** (you'll set up security rules later)
4. Choose a location for your database (preferably close to your users)
5. Click **Enable**

## Step 4: Set Up Firestore Security Rules

1. Go to **Firestore Database** > **Rules**
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

## Step 5: Get Your Firebase Configuration

1. Go to **Project Settings** (gear icon) > **General**
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`)
4. Register your app with a nickname (e.g., "Disadventurous Capitalist")
5. Copy the configuration values

You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Step 6: Create Your .env File

1. Copy `env.example` to `.env` in the root directory:
   ```bash
   cp env.example .env
   ```

2. Open `.env` and replace the placeholder values with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

## Step 7: Test Your Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser
3. Click "Sign in with Google"
4. After signing in, you should see the game interface
5. Your game progress will be automatically saved to Firestore

## Troubleshooting

### Authentication not working
- Make sure Google Authentication is enabled in Firebase Console
- Check that your `authDomain` matches your Firebase project domain
- Verify that your OAuth consent screen is configured (if required)

### Firestore errors
- Make sure Firestore Database is enabled
- Verify your security rules are correctly set
- Check that your `projectId` is correct

### Environment variables not loading
- Make sure your `.env` file is in the root directory
- Restart your development server after changing `.env`
- Verify that all variable names start with `VITE_`
- Check that there are no spaces around the `=` sign

## Security Notes

- **Never commit your `.env` file to version control**
- The `.env` file is already in `.gitignore`
- Your Firebase API keys are safe to use in client-side code (they're public anyway)
- The security rules protect your Firestore data

## Need Help?

If you encounter any issues, check the [Firebase Documentation](https://firebase.google.com/docs) or the project's README.md file.

