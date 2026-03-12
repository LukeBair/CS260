import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './account.css';
import {saveAccountChanges, logout, getCurrentUser} from "../backend/bankendDummy";

export function Account() {
  const navigate = useNavigate();

  const [username, setUsername] = useState(getCurrentUser() || '');
  const [email, setEmail] = useState('user@example.com');

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <main id="main-content">
      <div id="account-info-header">
        <h2>Account Settings</h2>
        <p>Manage your account details and preferences here.</p>
      </div>
      <div id="change-password-form">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button id="change-password-button" onClick={() => saveAccountChanges({ username, email })}>Save Changes</button>
      </div>
      <button id="logout-button" onClick={handleLogout}>Logout</button>
    </main>
  );
}
