# CS 260 wip name

**Elevator Pitch**  

There are many websites that help people worldbuild, and write stories, however each have limited 
free tiers or no free tiers. I'm poor, so I have been writing in google docs which has some major limitations. 

This application will have better worldbuilding docs, which can be indexed and used while writing. For example, if you forget the name of a place, you will be able to do a inline search (like coding ides) to get it.

In addition AI will look for inconsistancies in character choices and behavior, and inconcisitancies in the story as well. It will not be writing anything for the story itself. The AI may be involved in the inline search, or be used for a natrual language search bar (unlikely).

## Key Features

- multiple projects
- worldbuilding docs (indexed)
- story (seperated by chapters in sidebar)
- automatic conversion to epub for viewing
- ai inconsistancy finder

## Technology Usage Specification

### HTML
creating the site, basic text/images without styling or layout

### CSS
Styling that will:
- create a modern feel
- create animations? (probably not)

### React
- Component-based architecture (Login, Project Page, Page, AI note, Profile, etc.)
- React Router for navigation between pages

### Web Service (Backend)
Node.js (Express?) server endpoints include:
- login/logout
- get-project-details
- get-page

### Integration with third-party API:  
Google Gemini api:
- look for inconsistancies in characters / story
- potentially create character roadmaps (could be hidden, used for ai prompting)
-- shows pivital character moments, stuff like that


### Database
PostgreSQL database to persistently store:
- User projects/pages
- User comments / AI editor suggestions
- User login information (if not using Auth0)

### WebSocket
Real-time communication using WebSockets for:
- Live updates from collaborators (?)
- Live feedback from AI editor 

## Design Mockups

### 1. Login / Register Screen
![login screen](images/login-page.png)

### 2. Project Page
![project page](images/project-page.png)

### 3. Basic Page Layout
![basic page](images/doc-page.png)

### 4. AI editor UI
![AI helper](images/ai-helper.png)


## Updates for HTML Dummy
basic html for buttons, input areas, and ai suggestion interfaces added. 
basic styling as well to better see the formatting of everything

**used ai to generate dummy data cause i dont wanna do all that**


## HTML deliverable

For this deliverable I built out the structure of my application using HTML.

 I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
 HTML pages - Two HTML pages that represent the ability to login and view project.
 Proper HTML element usage - I just used div elements for everything. (and a nav)
 Links - The login page automatically links to the story page. the story page can change to be characters, props, etc.
 Text - because there will be many dynamic elements, there are some example chapters, chapter text etc. _this was ai gen, cause it wasnt important to the html_
 3rd party API placeholder - Placeholder for calls to gemini.
 Images - one image in the login page, otherwise images will be added by users to the docs
 DB/Login - Input box and submit button for login. no user database currently demoed, instead story, character, etc data is demoed
 WebSocket - just a console log for now, will show realtime user interaction though

in the future:
- login flow
- actual styling
- gemini api integration
  - hidden docs for gemini integration, mcp?
- PlateJS replacement for textareas
  - md to epub conversions??

## CSS Deliverable
Visually Appealing Layout: 
- used a color picking site to pick complimenting colors that i felt fit the project
- used flexbox for layout
CSS framework:
- pure.css for text areas, shoulda use this sooner
All elements were styled with css
window responsiveness is likely limited, 
imported font: Alegreya from google fonts
used multiple class and id selectors. media 

things to work on in the future:
- mobile styling specifically for chapter/character/etc selection, this app doesnt work great on mobile, but 
navigating the page to see information should be a bit smoother.
- text area setup, when transfering to react, use a md text area equivalent.
- backend features