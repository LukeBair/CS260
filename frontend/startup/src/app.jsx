import React, { useState, useEffect } from 'react';
import { BrowserRouter, NavLink, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { Login } from './login/login';
import { Everything } from './everything/everything';
import { Account } from './account/account';
import {EntryList} from "./everything/EntryList";
import {loadUserStoryData, getCurrentUser} from "./backend/backendCommunicator";
import './app.css';

function SidebarLayout() {
  return (
    <>
      <nav id="sidebar">
        <h2>Mythril</h2>
        <NavLink to="/everything/story" className="nav-button">
          <img src="/open-book.png" alt="story icon" className="sidebar-image" />
          <span>Story</span>
        </NavLink>
        <NavLink to="/everything/characters" className="nav-button">
          <img src="/user.png" alt="characters icon" className="sidebar-image" />
          <span>Characters</span>
        </NavLink>
        <NavLink to="/everything/locations" className="nav-button">
          <img src="/pin.png" alt="locations icon" className="sidebar-image" />
          <span>Locations</span>
        </NavLink>
        <NavLink to="/everything/props" className="nav-button">
          <img src="/chest.png" alt="props icon" className="sidebar-image" />
          <span>Props</span>
        </NavLink>
        <NavLink to="/everything/history" className="nav-button">
          <img src="/hour-glass.png" alt="history icon" className="sidebar-image" />
          <span>History</span>
        </NavLink>
        <NavLink to="/account" className="nav-button account-button">
          <img src="/cog-wheel-silhouette.png" alt="account icon" className="sidebar-image" />
          <span>Account</span>
        </NavLink>
      </nav>
      <Outlet />
    </>
  );
}

function NotFound() {
  return <main className="container-fluid text-center">404: Return to sender. Address unknown.</main>;
}

export default function App() {
  const [entries, setEntries] = useState({ story: [], characters: [], locations: [], props: [], history: [] });

  useEffect(() => {
    loadUserStoryData().then(data => {
      if (data) setEntries(data);
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLogin={async () => {
          const data = await loadUserStoryData();
          if (data) setEntries(data);
        }} />} />
        <Route element={<SidebarLayout />}>
          <Route path="/everything" element={<Everything entries={entries} setEntries={setEntries} />}>
            <Route index element={<Navigate to="story" replace />} />
            <Route path="story" element={<EntryList entries={entries.story} />} />
            <Route path="characters" element={<EntryList entries={entries.characters} />} />
            <Route path="locations" element={<EntryList entries={entries.locations} />} />
            <Route path="props" element={<EntryList entries={entries.props} />} />
            <Route path="history" element={<EntryList entries={entries.history} />} />
          </Route>
          <Route path="/account" element={<Account />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
