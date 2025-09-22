# 🏆 Lichess Full-Stack Dashboard

A modern, responsive full-stack web application that integrates with the Lichess.org API to display chess player profiles, leaderboards, and tournament information.

## 🌐 Live Demo

- **Frontend**: [https://my-nachiketa-full-stack-task.vercel.app](https://my-nachiketa-full-stack-task.vercel.app)
- **Backend API**: [https://mynachiketa-fullstack-task.onrender.com](https://mynachiketa-fullstack-task.onrender.com)

## ✨ Features

### 👤 Player Profiles
- **Default View**: Display top 12 chess players automatically on page load
- **Search Functionality**: Search for any specific Lichess player by username
- **Comprehensive Data**: Username, title, bio, avatar, country, online status
- **Game Statistics**: Total games played across all formats
- **Rating Display**: All game type ratings with color-coded skill levels

### 🏅 Leaderboards
- **Multiple Game Types**: Bullet, Blitz, Rapid, Classical, Chess960, and more
- **Top Rankings**: View top 50 players for each game format
- **Real-time Data**: Current ratings and recent progress indicators
- **Interactive Tabs**: Easy navigation between different game types

### 🎯 Tournaments
- **Live Tournaments**: View ongoing and upcoming tournaments
- **Detailed Information**: Tournament name, variant, time controls, participants
- **Status Indicators**: Visual status for created, started, and upcoming tournaments
- **Direct Links**: Quick access to join tournaments on Lichess

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **Axios** for HTTP requests
- **CORS** configuration
- **Error handling** with retry logic
- **Deployed on Render**

### Frontend
- **React 19** with modern hooks
- **Vite** for fast development and building
- **React Router** for navigation
- **Axios** for API communication
- **CSS3** with modern features (Grid, Flexbox, Gradients)
- **Responsive Design** for all devices
- **Deployed on Vercel**

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chayan-03/myNachiketa_FullStack_Task.git
   cd myNachiketa_FullStack_Task
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev  # Starts on http://localhost:5000
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev  # Starts on http://localhost:5173
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/profiles` | Get top chess players (default: 12) |
| `GET` | `/api/profile/:username` | Get specific player profile |
| `GET` | `/api/leaderboards/:gameType` | Get leaderboard for game type |
| `GET` | `/api/tournaments` | Get ongoing/upcoming tournaments |

### Example Requests
```bash
# Get top players
GET https://mynachiketa-fullstack-task.onrender.com/api/profiles?nb=10

# Get specific player
GET https://mynachiketa-fullstack-task.onrender.com/api/profile/hikaru

# Get bullet leaderboard
GET https://mynachiketa-fullstack-task.onrender.com/api/leaderboards/bullet
```

## 📁 Project Structure

```
myNachiketa_FullStack_Task/
├── backend/
│   ├── index.js              # Express server & API routes
│   └── package.json          # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Profile.jsx   # Player profiles component
│   │   │   ├── Leaderboards.jsx # Rankings component
│   │   │   └── Tournaments.jsx  # Tournaments component
│   │   ├── App.jsx           # Main app with routing
│   │   └── main.jsx          # Entry point
│   └── package.json          # Frontend dependencies
├── .gitignore               # Git ignore rules
└── README.md               # This file
```

## 🎨 Key Features Implemented

- ✅ **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ✅ **Error Handling**: Graceful error messages and retry logic
- ✅ **Loading States**: User-friendly loading indicators
- ✅ **Modern UI**: Gradient backgrounds, hover effects, smooth animations
- ✅ **API Rate Limiting**: Built-in handling for Lichess API limits
- ✅ **CORS Configuration**: Proper cross-origin request handling
- ✅ **Production Ready**: Deployed and optimized for production use

## 🔧 Configuration

### Environment Variables
The app automatically detects the environment:
- **Development**: Uses `localhost:5000` for API calls
- **Production**: Uses the deployed Render backend URL

### CORS Setup
Backend is configured to accept requests from:
- Development: `localhost:5173`, `localhost:5174`
- Production: Vercel deployment domain

## 🚀 Deployment

### Backend (Render)
1. Connected to GitHub repository
2. Auto-deploys on code changes
3. Environment: Node.js
4. Build Command: `npm install`
5. Start Command: `node index.js`

### Frontend (Vercel)
1. Connected to GitHub repository
2. Framework: Vite
3. Build Command: `npm run build`
4. Output Directory: `dist`






