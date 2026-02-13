import React from 'react';
import { useNavigate } from 'react-router-dom';
import './account.css';

export function Account() {
  const navigate = useNavigate();

  function logout() {
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
        <input type="text" id="username" name="username" defaultValue="current_username" />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" defaultValue="user@example.com" />

        <button id="change-password-button">Change Password</button>
      </div>
      <button id="logout-button" onClick={logout}>Logout</button>
    </main>
  );
}
