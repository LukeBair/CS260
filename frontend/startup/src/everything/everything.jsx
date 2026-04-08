import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {queryAI, saveUserStoryData, fetchEditLog} from '../backend/backendCommunicator';
import {getEntryList} from '../backend/queryBuilder.jsx';
import './everything.css';

export function Everything({ entries, setEntries, recentEdits, setRecentEdits}) {
  const location = useLocation();
  const section = location.pathname.split('/').pop();
  const isStory = section === 'story' || location.pathname === '/everything';
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [attributionsVisible, setAttributionVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [panelTab, setPanelTab] = useState('edits');

  // Load edit log from server on mount
  useEffect(() => {
    fetchEditLog().then(edits => {
      setRecentEdits(edits.map(e => ({
        user: e.user,
        action: e.action,
        time: new Date(e.time).toLocaleTimeString(),
      })));
    });
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [section]);

  const description = selectedIndex !== null
    ? entries[section]?.[selectedIndex]?.desc ?? ''
    : 'Select an entry to view its description.';

  const chapterName = selectedIndex !== null
    ? entries[section]?.[selectedIndex]?.name ?? ''
    : 'default chapter name';

  function logEdit(action) {
    const time = new Date().toLocaleTimeString();
    setRecentEdits(prev => [{ action, time, user: 'You' }, ...prev].slice(0, 50));
  }

  function handleAddEntry() {
    const action = `Added entry in ${section}`;
    setEntries(function(previous_state) {
      const updated = {
        ...previous_state,
        [section]: [...previous_state[section], { name: 'New Entry', desc: '' }]
      };
      saveUserStoryData({ ...updated, _editAction: action });
      logEdit(action);
      return updated;
    });
  }

  function handleTitleChange(e) {
    const newTitle = e.target.value;
    const action = `Renamed entry to "${newTitle}" in ${section}`;

    setEntries(function(previous_state) {
      const updatedSection = previous_state[section].map(function(entry, i) {
        if (i === selectedIndex) {
          return { ...entry, name: newTitle };
        }
        return entry;
      });

      const updated = {
        ...previous_state,
        [section]: updatedSection
      };
      saveUserStoryData({ ...updated, _editAction: action });
      logEdit(action);
      return updated;
    });
  }

  function handleChapterRemove() {
    if (selectedIndex === null) return;
    const action = `Removed entry from ${section}`;

    setEntries(function(previous_state) {
      const updatedSection = previous_state[section].filter(function(entry, i) {
        return i !== selectedIndex;
      });

      const updated = {
        ...previous_state,
        [section]: updatedSection
      };
      saveUserStoryData({ ...updated, _editAction: action });
      logEdit(action);
      return updated;
    });
    setSelectedIndex(null);
  }

  function handleDescriptionChange(e) {
    const newText = e.target.value;
    const action = `Edited description in ${section}`;

    setEntries(function(previous_state) {
      const updatedSection = previous_state[section].map(function(entry, i) {
        if (i === selectedIndex) {
          return { ...entry, desc: newText };
        }
        return entry;
      });

      const updated = {
        ...previous_state,
        [section]: updatedSection
      };
      saveUserStoryData({ ...updated, _editAction: action });
      logEdit(action);
      return updated;
    });
  }

  function handleChatSend() {
    if (!chatInput.trim()) return;
    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');

    const context = `Page: ${section}\nSelected: ${chapterName}\nDescription: ${description}\n\nAvailable entries:${getEntryList(entries)}`;
    queryAI(userMessage, context, entries, chatHistory).then(r => {
      setChatHistory(prev => [...prev, { role: 'user', text: userMessage }, { role: 'ai', text: r }]);
      setChatMessages(prev => [...prev, { role: 'ai', text: r }]);
    }).catch(() => {
      setChatMessages(prev => [...prev, { role: 'ai', text: 'Search failed.' }]);
    });
  }

  function handleClearChat() {
    setChatMessages([]);
    setChatHistory([]);
  }

  function handleChatKeyDown(e) {
    if (e.key === 'Enter') handleChatSend();
  }

  return (
    <main id="content">
      <div id="page-content">
        <div id="list-container">
          <div id="items-list">
            <Outlet context={{ setSelectedIndex, addEntry: handleAddEntry }} />
          </div>
        </div>
        <div id="chapter-container">
          <div id="title-container">
            <input id="chapter-title" onChange={handleTitleChange} type="text" value={chapterName}/>
            <button id="remove-chapter" onClick={handleChapterRemove}>x</button>
          </div>
          <label>
            <textarea id="chapter-input" value={description} onChange={handleDescriptionChange}/>
          </label>
        </div>
        <div id="side-panel">
          <div id="panel-tabs">
            <button className={`panel-tab ${panelTab === 'edits' ? 'active' : ''}`} onClick={() => setPanelTab('edits')}>Recent Edits</button>
            <button className={`panel-tab ${panelTab === 'ai' ? 'active' : ''}`} onClick={() => setPanelTab('ai')}>AI Helper</button>
          </div>
          {panelTab === 'edits' ? (
            <div id="edits-list">
              {recentEdits.length === 0 && <p className="no-entries">No recent edits</p>}
              {recentEdits.map((edit, i) => (
                <div key={i} className="edit-item">
                  <span className="edit-user">{edit.user || 'You'}</span>
                  <span className="edit-action">{edit.action}</span>
                  <span className="edit-time">{edit.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <>
              <button id="chat-clear" onClick={handleClearChat}>New Chat</button>
              <div id="chat-messages">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`chat-msg chat-${msg.role}`}>{msg.text}</div>
                ))}
              </div>
              <div id="chat-input-container">
                <input
                  id="chat-input"
                  type="text"
                  placeholder="Ask AI..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleChatKeyDown}
                />
                <button id="chat-send" onClick={handleChatSend}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>

      <button id="attribution-button" title="Attributions" onClick={() => setAttributionVisible(!attributionsVisible)}>
        <img src="/information-button.png" alt="Info" className="sidebar-image" />
      </button>
      <div id="attribution-bar" className={attributionsVisible ? 'visible' : ''}>
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
