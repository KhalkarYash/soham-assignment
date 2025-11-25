import React, { useEffect, useState, useContext } from 'react';
import { postsAPI, friendsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/Feed.css';

export default function Feed() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [newPostImage, setNewPostImage] = useState('');

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await postsAPI.getFeed();
      setPosts(response.data);
    } catch (error) {
      console.log('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      await postsAPI.createPost({
        content: newPost,
        image: newPostImage
      });
      setNewPost('');
      setNewPostImage('');
      fetchFeed();
    } catch (error) {
      console.log('Error creating post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postsAPI.likePost(postId);
      fetchFeed();
    } catch (error) {
      console.log('Error liking post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await postsAPI.deletePost(postId);
      fetchFeed();
    } catch (error) {
      console.log('Error deleting post:', error);
    }
  };

  return (
    <div className="feed-container">
      <div className="feed">
        {user && (
          <div className="create-post">
            <div className="create-post-header">
              <img src={user.profilePic || 'https://via.placeholder.com/40'} alt="profile" />
              <form onSubmit={handleCreatePost} className="create-post-form">
                <textarea
                  placeholder="What's on your mind?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows="3"
                />
                <div className="post-actions">
                  <input
                    type="text"
                    placeholder="Image URL (optional)"
                    value={newPostImage}
                    onChange={(e) => setNewPostImage(e.target.value)}
                  />
                  <button type="submit">Post</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="no-posts">No posts yet. Follow friends to see their posts!</div>
        ) : (
          posts.map(post => (
            <div key={post._id} className="post">
              <div className="post-header">
                <img src={post.author?.profilePic || 'https://via.placeholder.com/40'} alt="author" />
                <div>
                  <h4>{post.author?.username}</h4>
                  <small>{new Date(post.createdAt).toLocaleDateString()}</small>
                </div>
                {user?.id === post.author?._id && (
                  <button onClick={() => handleDeletePost(post._id)} className="delete-btn">✕</button>
                )}
              </div>

              <div className="post-content">
                <p>{post.content}</p>
                {post.image && <img src={post.image} alt="post" />}
              </div>

              <div className="post-stats">
                <span>{post.likes?.length || 0} likes</span>
                <span>{post.comments?.length || 0} comments</span>
              </div>

              <div className="post-actions">
                <button onClick={() => handleLike(post._id)}>
                  {post.likes?.some(id => id === user?.id) ? '❤️' : '🤍'} Like
                </button>
                <button>💬 Comment</button>
                <button>📤 Share</button>
              </div>

              {post.comments?.length > 0 && (
                <div className="comments">
                  {post.comments.map((comment, idx) => (
                    <div key={idx} className="comment">
                      <img src={comment.author?.profilePic || 'https://via.placeholder.com/30'} alt="author" />
                      <div>
                        <strong>{comment.author?.username}</strong>
                        <p>{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="sidebar">
        <div className="trending">
          <h3>📈 Trending Topics</h3>
          <div className="trend-item">#Web Development</div>
          <div className="trend-item">#React</div>
          <div className="trend-item">#JavaScript</div>
          <div className="trend-item">#WebDevelopment</div>
          <div className="trend-item">#SocialMedia</div>
        </div>
      </div>
    </div>
  );
}
