import { Box } from './CoreObjects/Box.js';
import { CanvasObjects } from './CanvasObjects/CanvasObjects.js';
import { InfiniteCanvas } from './InfiniteCanvas/InfiniteCanvas.js';
// Get the correct URL based on the hostname 
function getBaseURL() {
    const hostname = window.location.hostname;
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
let baseURL = getBaseURL();
console.log(`The base URL is ${baseURL}.`);
// #region Add shapes to canvas
// Represents the running list of canvas objects to be added to and deleted
const canvasObjects = new CanvasObjects();
// Sample box to draw
const box1 = new Box('blue-box-1', 200, 100, '#5c9dffff', 100, 100);
canvasObjects.addDrawable(box1);
const box2 = new Box('pink-box-1', 200, 200, '#aa269fff', 400, 500);
canvasObjects.addDrawable(box2);
const box3 = new Box('teal-box-1', 200, 300, '#8ef7ffff', 750, 300);
canvasObjects.addDrawable(box3);
const box4 = new Box('orange-box-1', 100, 300, '#ecaf2aff', 600, -300);
canvasObjects.addDrawable(box4);
// #endregion Add shapes to canvas
// #region Collapse button logic
const collapseButton = document.getElementById("collapse-button");
const uncollapseButton = document.getElementById("uncollapse-button");
const fileButton = document.getElementById("file-button");
const exportButton = document.getElementById("export-button");
const helpButton = document.getElementById("help-button");
const logoText = document.getElementById("logo-text");
const logoImage = document.getElementById("logo-image");
// Initially set to uncollapsed
let collapsed = true;
// initially toggle the menu
updateMenuVisibility(collapsed);
collapseButton === null || collapseButton === void 0 ? void 0 : collapseButton.addEventListener("click", () => {
    console.log("Collapse button clicked.");
    showUncollapsedMenu();
});
uncollapseButton === null || uncollapseButton === void 0 ? void 0 : uncollapseButton.addEventListener("click", () => {
    console.log("Uncollapse button clicked.");
    showCollapsedMenu();
});
function updateMenuVisibility(collapsed) {
    if (collapsed) {
        console.log("Collapsed");
        showCollapsedMenu();
    }
    else {
        console.log("Uncollapsed");
        showUncollapsedMenu();
    }
}
function showUncollapsedMenu() {
    uncollapseButton === null || uncollapseButton === void 0 ? void 0 : uncollapseButton.classList.remove("invisible");
    collapseButton === null || collapseButton === void 0 ? void 0 : collapseButton.classList.add("invisible");
    // Hide the file, export, and help buttons
    fileButton === null || fileButton === void 0 ? void 0 : fileButton.classList.add("invisible");
    exportButton === null || exportButton === void 0 ? void 0 : exportButton.classList.add("invisible");
    helpButton === null || helpButton === void 0 ? void 0 : helpButton.classList.add("invisible");
    logoText === null || logoText === void 0 ? void 0 : logoText.classList.add("invisible");
    logoImage === null || logoImage === void 0 ? void 0 : logoImage.classList.remove("invisible");
    collapsed = false;
}
function showCollapsedMenu() {
    collapseButton === null || collapseButton === void 0 ? void 0 : collapseButton.classList.remove("invisible");
    uncollapseButton === null || uncollapseButton === void 0 ? void 0 : uncollapseButton.classList.add("invisible");
    fileButton === null || fileButton === void 0 ? void 0 : fileButton.classList.remove("invisible");
    exportButton === null || exportButton === void 0 ? void 0 : exportButton.classList.remove("invisible");
    helpButton === null || helpButton === void 0 ? void 0 : helpButton.classList.remove("invisible");
    logoText === null || logoText === void 0 ? void 0 : logoText.classList.remove("invisible");
    logoImage === null || logoImage === void 0 ? void 0 : logoImage.classList.add("invisible");
    collapsed = true;
}
// #endregion Collapse button logic
// calculate the width and height of the screen
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
// create the canvas
const infiniteCanvas = new InfiniteCanvas('canvas', canvasWidth, canvasHeight, canvasObjects);
// make the canvas size the same as the window
window.addEventListener('resize', () => {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    infiniteCanvas.updateSize(canvasWidth, canvasHeight);
    infiniteCanvas.drawCanvas();
});
