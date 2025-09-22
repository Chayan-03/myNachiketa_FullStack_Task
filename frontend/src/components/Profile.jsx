import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const API_BASE_URL = 'http://localhost:5000/api';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(true);

  // Load all profiles on component mount
  useEffect(() => {
    fetchAllProfiles();
  }, []);

  const fetchAllProfiles = async () => {
    setLoadingAll(true);
    setError('');

    try {
      const response = await axios.get(`${API_BASE_URL}/profiles?nb=15`);
      setProfiles(response.data);
      setShowAll(true);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      if (err.response?.status === 503) {
        if (err.response.data?.code === 'TIMEOUT') {
          setError('Lichess servers are currently slow. Please try again in a moment.');
        } else if (err.response.data?.code === 'CONNECTION_ERROR') {
          setError('Unable to connect to Lichess. Please check your internet connection.');
        } else {
          setError(err.response.data?.error || 'Lichess API is currently unavailable.');
        }
      } else {
        setError('Failed to fetch profiles. Please try again later.');
      }
    } finally {
      setLoadingAll(false);
    }
  };

  const fetchProfile = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');
    setProfile(null);
    setShowAll(false);

    try {
      const response = await axios.get(`${API_BASE_URL}/profile/${username.trim()}`);
      setProfile(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      if (err.response?.status === 404) {
        setError('User not found. Please check the username.');
      } else if (err.response?.status === 503) {
        if (err.response.data?.code === 'TIMEOUT') {
          setError('Lichess servers are currently slow. Please try again in a moment.');
        } else if (err.response.data?.code === 'CONNECTION_ERROR') {
          setError('Unable to connect to Lichess. Please check your internet connection.');
        } else {
          setError(err.response.data?.error || 'Lichess API is currently unavailable.');
        }
      } else {
        setError('Failed to fetch profile. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetToAllProfiles = () => {
    setShowAll(true);
    setProfile(null);
    setUsername('');
    setError('');
    if (profiles.length === 0) {
      fetchAllProfiles();
    }
  };

  const formatRating = (perf) => {
    if (!perf) return 'N/A';
    return `${perf.rating || 'N/A'} (${perf.games || 0} games)`;
  };

  const getRatingColor = (rating) => {
    if (!rating || rating < 1200) return '#666';
    if (rating < 1400) return '#996633';
    if (rating < 1600) return '#669900';
    if (rating < 1800) return '#0099cc';
    if (rating < 2000) return '#9966cc';
    if (rating < 2200) return '#ff9900';
    return '#ff6600';
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>♔ Player Profiles</h2>
        <p>
          {showAll 
            ? "Top Lichess players profiles" 
            : "Search results"}
        </p>
      </div>

      <div className="profile-controls">
        <form className="search-form" onSubmit={fetchProfile}>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Search for specific username..."
              className="username-input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="search-button"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        <div className="view-toggles">
          <button 
            className={`toggle-button ${showAll ? 'active' : ''}`}
            onClick={resetToAllProfiles}
            disabled={loadingAll}
          >
            {loadingAll ? 'Loading...' : 'Show All Players'}
          </button>
          <button 
            className="refresh-button"
            onClick={fetchAllProfiles}
            disabled={loadingAll}
          >
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Single Profile View */}
      {!showAll && profile && (
        <div className="profile-card single-profile">
          <div className="profile-basic">
            <div className="profile-avatar">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={`${profile.username}'s avatar`} />
              ) : (
                <div className="default-avatar">
                  <span>{profile.username.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="profile-info">
              <h3 className="profile-username">
                {profile.title && <span className="title">{profile.title}</span>}
                {profile.username}
                {profile.online && <span className="online-indicator">●</span>}
              </h3>
              {profile.country && (
                <p className="profile-country">📍 {profile.country}</p>
              )}
              <p className="profile-bio">
                {profile.bio || 'No biography available'}
              </p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <h4>Total Games</h4>
              <p className="stat-value">{profile.gamesPlayed.toLocaleString()}</p>
            </div>
          </div>

          <div className="ratings-section">
            <h4>Ratings</h4>
            <div className="ratings-grid">
              {Object.entries(profile.ratings).map(([gameType, perf]) => (
                <div key={gameType} className="rating-card">
                  <div className="rating-header">
                    <span className="game-type">{gameType.charAt(0).toUpperCase() + gameType.slice(1)}</span>
                  </div>
                  <div 
                    className="rating-value"
                    style={{ color: getRatingColor(perf.rating) }}
                  >
                    {perf.rating || 'N/A'}
                  </div>
                  <div className="rating-games">
                    {perf.games || 0} games
                  </div>
                  {perf.rd && (
                    <div className="rating-deviation">
                      ±{Math.round(perf.rd)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Profiles View */}
      {showAll && (
        <div className="profiles-grid">
          {loadingAll ? (
            <div className="loading">Loading top players...</div>
          ) : (
            profiles.map((profile, index) => (
              <div key={profile.username} className="profile-card grid-profile">
                <div className="profile-rank">#{index + 1}</div>
                <div className="profile-basic">
                  <div className="profile-avatar small">
                    {profile.profileImage ? (
                      <img src={profile.profileImage} alt={`${profile.username}'s avatar`} />
                    ) : (
                      <div className="default-avatar">
                        <span>{profile.username.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div className="profile-info">
                    <h3 className="profile-username">
                      {profile.title && <span className="title">{profile.title}</span>}
                      {profile.username}
                      {profile.online && <span className="online-indicator">●</span>}
                    </h3>
                    {profile.country && (
                      <p className="profile-country">📍 {profile.country}</p>
                    )}
                    <p className="profile-bio short">
                      {profile.bio && profile.bio.length > 50 
                        ? `${profile.bio.substring(0, 50)}...` 
                        : profile.bio || 'No biography available'}
                    </p>
                  </div>
                </div>

                <div className="profile-quick-stats">
                  <div className="quick-stat">
                    <span className="stat-label">Games:</span>
                    <span className="stat-value">{profile.gamesPlayed.toLocaleString()}</span>
                  </div>
                  <div className="top-ratings">
                    {Object.entries(profile.ratings)
                      .filter(([_, perf]) => perf.rating && perf.games > 0)
                      .sort((a, b) => b[1].rating - a[1].rating)
                      .slice(0, 3)
                      .map(([gameType, perf]) => (
                        <div key={gameType} className="mini-rating">
                          <span className="mini-game-type">{gameType}</span>
                          <span 
                            className="mini-rating-value"
                            style={{ color: getRatingColor(perf.rating) }}
                          >
                            {perf.rating}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
