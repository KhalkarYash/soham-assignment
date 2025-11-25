import React, { useEffect, useState, useContext } from 'react';
import { messagesAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/Messages.css';

export default function Messages() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await messagesAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.log('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (otherId) => {
    setSelectedConversation(otherId);
    try {
      const response = await messagesAPI.getConversation(otherId);
      setMessages(response.data);
    } catch (error) {
      console.log('Error fetching conversation:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await messagesAPI.sendMessage({
        recipients: [selectedConversation],
        content: newMessage
      });
      setNewMessage('');
      handleSelectConversation(selectedConversation);
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  if (loading) return <div className="loading">Loading messages...</div>;

  return (
    <div className="messages-container">
      <div className="conversations-list">
        <h3>Messages</h3>
        {conversations.length === 0 ? (
          <p className="no-conversations">No conversations yet</p>
        ) : (
          conversations.map(conv => {
            const otherUser = conv.sender._id === user?.id ? conv.recipients[0] : conv.sender;
            return (
              <div
                key={otherUser._id}
                className={`conversation-item ${selectedConversation === otherUser._id ? 'active' : ''}`}
                onClick={() => handleSelectConversation(otherUser._id)}
              >
                <img src={otherUser.profilePic || 'https://via.placeholder.com/40'} alt={otherUser.username} />
                <div>
                  <p className="username">{otherUser.username}</p>
                  <small>{conv.content.substring(0, 30)}...</small>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="chat-window">
        {selectedConversation ? (
          <>
            <div className="messages-view">
              {messages.map(msg => (
                <div key={msg._id} className={`message ${msg.sender._id === user?.id ? 'sent' : 'received'}`}>
                  <div className="message-content">{msg.content}</div>
                  <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="message-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="no-chat">Select a conversation to start messaging</div>
        )}
      </div>
    </div>
  );
}
