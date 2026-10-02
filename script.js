/* =========================================
   NOVAOS
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const welcomeScreen = document.getElementById("welcomeScreen");
const desktop = document.getElementById("desktop");
const desktopArea = document.getElementById("desktopArea");

const startButton = document.getElementById("startButton");

const clock = document.getElementById("clock");
const activeAppName = document.getElementById("activeAppName");

const menuButton = document.getElementById("menuButton");
const startMenu = document.getElementById("startMenu");

const restartButton = document.getElementById("restartButton");
const shutdownButton = document.getElementById("shutdownButton");

const shutdownScreen = document.getElementById("shutdownScreen");
const shutdownTitle = document.getElementById("shutdownTitle");
const shutdownMessage = document.getElementById("shutdownMessage");
const restartFromShutdown =
    document.getElementById("restartFromShutdown");


/* =========================================
   APPLICATION DATA
========================================= */

const appData = {

    files: {
        title: "Files",
        icon: "📁"
    },

    notes: {
        title: "Notes",
        icon: "📝"
    },

    settings: {
        title: "Settings",
        icon: "⚙️"
    },

    about: {
        title: "About NovaOS",
        icon: "💻"
    }

};


/* =========================================
   WINDOW SYSTEM
========================================= */

let highestZIndex = 100;

let windowCount = 0;


/* =========================================
   FILE SYSTEM
========================================= */

const fileSystem = {

    Home: {

        type: "folder",

        children: {

            Projects: {

                type: "folder",

                children: {

                    "index.html": {
                        type: "file",
                        icon: "🌐"
                    },

                    "style.css": {
                        type: "file",
                        icon: "🎨"
                    },

                    "script.js": {
                        type: "file",
                        icon: "⚡"
                    }

                }

            },

            Pictures: {

                type: "folder",

                children: {

                    "nova-wallpaper.png": {
                        type: "file",
                        icon: "🖼️"
                    },

                    "design.svg": {
                        type: "file",
                        icon: "🎨"
                    }

                }

            },

            Music: {

                type: "folder",

                children: {

                    "welcome.mp3": {
                        type: "file",
                        icon: "🎵"
                    },

                    "theme.wav": {
                        type: "file",
                        icon: "🎵"
                    }

                }

            },

            Documents: {

                type: "folder",

                children: {

                    "README.txt": {
                        type: "file",
                        icon: "📄"
                    },

                    "devlog.txt": {
                        type: "file",
                        icon: "📄"
                    }

                }

            }

        }

    }

};


/* Current location inside Files */

let currentFilePath = ["Home"];


/* =========================================
   START NOVAOS
========================================= */

startButton.addEventListener("click", () => {

    welcomeScreen.classList.add("hidden");

    desktop.classList.remove("hidden");

    updateClock();

});


/* =========================================
   CLOCK
========================================= */

function updateClock() {

    const now = new Date();

    let hours = now.getHours();

    let minutes = now.getMinutes();

    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    if (hours === 0) {
        hours = 12;
    }

    minutes = String(minutes).padStart(2, "0");

    clock.textContent =
        `${hours}:${minutes} ${period}`;

}


/* Update every second */

setInterval(updateClock, 1000);


/* =========================================
   START MENU
========================================= */

menuButton.addEventListener("click", (event) => {

    event.stopPropagation();

    startMenu.classList.toggle("hidden");

});


document.addEventListener("click", (event) => {

    if (
        !startMenu.contains(event.target) &&
        event.target !== menuButton
    ) {

        startMenu.classList.add("hidden");

    }

});


/* =========================================
   OPEN APP BUTTONS
========================================= */

document.addEventListener("click", (event) => {

    const button =
        event.target.closest("[data-open-app]");

    if (!button) {
        return;
    }

    const app =
        button.dataset.openApp;

    openApp(app);

    startMenu.classList.add("hidden");

});


/* =========================================
   OPEN APPLICATION
========================================= */

function openApp(appName) {

    const existingWindow =
        document.querySelector(
            `.os-window[data-app="${appName}"]`
        );

    if (existingWindow) {

        existingWindow.classList.remove("hidden");

        focusWindow(existingWindow);

        return;
    }


    if (!appData[appName]) {
        return;
    }


    const windowElement =
        createWindow(appName);

    desktopArea.appendChild(windowElement);

    positionWindow(windowElement);

    focusWindow(windowElement);

    if (appName === "notes") {

        initializeNotes(windowElement);

    }

    if (appName === "files") {

        initializeFiles(windowElement);

    }

}


