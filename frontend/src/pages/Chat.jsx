import React, { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import { UserContext } from '../components/UserContext';
import { getActiveChats, getMessages, sendMessage } from '../services/ChatService';
import { formatDistanceToNow } from 'date-fns';
import './styles/Chat.css';

const Chat = () => {
  const { user } = useContext(UserContext);
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [error, setError] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchActiveChats();
    const interval = setInterval(fetchActiveChats, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // Refresh messages every 3 seconds
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchActiveChats = async () => {
    try {
      const chats = await getActiveChats();
      setActiveChats(chats);
      setLoading(false);
    } catch (error) {
      setError('Failed to load chats');
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const msgs = await getMessages(selectedChat._id);
      setMessages(msgs);
    } catch (error) {
      setError('Failed to load messages');
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setError(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    try {
      await sendMessage(selectedChat._id, newMessage);
      setNewMessage('');
      fetchMessages(); // Refresh messages after sending
    } catch (error) {
      setError('Failed to send message');
    }
  };

  if (loading) {
    return <div className="chat-loading">Loading chats...</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>Messages</h2>
          <span className="chat-count">{activeChats.length} conversations</span>
        </div>
        <div className="chat-list">
          {activeChats.map((chat) => (
            <div
              key={chat._id}
              className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
              onClick={() => handleChatSelect(chat)}
            >
              <div className="chat-item-avatar">
                {chat.sellerName.charAt(0).toUpperCase()}
              </div>
              <div className="chat-item-content">
                <div className="chat-item-header">
                  <h3>{chat.sellerName}</h3>
                  <span className="chat-time">
                    {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="chat-last-message">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <div className="chat-header-user">
                <div className="chat-header-avatar">
                  {selectedChat.sellerName.charAt(0).toUpperCase()}
                </div>
                <div className="chat-header-info">
                  <h3>{selectedChat.sellerName}</h3>
                  <span className="chat-status online">Online</span>
                </div>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.sender === user._id ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <p>{message.text}</p>
                    <span className="message-time">
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <i className="fas fa-comments"></i>
            <h2>Select a conversation to start chatting</h2>
          </div>
        )}
      </div>

      {error && <div className="chat-error">{error}</div>}
    </div>
  );
};

export default Chat;