import { Box } from './CoreObjects/Box.js';
import { CanvasObjects } from './CanvasObjects/CanvasObjects.js';
import { InfiniteCanvas } from './InfiniteCanvas/InfiniteCanvas.js';

// Get the correct URL based on the hostname 
function getBaseURL() : string {
    const hostname: string = window.location.hostname;
    // If running locally, use localhost URL and port.
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5500/src/delly-tables-ui/';
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

// #region Add shapes to canvas

// Represents the running list of canvas objects to be added to and deleted
const canvasObjects: CanvasObjects = new CanvasObjects();

// Sample box to draw
const box1: Box = new Box(200, 100, '#5c9dffff', 100, 100);
canvasObjects.addDrawable(box1);

const box2: Box = new Box(200, 200, '#aa269fff', 400, 500);
canvasObjects.addDrawable(box2);

const box3: Box = new Box(200, 300, '#8ef7ffff', 750, 300);
canvasObjects.addDrawable(box3);

const box4: Box = new Box(100, 300, '#ecaf2aff', 600, -300);
canvasObjects.addDrawable(box4);

// #endregion Add shapes to canvas


// #region Collapse button logic

const collapseButton: HTMLElement | null= document.getElementById("collapse-button");
const uncollapseButton: HTMLElement | null= document.getElementById("uncollapse-button");

const fileButton: HTMLElement | null = document.getElementById("file-button");
const exportButton: HTMLElement | null = document.getElementById("export-button");
const helpButton: HTMLElement | null = document.getElementById("help-button");
const logoText: HTMLElement | null = document.getElementById("logo-text");
const logoImage: HTMLElement | null = document.getElementById("logo-image");

// Initially set to uncollapsed
let collapsed: boolean = true;

// initially toggle the menu
updateMenuVisibility(collapsed);

collapseButton?.addEventListener("click", () => {
        console.log("Collapse button clicked.")
        showUncollapsedMenu();
    }
);

uncollapseButton?.addEventListener("click", () => {
        console.log("Uncollapse button clicked.")
        showCollapsedMenu();
    }
);


function updateMenuVisibility(collapsed: boolean) : void {
    if (collapsed) {
        console.log("Collapsed");
        showCollapsedMenu();
    }
    else {
        console.log("Uncollapsed");
        showUncollapsedMenu();
    }
}

function showUncollapsedMenu() : void {
    uncollapseButton?.classList.remove("invisible");
    collapseButton?.classList.add("invisible");
    
    // Hide the file, export, and help buttons
    fileButton?.classList.add("invisible");
    exportButton?.classList.add("invisible");
    helpButton?.classList.add("invisible");
    logoText?.classList.add("invisible");
    logoImage?.classList.remove("invisible");

    collapsed = false;
}

function showCollapsedMenu() : void {
    collapseButton?.classList.remove("invisible");
    uncollapseButton?.classList.add("invisible");

    fileButton?.classList.remove("invisible");
    exportButton?.classList.remove("invisible");
    helpButton?.classList.remove("invisible");
    logoText?.classList.remove("invisible");
    logoImage?.classList.add("invisible");

    collapsed = true;
}

// #endregion Collapse button logic


// calculate the width and height of the screen
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

// create the canvas
const infiniteCanvas: InfiniteCanvas = new InfiniteCanvas('canvas', canvasWidth, canvasHeight, canvasObjects);

// make the canvas size the same as the window
window.addEventListener('resize', () => {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    infiniteCanvas.updateSize(canvasWidth, canvasHeight);

    infiniteCanvas.draw();
});