/* =========================================
   CREATE WINDOW
========================================= */

function createWindow(appName) {

    windowCount++;

    const app = appData[appName];

    const windowElement =
        document.createElement("div");

    windowElement.className = "os-window";

    windowElement.dataset.app = appName;

    windowElement.dataset.windowId =
        windowCount;


    windowElement.innerHTML = `

        <div class="window-header">

            <div class="window-title">

                <span>${app.icon}</span>

                <span>${app.title}</span>

            </div>

            <div class="window-controls">

                <button
                    class="window-control minimize"
                    title="Minimize">
                    −
                </button>

                <button
                    class="window-control close"
                    title="Close">
                    ×
                </button>

            </div>

        </div>

        <div class="window-content">

            ${getAppHTML(appName)}

        </div>

    `;


    /* Window focus */

    windowElement.addEventListener(
        "mousedown",
        () => focusWindow(windowElement)
    );


    /* Close button */

    const closeButton =
        windowElement.querySelector(".close");

    closeButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            windowElement.remove();

            updateActiveApp();

        }
    );


    /* Minimize button */

    const minimizeButton =
        windowElement.querySelector(".minimize");

    minimizeButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            windowElement.classList.add("hidden");

            updateActiveApp();

        }
    );


    /* Make window draggable */

    makeDraggable(windowElement);


    return windowElement;

}


/* =========================================
   APP HTML
========================================= */

function getAppHTML(appName) {


    /* FILES */

    if (appName === "files") {

        return `

            <div class="file-toolbar">

                <button
                    class="file-back">
                    ← Back
                </button>

                <button
                    class="file-home">
                    Home
                </button>

                <button
                    class="file-refresh">
                    ↻ Refresh
                </button>

            </div>

            <div
                class="file-path"
                id="filePath">
            </div>

            <div
                class="file-grid"
                id="fileGrid">
            </div>

        `;

    }


    /* NOTES */

    if (appName === "notes") {

        return `

            <div class="notes-wrapper">

                <div class="notes-toolbar">

                    <span id="notesStatus">
                        Auto-save enabled
                    </span>

                    <div class="notes-actions">

                        <button
                            class="clear-notes">
                            Clear
                        </button>

                    </div>

                </div>

                <textarea
                    id="notesArea"
                    placeholder="Start writing your notes here...">
                </textarea>

                <div
                    class="notes-toolbar">

                    <span id="characterCount">
                        0 characters
                    </span>

                    <span>
                        Saved locally
                    </span>

                </div>

            </div>

        `;

    }


    /* SETTINGS */

    if (appName === "settings") {

        return `

            <div class="app-padding">

                <h2 class="app-heading">
                    Settings
                </h2>

                <p class="app-subheading">
                    Customize your NovaOS experience.
                </p>


                <section class="settings-section">

                    <h3>
                        Appearance
                    </h3>

                    <div class="theme-grid">

                        <button
                            class="theme-button"
                            data-theme="purple">
                            Purple
                        </button>

                        <button
                            class="theme-button"
                            data-theme="ocean">
                            Ocean
                        </button>

                        <button
                            class="theme-button"
                            data-theme="emerald">
                            Emerald
                        </button>

                    </div>

                </section>


                <section class="settings-section">

                    <h3>
                        System Information
                    </h3>

                    <div class="info-row">

                        <span>Operating System</span>

                        <span>NovaOS</span>

                    </div>

                    <div class="info-row">

                        <span>Version</span>

                        <span>1.0</span>

                    </div>

                    <div class="info-row">

                        <span>Platform</span>

                        <span>Web Browser</span>

                    </div>

                    <div class="info-row">

                        <span>Storage</span>

                        <span>Local Browser Storage</span>

                    </div>

                </section>

            </div>

        `;

    }


    /* ABOUT */

    if (appName === "about") {

        return `

            <div class="app-padding">

                <div class="about-logo">
                    ✦
                </div>

                <h2 class="app-heading">
                    NovaOS
                </h2>

                <p class="app-subheading">

                    NovaOS is a browser-based operating
                    system created as a WebOS project.

                    It demonstrates windows, applications,
                    desktop navigation, persistent notes,
                    file browsing and themes.

                </p>

                <div class="card-grid">

                    <div class="app-card">

                        <div class="app-card-icon">
                            🪟
                        </div>

                        <h3>
                            Window System
                        </h3>

                        <p>
                            Open, close, minimize and
                            drag multiple windows.
                        </p>

                    </div>


                    <div class="app-card">

                        <div class="app-card-icon">
                            💾
                        </div>

                        <h3>
                            Local Storage
                        </h3>

                        <p>
                            Notes and settings remain
                            saved in your browser.
                        </p>

                    </div>


                    <div class="app-card">

                        <div class="app-card-icon">
                            🎨
                        </div>

                        <h3>
                            Themes
                        </h3>

                        <p>
                            Choose between multiple
                            NovaOS color themes.
                        </p>

                    </div>

                </div>

                <span class="about-version">
                    NovaOS 1.0
                </span>

            </div>

        `;

    }


    return `
        <div class="app-padding">
            <h2>Application</h2>
        </div>
    `;

}


