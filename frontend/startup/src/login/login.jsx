import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export function Login() {
  const navigate = useNavigate();

  function handleLogin() {
    navigate('/everything');
  }

  return (
    <div id="flex-body">
      <div className="container">
        <div className="header-column">
          <div className="header-thingy">
            <h1>Mythril</h1>
            <h3>Where stories are forged</h3>
          </div>
        </div>

        <div className="login-column">
          <div className="login-container">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
              </div>
              <button type="button" onClick={handleLogin}>Login</button>
            </form>
          </div>
        </div>

        <p className="top-right-link">
          <a href="https://github.com/LukeBair/CS260">https://github.com/LukeBair/CS260</a>
        </p>
      </div>
    </div>
  );
}
