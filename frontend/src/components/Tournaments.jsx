import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tournaments.css';

const API_BASE_URL = 'http://localhost:5000/api';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTournaments = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_BASE_URL}/tournaments`);
      setTournaments(response.data);
    } catch (err) {
      setError('Failed to fetch tournaments data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'TBD';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeControl = (clock) => {
    if (!clock) return 'N/A';
    const { limit, increment } = clock;
    const minutes = Math.floor(limit / 60);
    return `${minutes}+${increment}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 30: return '#4CAF50'; // Started
      case 20: return '#FF9800'; // Created
      case 10: return '#2196F3'; // Created
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 30: return 'Started';
      case 20: return 'Starting Soon';
      case 10: return 'Created';
      default: return 'Unknown';
    }
  };

  const getVariantIcon = (variant) => {
    switch (variant?.toLowerCase()) {
      case 'standard': return '♔';
      case 'chess960': return '🎲';
      case 'king of the hill': return '⛰️';
      case 'three-check': return '✓';
      case 'antichess': return '💀';
      case 'atomic': return '💥';
      case 'horde': return '🏰';
      case 'racing kings': return '🏃';
      case 'crazyhouse': return '🏠';
      default: return '♔';
    }
  };

  return (
    <div className="tournaments-container">
      <div className="tournaments-header">
        <h2>🎯 Tournaments</h2>
        <p>Upcoming and ongoing tournaments on Lichess</p>
        <button 
          className="refresh-button" 
          onClick={fetchTournaments}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading && <div className="loading">Loading tournaments...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && tournaments.length > 0 && (
        <div className="tournaments-grid">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="tournament-card">
              <div className="tournament-header">
                <div className="tournament-variant">
                  <span className="variant-icon">
                    {getVariantIcon(tournament.variant)}
                  </span>
                  <span className="variant-name">{tournament.variant}</span>
                </div>
                <div 
                  className="tournament-status"
                  style={{ color: getStatusColor(tournament.status) }}
                >
                  {getStatusText(tournament.status)}
                </div>
              </div>

              <div className="tournament-body">
                <h3 className="tournament-name">{tournament.name}</h3>
                
                <div className="tournament-details">
                  <div className="detail-item">
                    <span className="detail-label">⏱️ Time Control:</span>
                    <span className="detail-value">
                      {formatTimeControl(tournament.timeControl)}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">📅 Starts:</span>
                    <span className="detail-value">
                      {formatDate(tournament.startsAt)}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">👥 Players:</span>
                    <span className="detail-value">
                      {tournament.nbPlayers || 0}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">🏆 Rated:</span>
                    <span className="detail-value">
                      {tournament.rated ? 'Yes' : 'No'}
                    </span>
                  </div>

                  {tournament.perf && (
                    <div className="detail-item">
                      <span className="detail-label">🎯 Category:</span>
                      <span className="detail-value">
                        {tournament.perf.name}
                      </span>
                    </div>
                  )}

                  {tournament.winner && (
                    <div className="detail-item">
                      <span className="detail-label">🥇 Winner:</span>
                      <span className="detail-value winner">
                        {tournament.winner.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="tournament-footer">
                <a
                  href={`https://lichess.org/tournament/${tournament.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-tournament-link"
                >
                  View on Lichess →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && tournaments.length === 0 && (
        <div className="no-data">
          <p>No tournaments available at the moment.</p>
          <button onClick={fetchTournaments} className="retry-button">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Tournaments;