/* =========================================
   WINDOW POSITIONING
========================================= */

function positionWindow(windowElement) {

    const offset =
        (windowCount % 5) * 25;

    const desktopWidth =
        desktopArea.clientWidth;

    const desktopHeight =
        desktopArea.clientHeight;


    let left =
        Math.max(
            100,
            (desktopWidth - 620) / 2 + offset
        );


    let top =
        Math.max(
            30,
            (desktopHeight - 430) / 2 + offset
        );


    /* Keep window inside desktop */

    left =
        Math.min(
            left,
            desktopWidth - 650
        );

    top =
        Math.min(
            top,
            desktopHeight - 470
        );


    windowElement.style.left =
        `${Math.max(15, left)}px`;

    windowElement.style.top =
        `${Math.max(20, top)}px`;

}


/* =========================================
   FOCUS WINDOW
========================================= */

function focusWindow(windowElement) {

    highestZIndex++;

    windowElement.style.zIndex =
        highestZIndex;


    document
        .querySelectorAll(".os-window")
        .forEach(window => {

            window.classList.remove("active");

        });


    windowElement.classList.add("active");

    updateActiveApp();

}


/* =========================================
   ACTIVE APP
========================================= */

function updateActiveApp() {

    const windows =
        Array.from(
            document.querySelectorAll(
                ".os-window:not(.hidden)"
            )
        );


    if (windows.length === 0) {

        activeAppName.textContent =
            "Desktop";

        return;
    }


    windows.sort(
        (a, b) =>
            Number(b.style.zIndex || 0) -
            Number(a.style.zIndex || 0)
    );


    const active =
        windows[0];

    const appName =
        active.dataset.app;


    activeAppName.textContent =
        appData[appName]
            ? appData[appName].title
            : "Desktop";

}


/* =========================================
   DRAGGABLE WINDOWS
========================================= */

function makeDraggable(windowElement) {

    const header =
        windowElement.querySelector(
            ".window-header"
        );


    let dragging = false;

    let startX = 0;
    let startY = 0;

    let initialLeft = 0;
    let initialTop = 0;


    header.addEventListener(
        "mousedown",
        (event) => {

            if (
                event.target.closest(
                    ".window-controls"
                )
            ) {
                return;
            }


            dragging = true;

            focusWindow(windowElement);


            startX = event.clientX;

            startY = event.clientY;


            initialLeft =
                windowElement.offsetLeft;

            initialTop =
                windowElement.offsetTop;


            event.preventDefault();

        }
    );


    document.addEventListener(
        "mousemove",
        (event) => {

            if (!dragging) {
                return;
            }


            const deltaX =
                event.clientX - startX;

            const deltaY =
                event.clientY - startY;


            let newLeft =
                initialLeft + deltaX;

            let newTop =
                initialTop + deltaY;


            const maxLeft =
                desktopArea.clientWidth -
                windowElement.offsetWidth;


            const maxTop =
                desktopArea.clientHeight -
                windowElement.offsetHeight;


            newLeft =
                Math.max(
                    0,
                    Math.min(
                        newLeft,
                        maxLeft
                    )
                );


            newTop =
                Math.max(
                    0,
                    Math.min(
                        newTop,
                        maxTop
                    )
                );


            windowElement.style.left =
                `${newLeft}px`;

            windowElement.style.top =
                `${newTop}px`;

        }
    );


    document.addEventListener(
        "mouseup",
        () => {

            dragging = false;

        }
    );

}


