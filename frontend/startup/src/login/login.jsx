import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import {dummyCreate, dummyLogin} from "../backend/bankendDummy";

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(true);

  function handleLogin() {
    // TODO: replace with real fetch() call to backend
    setTimeout(() => {
      if (loggingIn && dummyLogin(username, password)) {
        navigate('/everything');
      } else if (!loggingIn && dummyCreate(username, password)) {
        navigate('/everything');
      } else {
        alert('Invalid username or password');
      }
    }, 500);
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
                <input type="text" id="username" name="username" required onChange={(e)=> setUsername(e.target.value)}/>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required onChange={(e)=>setPassword(e.target.value)}/>
                <a onClick={() => {setLoggingIn(!loggingIn)}}>Create Account</a>
              </div>
              <button type="button" onClick={handleLogin}>{loggingIn ? 'Login' : 'Create Account'}</button>
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
