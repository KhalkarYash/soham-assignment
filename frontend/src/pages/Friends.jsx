import React, { useEffect, useState } from 'react';
import { friendsAPI } from '../services/api';
import '../styles/Friends.css';

export default function Friends() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await friendsAPI.getPendingRequests();
      setPendingRequests(response.data);
    } catch (error) {
      console.log('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (userId) => {
    try {
      await friendsAPI.acceptRequest(userId);
      fetchPendingRequests();
    } catch (error) {
      console.log('Error accepting request:', error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await friendsAPI.rejectRequest(userId);
      fetchPendingRequests();
    } catch (error) {
      console.log('Error rejecting request:', error);
    }
  };

  if (loading) return <div className="loading">Loading friend requests...</div>;

  return (
    <div className="friends-container">
      <h2>Friend Requests</h2>
      {pendingRequests.length === 0 ? (
        <div className="no-requests">No pending friend requests</div>
      ) : (
        <div className="requests-list">
          {pendingRequests.map(req => (
            <div key={req.from._id} className="request-item">
              <img src={req.from.profilePic || 'https://via.placeholder.com/80'} alt={req.from.username} />
              <div className="request-info">
                <h4>{req.from.username}</h4>
                <p>{req.from.email}</p>
              </div>
              <div className="request-actions">
                <button onClick={() => handleAccept(req.from._id)} className="accept-btn">Accept</button>
                <button onClick={() => handleReject(req.from._id)} className="reject-btn">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
