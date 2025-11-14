# 💰 Disadventurous Capitalist - Incremental Clicker Game

An incremental clicker game inspired by Adventure Capitalist, built with React, TypeScript, and Firebase. Features OAuth2 authentication with Google and cloud persistence for your game progress.

## 🎮 Features

- **Click to Earn**: Click the button to earn money
- **Businesses**: Buy and manage multiple businesses that generate passive income
- **Managers**: Hire managers to automatically run your businesses
- **Upgrades**: Purchase upgrades to multiply your income
- **OAuth2 Login**: Sign in with Google to save your progress
- **Cloud Persistence**: Your game state is automatically saved to Firebase Firestore
- **Auto-save**: Game automatically saves every 30 seconds
- **Modern UI**: Beautiful, responsive design with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Firebase project with Authentication and Firestore enabled

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd anotherclickergame
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:

   a. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   
   b. Enable Authentication:
      - Go to Authentication > Sign-in method
      - Enable "Google" as a sign-in provider
   
   c. Enable Firestore:
      - Go to Firestore Database
      - Create database in production mode
      - Set up security rules (see below)
   
   d. Get your Firebase configuration:
      - Go to Project Settings > General
      - Scroll down to "Your apps" and click the web icon (</>)
      - Copy your Firebase configuration values

4. Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

5. Set up Firestore Security Rules:

Go to Firestore Database > Rules and use:
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

6. Start the development server:
```bash
npm run dev
```

7. Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Play

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Click**: Click the money button to earn your first dollars
3. **Buy Businesses**: Purchase businesses to generate passive income
4. **Hire Managers**: Buy manager upgrades to automate businesses
5. **Purchase Upgrades**: Buy upgrades to multiply your income
6. **Grow**: Keep clicking and buying to build your empire!

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Firebase Auth** - OAuth2 authentication
- **Firebase Firestore** - Cloud database
- **CSS3** - Styling with modern gradients and animations

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Game.tsx        # Main game component
│   ├── Login.tsx       # Login screen
│   ├── ClickerButton.tsx
│   ├── BusinessManager.tsx
│   ├── UpgradePanel.tsx
│   └── UserPanel.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom hooks
│   └── useGameState.ts # Game state management
├── services/           # Services
│   └── firebaseService.ts # Firebase operations
├── data/               # Game data
│   ├── businesses.ts   # Business definitions
│   └── upgrades.ts     # Upgrade definitions
├── types/              # TypeScript types
│   └── game.ts         # Game type definitions
└── config/             # Configuration
    └── firebase.ts     # Firebase setup
```

## 🎨 Features in Detail

### Businesses
- Start with a Lemonade Stand and work your way up to an Oil Company
- Each business generates income based on how many you own
- Businesses with managers generate income automatically

### Upgrades
- **Income Multipliers**: Multiply income for specific businesses
- **Global Multipliers**: Multiply all income sources
- **Managers**: Automate businesses so they run without clicking

### Persistence
- Game state is saved to Firebase Firestore
- Auto-saves every 30 seconds
- Manual save button available
- Game loads automatically when you sign in

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔒 Security

Make sure to set up proper Firestore security rules to protect user data. The rules should ensure users can only read/write their own game data.

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
