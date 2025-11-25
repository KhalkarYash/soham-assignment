import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authAPI, postsAPI, friendsAPI } from '../services/api';
import '../styles/Profile.css';

export default function Profile() {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const userRes = await authAPI.getUser(userId);
      setUserProfile(userRes.data);

      const postsRes = await postsAPI.getUserPosts(userId);
      setUserPosts(postsRes.data);
    } catch (error) {
      console.log('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    try {
      await friendsAPI.sendRequest(userId);
      alert('Friend request sent');
    } catch (error) {
      console.log('Error sending friend request:', error);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!userProfile) return <div className="error">User not found</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="cover-photo">
          <img src={userProfile.coverPhoto || 'https://via.placeholder.com/1200x300'} alt="cover" />
        </div>
        <div className="profile-info">
          <img src={userProfile.profilePic || 'https://via.placeholder.com/150'} alt="profile" className="profile-pic" />
          <div className="info">
            <h2>{userProfile.username}</h2>
            <p>{userProfile.email}</p>
            <p className="bio">{userProfile.bio || 'No bio yet'}</p>
          </div>
          {currentUser.id !== userId && (
            <button onClick={handleAddFriend} className="add-friend-btn">Add Friend</button>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="friends-section">
          <h3>Friends ({userProfile.friends?.length || 0})</h3>
          <div className="friends-grid">
            {userProfile.friends?.map(friend => (
              <div key={friend._id} className="friend-card">
                <img src={friend.profilePic || 'https://via.placeholder.com/80'} alt={friend.username} />
                <p>{friend.username}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="posts-section">
          <h3>Posts ({userPosts.length})</h3>
          {userPosts.length === 0 ? (
            <p className="no-posts">No posts yet</p>
          ) : (
            userPosts.map(post => (
              <div key={post._id} className="post-preview">
                <p>{post.content}</p>
                {post.image && <img src={post.image} alt="post" />}
                <small>{new Date(post.createdAt).toLocaleDateString()}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