/* =========================================
   NOTES APP
========================================= */

function initializeNotes(windowElement) {

    const notesArea =
        windowElement.querySelector(
            "#notesArea"
        );

    const clearButton =
        windowElement.querySelector(
            ".clear-notes"
        );

    const characterCount =
        windowElement.querySelector(
            "#characterCount"
        );

    const notesStatus =
        windowElement.querySelector(
            "#notesStatus"
        );


    /* Load saved notes */

    const savedNotes =
        localStorage.getItem(
            "novaOSNotes"
        );


    if (savedNotes !== null) {

        notesArea.value =
            savedNotes;

    }


    updateCharacterCount();


    /* Save while typing */

    notesArea.addEventListener(
        "input",
        () => {

            localStorage.setItem(
                "novaOSNotes",
                notesArea.value
            );

            updateCharacterCount();

            notesStatus.textContent =
                "Saved automatically";

            setTimeout(
                () => {

                    notesStatus.textContent =
                        "Auto-save enabled";

                },
                1000
            );

        }
    );


    /* Clear notes */

    clearButton.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Clear all saved notes?"
                );


            if (!confirmed) {
                return;
            }


            notesArea.value = "";

            localStorage.removeItem(
                "novaOSNotes"
            );


            updateCharacterCount();


            notesStatus.textContent =
                "Notes cleared";

        }
    );


    function updateCharacterCount() {

        const count =
            notesArea.value.length;


        characterCount.textContent =
            `${count} ${
                count === 1
                    ? "character"
                    : "characters"
            }`;

    }

}


/* =========================================
   FILE EXPLORER
========================================= */

function initializeFiles(windowElement) {

    const backButton =
        windowElement.querySelector(
            ".file-back"
        );

    const homeButton =
        windowElement.querySelector(
            ".file-home"
        );

    const refreshButton =
        windowElement.querySelector(
            ".file-refresh"
        );


    backButton.addEventListener(
        "click",
        () => {

            if (
                currentFilePath.length <= 1
            ) {
                return;
            }


            currentFilePath.pop();

            renderFiles(windowElement);

        }
    );


    homeButton.addEventListener(
        "click",
        () => {

            currentFilePath =
                ["Home"];

            renderFiles(windowElement);

        }
    );


    refreshButton.addEventListener(
        "click",
        () => {

            renderFiles(windowElement);

        }
    );


    renderFiles(windowElement);

}


/* =========================================
   GET CURRENT FILE SYSTEM FOLDER
========================================= */

function getCurrentFolder() {

    let current =
        fileSystem;


    for (
        const folderName of currentFilePath
    ) {

        current =
            current[folderName]
                ? current[folderName].children
                : current;

    }


    return current;

}


/* =========================================
   RENDER FILES
========================================= */

function renderFiles(windowElement) {

    const fileGrid =
        windowElement.querySelector(
            "#fileGrid"
        );

    const filePath =
        windowElement.querySelector(
            "#filePath"
        );


    const currentFolder =
        getCurrentFolder();


    fileGrid.innerHTML = "";


    filePath.textContent =
        "Home / " +
        currentFilePath
            .slice(1)
            .join(" / ");


    Object.entries(
        currentFolder
    ).forEach(
        ([name, item]) => {

            const button =
                document.createElement("button");


            button.className =
                "file-item";


            const icon =
                item.type === "folder"
                    ? "📁"
                    : (item.icon || "📄");


            button.innerHTML = `

                <div class="file-icon">
                    ${icon}
                </div>

                <div class="file-name">
                    ${name}
                </div>

            `;


            button.addEventListener(
                "dblclick",
                () => {

                    if (
                        item.type === "folder"
                    ) {

                        currentFilePath.push(
                            name
                        );

                        renderFiles(
                            windowElement
                        );

                    } else {

                        alert(
                            `${name}\n\nThis is a demo file in NovaOS.`
                        );

                    }

                }
            );


            fileGrid.appendChild(
                button
            );

        }
    );

}


