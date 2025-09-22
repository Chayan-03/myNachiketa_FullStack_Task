# Lichess Dashboard

A full-stack web application that interacts with the Lichess.org API to display user profiles, leaderboards, and tournaments.

## Features

### 🏆 User Profile
- Search for any Lichess player by username
- Display comprehensive profile information including:
  - Username and title
  - Profile bio and avatar
  - Total games played
  - Ratings across all game formats (Bullet, Blitz, Rapid, etc.)
  - Online status and country

### 📊 Leaderboards
- View top players across different game formats
- Support for multiple game types:
  - Bullet, Blitz, Rapid, Classical
  - Variants: Chess960, King of the Hill, Three-check, Antichess, Atomic, Horde, Racing Kings, Crazyhouse
- Display player rankings with ratings and recent progress

### 🎯 Tournaments
- View ongoing and upcoming tournaments
- Tournament information includes:
  - Tournament name and variant
  - Time controls and start times
  - Number of participants
  - Tournament status (Created, Starting Soon, Started)
  - Direct links to tournaments on Lichess

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **Axios** for API requests
- **CORS** for cross-origin requests
- RESTful API architecture

### Frontend
- **React** with modern hooks
- **React Router** for navigation
- **Axios** for HTTP requests
- **CSS3** with modern styling (gradients, backdrop-filter, animations)
- Fully responsive design

## API Endpoints

### Backend Routes
- `GET /api/profile/:username` - Get user profile information
- `GET /api/leaderboards/:gameType` - Get leaderboard for specific game type
- `GET /api/tournaments` - Get ongoing/upcoming tournaments

### Lichess API Integration
This application uses the following Lichess API endpoints:
- `https://lichess.org/api/user/{username}` - User profile data
- `https://lichess.org/api/leaderboard/{gameType}` - Leaderboard data
- `https://lichess.org/api/tournament` - Tournament data

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The backend will be available at `http://localhost:5000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:5173`

## Usage

### Running the Application
1. Start the backend server first (port 5000)
2. Start the frontend development server (port 5173)
3. Open your browser and navigate to `http://localhost:5173`

### Using the Features

#### Profile Search
1. Go to the Profile page (home page)
2. Enter a Lichess username in the search field
3. Click "Search" to fetch and display the user's profile information

#### Viewing Leaderboards
1. Navigate to the Leaderboards page
2. Select a game type from the tabs (Bullet, Blitz, Rapid, etc.)
3. View the top 50 players for that game format

#### Checking Tournaments
1. Go to the Tournaments page
2. View ongoing and upcoming tournaments
3. Click "View on Lichess" to join or spectate tournaments

## Project Structure

```
myNachiketa_FullStack_Task/
├── backend/
│   ├── index.js           # Express server with API routes
│   ├── package.json       # Backend dependencies
│   └── node_modules/      # Backend dependencies
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Profile.jsx      # Profile search component
    │   │   ├── Profile.css      # Profile styling
    │   │   ├── Leaderboards.jsx # Leaderboards component
    │   │   ├── Leaderboards.css # Leaderboards styling
    │   │   ├── Tournaments.jsx  # Tournaments component
    │   │   └── Tournaments.css  # Tournaments styling
    │   ├── App.jsx              # Main app component with routing
    │   ├── App.css              # Main app styling
    │   ├── index.css            # Global styles
    │   └── main.jsx             # App entry point
    ├── package.json             # Frontend dependencies
    └── vite.config.js           # Vite configuration
```

## Features Implemented

✅ **Profile Page**
- Username input field
- Display user profile with avatar, bio, ratings, and game statistics
- Error handling for invalid usernames
- Responsive design

✅ **Leaderboards Page**
- Multiple game type selection tabs
- Top 50 players display
- Player rankings with ratings and progress indicators
- Color-coded ratings based on skill level

✅ **Tournaments Page**
- Grid layout for tournament cards
- Tournament status indicators
- Time control and participant information
- Direct links to Lichess tournaments

✅ **Additional Features**
- Modern, responsive UI with gradient backgrounds
- Loading states and error handling
- Hover effects and smooth animations
- Cross-platform compatibility

## API Rate Limiting
The Lichess API has rate limiting in place. The application handles this gracefully with error messages and retry functionality.

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is open source and available under the MIT License.

## Acknowledgments
- [Lichess.org](https://lichess.org) for providing the free chess API
- React and Express.js communities for excellent documentation
- Chess community for inspiration
