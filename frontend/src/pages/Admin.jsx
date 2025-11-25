import React, { useEffect, useState, useContext } from 'react';
import { adminAPI, authAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/Admin.css';

export default function Admin() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.isAdmin) {
      return;
    }
    fetchData();
  }, [activeTab, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await adminAPI.getDashboard();
        setDashboard(res.data);
      } else if (activeTab === 'users') {
        const res = await adminAPI.getAllUsers();
        setUsers(res.data);
      } else if (activeTab === 'posts') {
        const res = await adminAPI.getAllPosts();
        setPosts(res.data);
      } else if (activeTab === 'reports') {
        const res = await adminAPI.getAllReports();
        setReports(res.data);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure?')) {
      try {
        await adminAPI.deleteUser(userId);
        fetchData();
      } catch (error) {
        console.log('Error deleting user:', error);
      }
    }
  };

  const handleBanUser = async (userId, isBanned) => {
    try {
      if (isBanned) {
        await adminAPI.unbanUser(userId);
      } else {
        await adminAPI.banUser(userId);
      }
      fetchData();
    } catch (error) {
      console.log('Error banning user:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (confirm('Are you sure?')) {
      try {
        await adminAPI.deletePostAdmin(postId);
        fetchData();
      } catch (error) {
        console.log('Error deleting post:', error);
      }
    }
  };

  const handleReportAction = async (reportId) => {
    const action = prompt('Enter action (warn/ban/delete):');
    if (action) {
      try {
        await adminAPI.updateReportStatus(reportId, {
          status: 'action_taken',
          action
        });
        fetchData();
      } catch (error) {
        console.log('Error updating report:', error);
      }
    }
  };

  if (!user?.isAdmin) {
    return <div className="admin-error">Access denied. Admin only.</div>;
  }

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      
      <div className="admin-tabs">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'posts' ? 'active' : ''}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button
          className={activeTab === 'reports' ? 'active' : ''}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="admin-content">
          {activeTab === 'dashboard' && dashboard && (
            <div className="dashboard-stats">
              <div className="stat-card">
                <h4>Total Users</h4>
                <p className="stat-number">{dashboard.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h4>Total Posts</h4>
                <p className="stat-number">{dashboard.totalPosts}</p>
              </div>
              <div className="stat-card">
                <h4>Reported Issues</h4>
                <p className="stat-number">{dashboard.totalReports}</p>
              </div>
              <div className="stat-card">
                <h4>Banned Users</h4>
                <p className="stat-number">{dashboard.bannedUsers}</p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(userItem => (
                  <tr key={userItem._id}>
                    <td>{userItem.username}</td>
                    <td>{userItem.email}</td>
                    <td>{userItem.isBanned ? 'Banned' : 'Active'}</td>
                    <td>
                      <button onClick={() => handleBanUser(userItem._id, userItem.isBanned)}>
                        {userItem.isBanned ? 'Unban' : 'Ban'}
                      </button>
                      <button onClick={() => handleDeleteUser(userItem._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'posts' && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Content</th>
                  <th>Reported</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post._id}>
                    <td>{post.author?.username}</td>
                    <td>{post.content?.substring(0, 50)}...</td>
                    <td>{post.isReported ? 'Yes' : 'No'}</td>
                    <td>
                      <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'reports' && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reported By</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report._id}>
                    <td>{report.reportedBy?.username}</td>
                    <td>{report.reason}</td>
                    <td>{report.status}</td>
                    <td>
                      <button onClick={() => handleReportAction(report._id)}>Take Action</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
