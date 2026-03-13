import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './account.css';
import { getCurrentUser, logout, saveAccountChanges, getCollaborators, addCollaborator, removeCollaborator } from '../backend/backendCommunicator';

export function Account() {
  const navigate = useNavigate();

  const [username, setUsername] = useState(getCurrentUser() || '');
  const [email, setEmail] = useState('user@example.com');
  const [collaborators, setCollaborators] = useState([]);
  const [newCollab, setNewCollab] = useState('');
  const [collabError, setCollabError] = useState('');

  useEffect(() => {
    getCollaborators().then(setCollaborators);
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  async function handleAddCollab() {
    if (!newCollab.trim()) return;
    setCollabError('');
    try {
      const updated = await addCollaborator(newCollab.trim());
      setCollaborators(updated);
      setNewCollab('');
    } catch (err) {
      setCollabError(err.message);
    }
  }

  async function handleRemoveCollab(name) {
    const updated = await removeCollaborator(name);
    setCollaborators(updated);
  }

  function handleCollabKeyDown(e) {
    if (e.key === 'Enter') handleAddCollab();
  }

  return (
    <main id="main-content">
      <div id="account-page">
        <div id="account-section">
          <h2>Account Settings</h2>
          <p className="section-desc">Manage your account details and preferences.</p>
          <div id="account-form">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="primary-button" onClick={() => saveAccountChanges({ username, email })}>Save Changes</button>
          </div>
        </div>

        <div id="collab-section">
          <h2>Collaborators</h2>
          <p className="section-desc">Add other users to your world so they can view and edit.</p>
          <div id="collab-input-row">
            <input
              type="text"
              id="collab-input"
              placeholder="Enter username..."
              value={newCollab}
              onChange={(e) => setNewCollab(e.target.value)}
              onKeyDown={handleCollabKeyDown}
            />
            <button className="primary-button" onClick={handleAddCollab}>Add</button>
          </div>
          {collabError && <p className="collab-error">{collabError}</p>}
          <div id="collab-list">
            {collaborators.length === 0 && <p className="no-entries">No collaborators yet</p>}
            {collaborators.map((name) => (
              <div key={name} className="collab-item">
                <span>{name}</span>
                <button className="collab-remove" onClick={() => handleRemoveCollab(name)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button id="logout-button" onClick={handleLogout}>Logout</button>
    </main>
  );
}
