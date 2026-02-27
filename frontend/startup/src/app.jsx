import React from 'react';
import { BrowserRouter, NavLink, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { Login } from './login/login';
import { Everything } from './everything/everything';
import { Account } from './account/account';
import {EntryList} from "./everything/EntryList";
import {loadUserStoryData} from "./backend/bankendDummy";
import './app.css';

function SidebarLayout() {
  return <Outlet />;
}

function NotFound() {
  return <main className="container-fluid text-center">404: Return to sender. Address unknown.</main>;
}

export default function App() {
  const entries = loadUserStoryData();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<SidebarLayout />}>
          <Route path="/everything" element={<Everything />}>
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
