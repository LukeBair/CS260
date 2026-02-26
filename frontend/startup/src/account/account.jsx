import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './account.css';

export function Account() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('current_username');
  const [email, setEmail] = useState('user@example.com');

  function logout() {
    navigate('/');
  }

  function saveChanges() {
    console.log('Saving:', { username, email });
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

        <button id="change-password-button">Change Password</button>
      </div>
      <button id="logout-button" onClick={logout}>Logout</button>
    </main>
  );
}
