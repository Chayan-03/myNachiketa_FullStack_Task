import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboards.css';

const API_BASE_URL = 'http://localhost:5000/api';

const Leaderboards = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedGameType, setSelectedGameType] = useState('bullet');

  const gameTypes = [
    { key: 'bullet', name: 'Bullet' },
    { key: 'blitz', name: 'Blitz' },
    { key: 'rapid', name: 'Rapid' },
    { key: 'classical', name: 'Classical' },
    { key: 'correspondence', name: 'Correspondence' },
    { key: 'chess960', name: 'Chess960' },
    { key: 'kingOfTheHill', name: 'King of the Hill' },
    { key: 'threeCheck', name: 'Three-check' },
    { key: 'antichess', name: 'Antichess' },
    { key: 'atomic', name: 'Atomic' },
    { key: 'horde', name: 'Horde' },
    { key: 'racingKings', name: 'Racing Kings' },
    { key: 'crazyhouse', name: 'Crazyhouse' }
  ];

  const fetchLeaderboard = async (gameType = selectedGameType) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_BASE_URL}/leaderboards/${gameType}`, {
        params: { nb: 50 }
      });
      setLeaderboard(response.data);
    } catch (err) {
      setError('Failed to fetch leaderboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedGameType]);

  const handleGameTypeChange = (gameType) => {
    setSelectedGameType(gameType);
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

  const getRankMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="leaderboards-container">
      <div className="leaderboards-header">
        <h2>🏆 Leaderboards</h2>
        <p>Top players in various game formats</p>
      </div>

      <div className="game-type-selector">
        <div className="game-type-tabs">
          {gameTypes.map(gameType => (
            <button
              key={gameType.key}
              className={`game-type-tab ${selectedGameType === gameType.key ? 'active' : ''}`}
              onClick={() => handleGameTypeChange(gameType.key)}
              disabled={loading}
            >
              {gameType.name}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="loading">Loading leaderboard...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && leaderboard.length > 0 && (
        <div className="leaderboard-list">
          <div className="leaderboard-title">
            <h3>{gameTypes.find(gt => gt.key === selectedGameType)?.name} Top Players</h3>
          </div>
          
          <div className="leaderboard-table">
            <div className="table-header">
              <div className="rank-column">Rank</div>
              <div className="player-column">Player</div>
              <div className="rating-column">Rating</div>
              <div className="progress-column">Progress</div>
            </div>
            
            {leaderboard.map((player, index) => (
              <div key={player.username} className="player-row">
                <div className="rank-cell">
                  <span className="rank">{getRankMedal(index + 1)}</span>
                </div>
                
                <div className="player-cell">
                  <div className="player-info">
                    <div className="player-name">
                      {player.title && (
                        <span className="player-title">{player.title}</span>
                      )}
                      <span className="username">{player.username}</span>
                      {player.online && <span className="online-dot">●</span>}
                      {player.patron && <span className="patron-wing">👑</span>}
                    </div>
                  </div>
                </div>
                
                <div className="rating-cell">
                  <span 
                    className="rating"
                    style={{ color: getRatingColor(player.rating) }}
                  >
                    {player.rating}
                  </span>
                </div>
                
                <div className="progress-cell">
                  <span className={`progress ${player.progress >= 0 ? 'positive' : 'negative'}`}>
                    {player.progress > 0 ? '+' : ''}{player.progress}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && leaderboard.length === 0 && (
        <div className="no-data">No leaderboard data available for this game type.</div>
      )}
    </div>
  );
};

export default Leaderboards;
