const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'https://my-nachiketa-full-stack-task.vercel.app/' // Add your Vercel domain here
  ],
  credentials: true
}));
app.use(express.json());

// Lichess API base URL
const LICHESS_API = "https://lichess.org/api";


const apiClient = axios.create({
    baseURL: LICHESS_API,
    timeout: 10000, 
    headers: {
        'User-Agent': 'LichessProfileViewer/1.0',
        'Accept': 'application/json'
    }
});


const axiosRetry = async (url, options = {}, retries = 2) => {
    for (let i = 0; i <= retries; i++) {
        try {
            const response = await apiClient.get(url, options);
            return response;
        } catch (error) {
            if (i === retries) {
                throw error;
            }
            console.log(`Retry ${i + 1}/${retries} for ${url}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
};


app.get("/api/profiles", async (req, res) => {
    try {
        const nb = req.query.nb || 20; 
        const gameType = req.query.gameType || "bullet";
        
        console.log(`Fetching top ${nb} ${gameType} players...`);
        
        // Get top players first with retry logic
        const response = await axiosRetry(`/player/top/${nb}/${gameType}`);
        
        if (!response.data || !response.data.users) {
            return res.status(500).json({ error: "Invalid response from Lichess API" });
        }

        console.log(`Got ${response.data.users.length} players from leaderboard`);
        const playersToFetch = response.data.users.slice(0, 15); // Reduce to 15 to prevent timeouts
        const profilePromises = playersToFetch.map(async (user, index) => {
            try {
                console.log(`Fetching profile ${index + 1}/${playersToFetch.length}: ${user.username}`);
                const profileResponse = await axiosRetry(`/user/${user.username}`);
                return {
                    username: profileResponse.data.username,
                    bio: profileResponse.data.profile?.bio || "No bio available",
                    gamesPlayed: profileResponse.data.count?.all || 0,
                    ratings: profileResponse.data.perfs || {},
                    profileImage: profileResponse.data.profile?.avatar || null,
                    title: profileResponse.data.title || null,
                    online: profileResponse.data.online || false,
                    country: profileResponse.data.profile?.country || null
                };
            } catch (error) {
                console.log(`Failed to fetch profile for ${user.username}:`, error.message);
                // If individual profile fails, return basic info from leaderboard
                return {
                    username: user.username,
                    bio: "No bio available",
                    gamesPlayed: 0,
                    ratings: user.perfs || { [gameType]: { rating: user.rating || 0, games: 0 } },
                    profileImage: null,
                    title: user.title || null,
                    online: user.online || false,
                    country: null
                };
            }
        });
        
        const profiles = await Promise.allSettled(profilePromises);
        const successfulProfiles = profiles
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
            
        console.log(`Successfully fetched ${successfulProfiles.length} profiles`);
        res.json(successfulProfiles);
    } catch (error) {
        console.error("Error fetching profiles:", error.message);
        console.error("Error code:", error.code);
        
        // Return a more helpful error message
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            res.status(503).json({ 
                error: "Lichess API is currently unavailable. Please try again later.",
                code: "TIMEOUT"
            });
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            res.status(503).json({ 
                error: "Cannot connect to Lichess. Please check your internet connection.",
                code: "CONNECTION_ERROR"
            });
        } else {
            res.status(500).json({ error: "Failed to fetch profiles" });
        }
    }
});

// Route: Get user profile
app.get("/api/profile/:username", async (req, res) => {
    try {
        const { username } = req.params;
        console.log(`Fetching profile for: ${username}`);
        
        const response = await axiosRetry(`/user/${username}`);
        
        const userProfile = {
            username: response.data.username,
            bio: response.data.profile?.bio || "No bio available",
            gamesPlayed: response.data.count?.all || 0,
            ratings: response.data.perfs || {},
            profileImage: response.data.profile?.avatar || null,
            title: response.data.title || null,
            online: response.data.online || false,
            country: response.data.profile?.country || null
        };
        
        res.json(userProfile);
    } catch (error) {
        console.error("Error fetching user profile:", error.message);
        
        if (error.response?.status === 404) {
            res.status(404).json({ error: "User not found" });
        } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            res.status(503).json({ 
                error: "Lichess API is currently unavailable. Please try again later.",
                code: "TIMEOUT"
            });
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            res.status(503).json({ 
                error: "Cannot connect to Lichess. Please check your internet connection.",
                code: "CONNECTION_ERROR"
            });
        } else {
            res.status(500).json({ error: "Failed to fetch user profile" });
        }
    }
});


app.get("/api/leaderboards/:gameType", async (req, res) => {
    try {
        const gameType = req.params.gameType || "bullet";
        const nb = req.query.nb || 50; // Number of players to fetch
        
        console.log(`Fetching ${gameType} leaderboard (${nb} players)...`);
        
        // Use the correct Lichess API endpoint for leaderboards with retry
        const response = await axiosRetry(`/player/top/${nb}/${gameType}`);
        
        const leaderboard = response.data.users.map(user => ({
            username: user.username,
            title: user.title || null,
            rating: user.perfs?.[gameType]?.rating || user.rating,
            progress: user.progress || 0,
            online: user.online || false,
            patron: user.patron || false
        }));
        
        res.json(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboards:", error.message);
        console.error("Error code:", error.code);
        
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            res.status(503).json({ 
                error: "Lichess API is currently unavailable. Please try again later.",
                code: "TIMEOUT"
            });
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            res.status(503).json({ 
                error: "Cannot connect to Lichess. Please check your internet connection.",
                code: "CONNECTION_ERROR"
            });
        } else {
            res.status(500).json({ error: "Failed to fetch leaderboards" });
        }
    }
});

// Route: Get leaderboards with default
app.get("/api/leaderboards", async (req, res) => {
    try {
        const gameType = "bullet";
        const nb = req.query.nb || 50; // Number of players to fetch
        
        console.log(`Fetching default ${gameType} leaderboard (${nb} players)...`);
        
        // Use the correct Lichess API endpoint for leaderboards with retry
        const response = await axiosRetry(`/player/top/${nb}/${gameType}`);
        
        const leaderboard = response.data.users.map(user => ({
            username: user.username,
            title: user.title || null,
            rating: user.perfs?.[gameType]?.rating || user.rating,
            progress: user.progress || 0,
            online: user.online || false,
            patron: user.patron || false
        }));
        
        res.json(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboards:", error.message);
        console.error("Error code:", error.code);
        
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            res.status(503).json({ 
                error: "Lichess API is currently unavailable. Please try again later.",
                code: "TIMEOUT"
            });
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            res.status(503).json({ 
                error: "Cannot connect to Lichess. Please check your internet connection.",
                code: "CONNECTION_ERROR"
            });
        } else {
            res.status(500).json({ error: "Failed to fetch leaderboards" });
        }
    }
});

// Route: Get tournaments
app.get("/api/tournaments", async (req, res) => {
    try {
        console.log("Fetching tournaments...");
        
        // Use the correct Lichess API endpoint for current tournaments with retry
        const response = await axiosRetry(`/tournament`);
        
        // Get tournaments from created and started arrays
        const allTournaments = [
            ...(response.data.created || []),
            ...(response.data.started || [])
        ];
        
        const tournaments = allTournaments.slice(0, 20).map(tournament => ({
            id: tournament.id,
            name: tournament.fullName || tournament.name,
            variant: tournament.variant?.name || "Standard",
            rated: tournament.rated,
            timeControl: tournament.clock,
            startsAt: tournament.startsAt,
            status: tournament.status,
            nbPlayers: tournament.nbPlayers || 0,
            winner: tournament.winner || null,
            perf: tournament.perf,
            minutes: tournament.minutes,
            system: tournament.system || "arena"
        }));
        
        console.log(`Found ${tournaments.length} tournaments`);
        res.json(tournaments);
    } catch (error) {
        console.error("Error fetching tournaments:", error.message);
        console.error("Error code:", error.code);
        
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            res.status(503).json({ 
                error: "Lichess API is currently unavailable. Please try again later.",
                code: "TIMEOUT"
            });
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            res.status(503).json({ 
                error: "Cannot connect to Lichess. Please check your internet connection.",
                code: "CONNECTION_ERROR"
            });
        } else {
            res.status(500).json({ error: "Failed to fetch tournaments" });
        }
    }
});

// Test route to check server connectivity
app.get("/api/test", (req, res) => {
    res.json({ 
        message: "Server is working",
        timestamp: new Date().toISOString(),
        status: "healthy"
    });
});

// Default route
app.get("/", (req, res) => {
    res.json({ 
        message: "Lichess API Backend Server",
        endpoints: [
            "GET /api/test - Test server connectivity",
            "GET /api/profiles - Get multiple user profiles (top players)",
            "GET /api/profile/:username - Get specific user profile",
            "GET /api/leaderboards/:gameType - Get leaderboards (bullet, blitz, rapid, etc.)",
            "GET /api/tournaments - Get ongoing/upcoming tournaments"
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});