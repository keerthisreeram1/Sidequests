# SideQuests 🗺️

Discover fun things to do near you based on your budget, group, mood, and vibe.

---

## Setup — Step by Step

### Step 1 — Install Node.js
Go to https://nodejs.org and download the LTS version. Install it. Done.

### Step 2 — Get the code on your computer
Open Terminal (Mac) or Command Prompt (Windows) and run:
```
git clone https://github.com/YOUR_USERNAME/sidequests.git
cd sidequests
npm install
```

### Step 3 — Set up Firebase (free)
1. Go to https://console.firebase.google.com
2. Click "Create a project" → name it "sidequests" → click through
3. Once created, click the **Web** icon `</>` to add a web app
4. Register the app → copy the `firebaseConfig` values
5. In the Firebase sidebar go to **Authentication** → Get Started → Enable **Email/Password**

### Step 4 — Get your Claude API key
1. Go to https://console.anthropic.com
2. Sign up / log in → go to API Keys → Create Key
3. Copy it

### Step 5 — Create your .env file
In your project folder, create a file called `.env` (copy from `.env.example`):
```
VITE_FIREBASE_API_KEY=paste_your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=yourproject
VITE_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ANTHROPIC_API_KEY=paste_your_claude_key
```

### Step 6 — Run it locally
```
npm run dev
```
Open http://localhost:5173 in your browser. It's running!

### Step 7 — Push to GitHub
1. Go to https://github.com → New repository → name it `sidequests` → Create
2. In your terminal:
```
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sidequests.git
git push -u origin main
```

### Step 8 — Deploy to Vercel (free)
1. Go to https://vercel.com → Sign up with GitHub
2. Click "Add New Project" → Import your `sidequests` repo
3. Before deploying, click **Environment Variables** and add all the same keys from your `.env` file
4. Click Deploy → done!

You'll get a live URL like `sidequests.vercel.app` you can share or turn into a QR code.

---

## Tech Stack
- React + Vite
- Firebase Auth + Firestore
- Claude API (claude-sonnet-4)
- Vercel (hosting)

## Coming in v2
- Photo capture during quests
- Memory collage generator
- Journal / notes per location
