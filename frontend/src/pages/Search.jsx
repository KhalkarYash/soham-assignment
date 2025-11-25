import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/Search.css';

export default function Search() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      searchUsers();
    }
  }, [query]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const response = await authAPI.searchUsers(query);
      setResults(response.data);
    } catch (error) {
      console.log('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h2>Search Results for "{query}"</h2>
      {loading ? (
        <div className="loading">Searching...</div>
      ) : results.length === 0 ? (
        <div className="no-results">No users found</div>
      ) : (
        <div className="search-results">
          {results.map(user => (
            <div key={user._id} className="search-result">
              <img src={user.profilePic || 'https://via.placeholder.com/60'} alt={user.username} />
              <div>
                <h3>{user.username}</h3>
                <p>{user.email}</p>
              </div>
              <a href={`/profile/${user._id}`}>View Profile</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
