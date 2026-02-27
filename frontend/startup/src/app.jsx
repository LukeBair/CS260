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
import {EntryList} from "./everything/EntryList";

function SidebarLayout() {
  return (
      <Route path="/everything" element={<Everything />}>
        <Route index element={<Navigate to="story" replace />} />
        <Route path="story" element={<EntryList entries={storyEntries} />} />
        <Route path="characters" element={<EntryList entries={characterEntries} />} />
        <Route path="locations" element={<EntryList entries={locationEntries} />} />
        <Route path="props" element={<EntryList entries={propEntries} />} />
        <Route path="history" element={<EntryList entries={historyEntries} />} />
      </Route>
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
