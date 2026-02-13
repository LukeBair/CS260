import React from 'react';
import './everything.css';

// TODO Phase 2: Convert to React state and effects
//
// const worldData = {
//   story: [
//     { title: "Chapter 1: The Shattering", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In the beginning the world was one perfect sphere, held together by the songs of fourteen crystal gods. But pride cracked the harmony..." },
//     { title: "Chapter 2: The First Flame", content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. A single ember escaped the forge of creation..." },
//     { title: "Chapter 3: Age of the Veil", content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum. The sky tore open, and shadows learned to hunger..." }
//   ],
//   characters: [
//     { title: "Kaelith Veyne", content: "Once a high priestess of the Sunspire, now a wanderer cursed with eternal twilight in her eyes. She whispers to dying stars..." },
//     { title: "Rorik Ironvein", content: "Dwarven forgemaster whose hammer sings when it strikes true orichalcum. Gruff, loyal, secretly terrified of open water." },
//     { title: "Sylvara of the Mist", content: "Elven ranger who speaks to fog as if it were family. Few have seen her face and lived to describe it." }
//   ],
//   locations: [
//     { title: "Ashen Cradle", content: "A caldera city built inside the corpse of a dead volcano. Black glass streets reflect every torch like accusing eyes..." },
//     { title: "The Drowned Library", content: "Submerged archive beneath the Glass Sea. Mermaids guard tomes written in bioluminescent ink that burns the unworthy." },
//     { title: "Spire of Whispers", content: "Endless tower of white bone. Every floor repeats the same hallway — but the voices change with each ascent." }
//   ],
//   props: [
//     { title: "Crown of Eclipse", content: "Black iron circlet set with a single blood opal that drinks light. Wearer dreams only in negatives, waking hollow." },
//     { title: "Blade of Severance", content: "A sword whose edge is so fine it can cut the memory of its own existence from the mind of the wounded." },
//     { title: "Lantern of the Last", content: "Never needs oil. Shows only the last person who will ever look upon its light — often, it's you." }
//   ],
//   history: [
//     { title: "Year 0 – The Binding", content: "The gods chained the primordial chaos beneath fourteen obsidian seals. The seals still hum faintly..." },
//     { title: "Year 317 – The Red Sky", content: "For three days the sun bled. Crops withered. Children were born without pupils, seeing only truth." },
//     { title: "Year 1241 – The Unmaking", content: "A single word spoken in the wrong tongue unraveled three kingdoms overnight. Echoes linger in the wind." }
//   ]
// };
//
// - Use useState for: currentSection, selectedEntry, entries list
// - Use useSearchParams to read/set ?section= query param
// - Render items-list dynamically from worldData[currentSection]
// - Toggle ai-suggestion-box visibility based on section === 'story'
// - Attribution bar toggle with useState
// - WebSocket connection for live user updates + ai input
// - Third party call to Gemini API

export function Everything() {
  return (
    <main id="content">
      <div id="page-content">
        <div id="list-container">
          <div id="items-list">
            {/* item buttons will be rendered here in phase 2 */}
          </div>
        </div>

        <label>
          <textarea id="chapter-input" readOnly defaultValue="Select an entry to view its description." />
        </label>

        <div id="ai-suggestion-box">
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
