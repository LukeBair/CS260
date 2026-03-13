import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {naturalLanguageSearch, saveUserStoryData} from '../backend/backendCommunicator';
import './everything.css';

export function Everything({ entries, setEntries }) {
  const location = useLocation();
  const section = location.pathname.split('/').pop();
  const isStory = section === 'story' || location.pathname === '/everything';
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [attributionsVisible, setAttributionVisible] = useState(false);

  useEffect(() => {
    setSelectedIndex(0);
  }, [section]);

  // instead of getting the description directly I get the data and then the
  // description using an index. this probably will change when an actual
  // backend is implemented
  const description = selectedIndex !== null
    ? entries[section]?.[selectedIndex]?.desc ?? ''
    : 'Select an entry to view its description.';

  const chapterName = selectedIndex !== null
    ? entries[section]?.[selectedIndex]?.name ?? ''
    : 'default chapter name';

  function handleAddEntry() {
    setEntries(function(previous_state) {
      const updated = {
        ...previous_state,
        [section]: [...previous_state[section], { name: 'New Entry', desc: '' }]
      };
      saveUserStoryData(updated);
      return updated;
    });
  }

  function handleTitleChange(e) {
    const newTitle = e.target.value;

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
      saveUserStoryData(updated);
      return updated;
    });
  }

  function handleChapterRemove() {
    if (selectedIndex === null) return;

    setEntries(function(previous_state) {
      const updatedSection = previous_state[section].filter(function(entry, i) {
        return i !== selectedIndex;
      });

      const updated = {
        ...previous_state,
        [section]: updatedSection
      };
      saveUserStoryData(updated);
      return updated;
    });
    setSelectedIndex(null);
  }

  function handleDescriptionChange(e) {
    const newText = e.target.value;

    setEntries(function(previous_state) {
      // update only the selected entry's desc in the current section
      // basically just a for loop but fancy
      const updatedSection = previous_state[section].map(function(entry, i) {
        if (i === selectedIndex) {
          return { ...entry, desc: newText };
        }
        return entry;
      });

      // return all sections, overwriting just the current one
      const updated = {
        ...previous_state,
        [section]: updatedSection
      };
      saveUserStoryData(updated);
      return updated;
    });
  }

  function handlePossibleSearch(e) {
    if (e.key === 'Enter') {
      naturalLanguageSearch(e.target.value).then(r => {
        alert(`Search results for "${e.target.value}":\n\n${r}`);
      });
    }
  }

  return (
    <main id="content">
      <input id="search-bar" type="string" onKeyUp={handlePossibleSearch}></input>
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