/* =========================================
   SETTINGS
========================================= */

document.addEventListener(
    "click",
    (event) => {

        const themeButton =
            event.target.closest(
                ".theme-button"
            );


        if (!themeButton) {
            return;
        }


        const theme =
            themeButton.dataset.theme;


        applyTheme(theme);

    }
);


/* =========================================
   APPLY THEME
========================================= */

function applyTheme(theme) {

    const root =
        document.documentElement;


    if (theme === "ocean") {

        root.style.setProperty(
            "--accent",
            "#3b82f6"
        );

        root.style.setProperty(
            "--accent-dark",
            "#1d4ed8"
        );

    }


    else if (theme === "emerald") {

        root.style.setProperty(
            "--accent",
            "#10b981"
        );

        root.style.setProperty(
            "--accent-dark",
            "#047857"
        );

    }


    else {

        root.style.setProperty(
            "--accent",
            "#8b5cf6"
        );

        root.style.setProperty(
            "--accent-dark",
            "#6d28d9"
        );

    }


    localStorage.setItem(
        "novaOSTheme",
        theme
    );


    updateThemeButtons();

}


/* =========================================
   UPDATE THEME BUTTONS
========================================= */

function updateThemeButtons() {

    const currentTheme =
        localStorage.getItem(
            "novaOSTheme"
        ) || "purple";


    document
        .querySelectorAll(".theme-button")
        .forEach(button => {

            button.classList.toggle(
                "selected",
                button.dataset.theme === currentTheme
            );

        });

}


/* =========================================
   LOAD SAVED THEME
========================================= */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "novaOSTheme"
        ) || "purple";


    applyTheme(savedTheme);

}


/* Load theme immediately */

loadTheme();


/* =========================================
   RESTART
========================================= */

restartButton.addEventListener(
    "click",
    restartNovaOS
);


restartFromShutdown.addEventListener(
    "click",
    restartNovaOS
);


function restartNovaOS() {

    shutdownScreen.classList.add(
        "hidden"
    );

    welcomeScreen.classList.remove(
        "hidden"
    );

    desktop.classList.add(
        "hidden"
    );


    document
        .querySelectorAll(".os-window")
        .forEach(window => {

            window.remove();

        });


    startMenu.classList.add(
        "hidden"
    );


    shutdownTitle.textContent =
        "NovaOS is shutting down";


    shutdownMessage.textContent =
        "Thanks for using NovaOS.";

}


/* =========================================
   SHUTDOWN
========================================= */

shutdownButton.addEventListener(
    "click",
    () => {

        shutdownTitle.textContent =
            "NovaOS is shutting down";


        shutdownMessage.textContent =
            "Your session has ended. You can restart NovaOS whenever you want.";


        restartFromShutdown.textContent =
            "Restart NovaOS";


        shutdownScreen.classList.remove(
            "hidden"
        );

    }
);


/* =========================================
   KEYBOARD SHORTCUTS
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        /* Escape closes Start Menu */

        if (event.key === "Escape") {

            startMenu.classList.add(
                "hidden"
            );

        }


        /* Ctrl + Alt + N opens Notes */

        if (
            event.ctrlKey &&
            event.altKey &&
            event.key.toLowerCase() === "n"
        ) {

            event.preventDefault();

            openApp("notes");

        }


        /* Ctrl + Alt + F opens Files */

        if (
            event.ctrlKey &&
            event.altKey &&
            event.key.toLowerCase() === "f"
        ) {

            event.preventDefault();

            openApp("files");

        }

    }
);


/* =========================================
   WINDOW DOUBLE CLICK
========================================= */

document.addEventListener(
    "dblclick",
    (event) => {

        const desktopIcon =
            event.target.closest(
                ".desktop-icon"
            );


        if (!desktopIcon) {
            return;
        }


        const app =
            desktopIcon.dataset.openApp;


        if (app) {
            openApp(app);
        }

    }
);


/* =========================================
   INITIAL CLOCK
========================================= */

updateClock();