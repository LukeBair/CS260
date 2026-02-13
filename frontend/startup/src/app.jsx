import React from 'react';
import { BrowserRouter, NavLink, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { Login } from './login/login';
import { Everything } from './everything/everything';
import { Story } from './everything/story';
import { Characters } from './everything/characters';
import { Locations } from './everything/locations';
import { Props } from './everything/props';
import { History } from './everything/history';
import { Account } from './account/account';
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<SidebarLayout />}>
          <Route path="/everything" element={<Everything />}>
            <Route index element={<Navigate to="story" replace />} />
            <Route path="story" element={<Story />} />
            <Route path="characters" element={<Characters />} />
            <Route path="locations" element={<Locations />} />
            <Route path="props" element={<Props />} />
            <Route path="history" element={<History />} />
          </Route>
          <Route path="/account" element={<Account />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
