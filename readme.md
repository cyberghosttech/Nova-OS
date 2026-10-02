# ✦ NovaOS

NovaOS is a browser-based operating system created for the Hack Club WebOS 1 project.

It is designed to feel like a lightweight desktop operating system while running entirely inside a web browser.

## Features

- Welcome screen
- NovaOS desktop
- Live system clock
- Desktop application icons
- Bottom application dock
- Start menu
- Multiple application windows
- Draggable windows
- Minimize and close controls
- Window focus management
- File Explorer
- Folder navigation
- Notes application
- Automatic note saving with LocalStorage
- Character counter
- Settings application
- Multiple color themes
- Persistent theme settings
- About/System Information application
- Restart screen
- Shutdown screen
- Keyboard shortcuts
- Responsive design

## Applications

### Files

The Files application provides a simple simulated file system.

It contains:

- Projects
- Pictures
- Music
- Documents

Folders can be opened by double-clicking them.

### Notes

The Notes application provides a simple writing environment.

Notes are automatically saved using browser LocalStorage, meaning they remain available when the page is refreshed.

### Settings

The Settings application allows users to change the NovaOS accent theme.

Available themes:

- Purple
- Ocean
- Emerald

The selected theme is saved locally.

### About NovaOS

The About application explains the project and displays information about some of the features included in NovaOS.

## Extra Features

NovaOS includes several features beyond the basic WebOS requirements:

- Persistent notes
- Persistent themes
- File Explorer with folders
- Window focus management
- Start menu
- Application dock
- Restart and shutdown interface
- Keyboard shortcuts

Keyboard shortcuts:

- `Ctrl + Alt + N` opens Notes
- `Ctrl + Alt + F` opens Files
- `Escape` closes the Start Menu

## Technologies

NovaOS was built using:

- HTML
- CSS
- JavaScript
- Browser LocalStorage

No backend server is required.

## Project Structure

```text
NovaOS/
│
├── index.html
├── style.css
├── script.js
└── README.md