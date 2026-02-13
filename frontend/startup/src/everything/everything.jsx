import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './everything.css';

// TODO Phase 2: Convert to React state and effects
// - Use useState for: currentSection, selectedEntry, entries list
// - Use useSearchParams to read/set ?section= query param
// - Render items-list dynamically from worldData[currentSection]
// - Toggle ai-suggestion-box visibility based on section === 'story'
// - Attribution bar toggle with useState
// - WebSocket connection for live user updates + ai input
// - Third party call to Gemini API

export function Everything() {
  const location = useLocation();
  const isStory = location.pathname.endsWith('/story') || location.pathname === '/everything';

  return (
    <main id="content">
      <div id="page-content">
        <div id="list-container">
          <div id="items-list">
            <Outlet />
          </div>
        </div>

        <label>
          <textarea id="chapter-input" readOnly defaultValue="Select an entry to view its description." />
        </label>

        <div id="ai-suggestion-box" className={isStory ? 'visible' : ''}>
          <p>ai input about discrepancy goes here. will highlight section its talking about.</p>
          <div>
            <a href="#">&gt; Source: Joe</a>
            <br /><br />
            <button className="resolve-button">Resolve</button>
          </div>
        </div>
      </div>

      <button id="attribution-button" title="Attributions">
        <img src="/information-button.png" alt="Info" className="sidebar-image" />
      </button>
      <div id="attribution-bar">
        <h3>Attributions</h3>
        <p>Icons sourced from Flaticon:</p>
        <ul>
          <li><a href="https://www.flaticon.com/free-icon/information-button_100293" target="_blank" rel="noreferrer">Information Button</a></li>
          <li><a href="https://www.flaticon.com/free-icon/chest_2721118" target="_blank" rel="noreferrer">Chest</a></li>
          <li><a href="https://www.flaticon.com/free-icon/hour-glass_520261" target="_blank" rel="noreferrer">Hour Glass</a></li>
          <li><a href="https://www.flaticon.com/free-icon/cogwheel-silhouette_23434" target="_blank" rel="noreferrer">Cogwheel</a></li>
          <li><a href="https://www.flaticon.com/free-icon/open-book_372179" target="_blank" rel="noreferrer">Open Book</a></li>
          <li><a href="https://www.flaticon.com/free-icon/pin_3136005" target="_blank" rel="noreferrer">Pin</a></li>
          <li><a href="https://www.flaticon.com/free-icon/user_747376" target="_blank" rel="noreferrer">User</a></li>
        </ul>
        <p>Fonts: Alegreya &amp; Merriweather from Google Fonts</p>
      </div>
    </main>
  );
}
