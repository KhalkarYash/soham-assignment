import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <span className="logo-icon">📱</span> SocialHub
        </Link>
        
        <div className="nav-links">
          {user && (
            <>
              <Link to="/">Home</Link>
              <Link to={`/profile/${user.id}`}>Profile</Link>
              <Link to="/friends">Friends</Link>
              <Link to="/messages">Messages</Link>
              <Link to="/notifications">Notifications</Link>
              {user.isAdmin && <Link to="/admin">Admin</Link>}
            </>
          )}
        </div>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search users, posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <div className="navbar-auth">
          {user ? (
            <>
              <span className="user-greeting">Hi, {user.username}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/register" className="auth-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
