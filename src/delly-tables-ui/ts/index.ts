// This file will be used to set css styles of buttons, get elements, etc.
import { CanvasController } from './Features/Canvas/CanvasController';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Get the correct URL based on the hostname 
function getBaseURL(): string {
    const hostname: string = window.location.hostname;
    // If running locally, use localhost URL and port.
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5173/delly-tables/';
    }
    else if (hostname === 'joshdellamuth.github.io') {
        return 'https://joshdellamuth.github.io/delly-tables/';
    }
    else {
        const error = new Error('Unknown hostname: ' + hostname);
        alert("Error: " + error.message);
        throw error;
    }
}

let baseURL: string = getBaseURL();
console.log(`The base URL is ${baseURL}.`);


// #region Collapse button logic

const collapseButton: HTMLElement | null = document.getElementById("collapse-button");
const uncollapseButton: HTMLElement | null = document.getElementById("uncollapse-button");
const adminPageButton: HTMLElement | null = document.getElementById("admin-page");

function goToAdmin() {
    window.location.href = "admin.html"; // full redirect
}

const fileButton: HTMLElement | null = document.getElementById("file-button");
const exportButton: HTMLElement | null = document.getElementById("export-button");
const helpButton: HTMLElement | null = document.getElementById("help-button");
const logoText: HTMLElement | null = document.getElementById("logo-text");
const logoImage: HTMLElement | null = document.getElementById("logo-image");
const myObjectButton: HTMLElement | null = document.getElementById("my-objects-button");
const myObjectsPanel: HTMLElement | null = document.getElementById("my-objects-panel");

const shapesButton = getButtonById('shapes-button');
const textButton = getButtonById('text-button');
const annotateButton = getButtonById('annotate-button');
const colorPickerButton = getInputById('colorPicker');

// Initially set to uncollapsed
let topMenuCollapsed: boolean = true;
let myObjectsPanelCollapsed: boolean = true;

// initially toggle the menu
updateMenuVisibility(topMenuCollapsed);

adminPageButton?.addEventListener("click", () => {
    goToAdmin();
});

uncollapseButton?.addEventListener("click", () => {
    showCollapsedMenu();
});

collapseButton?.addEventListener("click", () => {
    showUncollapsedMenu();
});

// Initially set the sidebar to open or not
toggleMyObjectsPanel();

myObjectButton?.addEventListener("click", () => {
    myObjectsPanelCollapsed = !myObjectsPanelCollapsed;
    toggleMyObjectsPanel();
});


function updateMenuVisibility(collapsed: boolean): void {
    if (collapsed) {
        showCollapsedMenu();
    }
    else {
        showUncollapsedMenu();
    }
}

function showUncollapsedMenu(): void {
    uncollapseButton?.classList.remove("invisible");
    collapseButton?.classList.add("invisible");

    // Hide the file, export, and help buttons
    fileButton?.classList.add("invisible");
    exportButton?.classList.add("invisible");
    helpButton?.classList.add("invisible");
    logoText?.classList.add("invisible");
    logoImage?.classList.remove("invisible");

    topMenuCollapsed = false;
}

function showCollapsedMenu(): void {
    collapseButton?.classList.remove("invisible");
    uncollapseButton?.classList.add("invisible");

    fileButton?.classList.remove("invisible");
    exportButton?.classList.remove("invisible");
    helpButton?.classList.remove("invisible");
    logoText?.classList.remove("invisible");
    logoImage?.classList.add("invisible");

    topMenuCollapsed = true;
}

function toggleMyObjectsPanel(): void {
    if (myObjectsPanelCollapsed) {
        myObjectsPanel?.classList.add("hidden");
    }
    else {
        myObjectsPanel?.classList.remove("hidden");
    }
}

// #endregion Collapse button logic

// calculate the width and height of the screen
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

// create the canvas
const infiniteCanvas: CanvasController = new CanvasController('canvas', canvasWidth, canvasHeight);

// make the canvas size the same as the window
window.addEventListener('resize', () => {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    infiniteCanvas.updateSize(canvasWidth, canvasHeight);
});


function getButtonById(id: string): HTMLButtonElement {
    const button = document.getElementById(id);
    if (!button || !(button instanceof HTMLButtonElement)) {
        throw new Error(`Button element with ID "${id}" not found`);
    }
    return button;
}

function getInputById(id: string): HTMLInputElement {
    const input = document.getElementById(id);
    if (!input || !(input instanceof HTMLInputElement)) {
        throw new Error(`Input element with ID "${id}" not found`);
    }
    return input;
}