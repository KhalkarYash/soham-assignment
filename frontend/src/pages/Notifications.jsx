import React, { useEffect, useState, useContext } from 'react';
import { notificationsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/Notifications.css';

export default function Notifications() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.log('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.log('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'friendRequest': return '👋';
      case 'friendAccepted': return '✅';
      case 'message': return '💬';
      default: return '🔔';
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return `${notification.from?.username} liked your post`;
      case 'comment':
        return `${notification.from?.username} commented on your post`;
      case 'friendRequest':
        return `${notification.from?.username} sent you a friend request`;
      case 'friendAccepted':
        return `${notification.from?.username} accepted your friend request`;
      case 'message':
        return `${notification.from?.username} sent you a message`;
      default:
        return notification.message;
    }
  };

  if (loading) return <div className="loading">Loading notifications...</div>;

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <div className="no-notifications">No notifications yet</div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notif => (
            <div
              key={notif._id}
              className={`notification ${notif.isRead ? 'read' : 'unread'}`}
              onClick={() => handleMarkAsRead(notif._id)}
            >
              <span className="icon">{getNotificationIcon(notif.type)}</span>
              <div className="notification-content">
                <p>{getNotificationText(notif)}</p>
                <small>{new Date(notif.createdAt).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
