import { CanvasObjects } from '../CanvasObjects/CanvasObjects.js';
import { Position } from './Position.js';
import { Size } from './Size.js';
import { Utilities } from './Utilities.js';
export class InfiniteCanvas {
    constructor(ID, width, height, canvasObjects) {
        this.size = new Size(0, 0);
        this.canvasObjects = new CanvasObjects();
        // Running totals of how far the canvas has been moved from the original point.
        this.xDistanceFromOrigin = 0;
        this.yDistanceFromOrigin = 0;
        // The starting point of the pan. 
        this.panStart = new Position(null, null);
        // The current scale of the canvas. 
        this.scale = 1;
        // The current mouse position on the grid. 
        this.mouseGridPosition = new Position(null, null);
        this.mouseScreenPosition = new Position(null, null); // ✅
        this.backgroundColor = '#f7f7f7ff';
        this.selectedDrawable = null;
        this.isDragging = false;
        this.isPanning = false;
        this.utilities = new Utilities();
        this.panX = 0;
        this.panY = 0;
        this.ID = ID;
        this.canvas = document.getElementById(ID);
        // The ! is a type assertion that says you are sure a non-null value will be returned
        this.ctx = this.canvas.getContext('2d');
        this.size = new Size(width, height);
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
        if (canvasObjects) {
            this.canvasObjects = canvasObjects;
        }
        this.addEventlisteners();
        // Initial draw
        this.drawCanvas();
        // update the values seen on the UI 
        this.updateValues();
    }
    drawCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.panX, this.panY);
        this.ctx.scale(this.scale, this.scale);
        // Draw the objects on the canvas.
        this.canvasObjects.drawObjects(this.ctx, this.canvas, 0, 0, this.scale);
        this.ctx.restore();
    }
    addEventlisteners() {
        // When inside of the canvas, this prevents right click menu showing when right clicking.
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        // #region Event Listeners
        // MOUSE DOWN ON CANVAS
        this.canvas.addEventListener('mousedown', (e) => {
            // This will eventuall be used to select objects.
            if (e.button == 0) {
                // Check to see if we clicked a shape
                for (let i = this.canvasObjects.drawables.length - 1; i >= 0; i--) {
                    if (this.canvasObjects.drawables[i].isMouseOver(this.mouseGridPosition.x, this.mouseGridPosition.y)) {
                        this.selectedDrawable = this.canvasObjects.drawables[i];
                        this.canvasObjects.drawables[i].isSelected = true;
                        this.drawCanvas();
                        this.canvasObjects.resetSelectedShapes();
                        this.updateValues();
                        break;
                    }
                }
            }
            if (e.button == 2) {
                this.isPanning = true;
                this.canvas.style.cursor = 'grab';
                this.panStart.x = e.clientX;
                this.panStart.y = e.clientY;
                this.updateValues();
            }
        });
        // MOUSE MOVE ON CANVAS
        this.canvas.addEventListener('mousemove', (mouseEvent) => {
            // Get mouse position when mouse moves.
            this.updateMousePosition(mouseEvent.clientX, mouseEvent.clientY);
            this.updateValues();
            // The isPanning variable is only set when the right click is down.
            if (this.isPanning) {
                this.canvas.style.cursor = 'grabbing';
                const deltaX = mouseEvent.clientX - this.panStart.x;
                const deltaY = mouseEvent.clientY - this.panStart.y;
                this.panX += deltaX;
                this.panY += deltaY;
                this.panStart.x = mouseEvent.clientX;
                this.panStart.y = mouseEvent.clientY;
            }
            this.updateValues();
            this.drawCanvas();
        });
        // MOUSE UP ON CANVAS
        this.canvas.addEventListener("mouseup", () => {
            this.canvas.style.cursor = 'default';
            if (this.isPanning) {
                this.isPanning = false;
                this.updateValues();
            }
        });
        // MOUSE LEAVE ON CANVAS
        this.canvas.addEventListener("mouseleave", () => {
            this.isPanning = false;
            this.updateValues();
        });
        // MOUSE WHEEL ON CANVAS
        this.canvas.addEventListener("wheel", e => {
            const zoomFactor = 1.12;
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const delta = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
            const newScale = this.scale * delta;
            // Zoom toward mouse position
            this.panX = mouseX - (mouseX - this.panX) * (newScale / this.scale);
            this.panY = mouseY - (mouseY - this.panY) * (newScale / this.scale);
            this.scale = newScale;
            this.updateValues();
            this.drawCanvas();
        });
        // #endregion Event Listeners
    }
    updateMousePosition(distanceFromLeft, distanceFromTop) {
        // screen position is accurate.
        const rect = this.canvas.getBoundingClientRect();
        // Use correct screen position
        this.mouseScreenPosition.x = distanceFromLeft - rect.left;
        this.mouseScreenPosition.y = distanceFromTop - rect.top;
        // Transform to grid coordinates
        this.mouseGridPosition.x = (this.mouseScreenPosition.x - this.panX) / this.scale;
        this.mouseGridPosition.y = (this.mouseScreenPosition.y - this.panY) / this.scale;
    }
    // Used to update the size of the canvas. 
    updateSize(width, height) {
        this.size.width = width;
        this.size.height = height;
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
    }
    updateValues() {
        var _a, _b, _c, _d, _e;
        const debuggingValuesElement = document.getElementById('debuggingValues');
        const xDistanceFromOriginDisplay = this.xDistanceFromOrigin.toFixed(3);
        const yDistanceFromOriginDisplay = this.yDistanceFromOrigin.toFixed(3);
        const panStartXDisplay = this.panStart.x === null ? 'null' : this.panStart.x.toFixed(8);
        const panStartYDisplay = this.panStart.y === null ? 'null' : this.panStart.y.toFixed(8);
        const isPanningDisplay = this.isPanning;
        const scaleDisplay = this.scale.toFixed(8);
        const mouseGridPositionXDisplay = this.mouseGridPosition.x === null ? 'null' : this.mouseGridPosition.x.toFixed(8);
        const mouseGridPositionYDisplay = this.mouseGridPosition.y === null ? 'null' : this.mouseGridPosition.y.toFixed(8);
        const mouseScreenPositionXDisplay = this.mouseScreenPosition.x === null ? 'null' : this.mouseScreenPosition.x.toFixed(8);
        const mouseScreenPositionYDisplay = this.mouseScreenPosition.y === null ? 'null' : this.mouseScreenPosition.y.toFixed(8);
        const selectedDrawableX = (_b = (_a = this.selectedDrawable) === null || _a === void 0 ? void 0 : _a.gridPosition.x) !== null && _b !== void 0 ? _b : 'null';
        const selectedDrawableY = (_d = (_c = this.selectedDrawable) === null || _c === void 0 ? void 0 : _c.gridPosition.y) !== null && _d !== void 0 ? _d : 'null';
        debuggingValuesElement.innerText =
            `| xDistanceFromOrigin: ${xDistanceFromOriginDisplay} ` +
                `| yDistanceFromOrigin: ${yDistanceFromOriginDisplay} ` +
                `| panStartX: ${panStartXDisplay} ` +
                `| panStartY: ${panStartYDisplay} ` +
                `| isPanning: ${isPanningDisplay} ` +
                `| scale: ${scaleDisplay} ` +
                `| mouseGridPosition.x: ${mouseGridPositionXDisplay} ` +
                `| mouseGridPosition.y: ${mouseGridPositionYDisplay} ` +
                `| mouseScreenPosition.x: ${mouseScreenPositionXDisplay} ` +
                `| mouseScreenPosition.y: ${mouseScreenPositionYDisplay} ` +
                `| selectedDrawable: '${(_e = this.selectedDrawable) === null || _e === void 0 ? void 0 : _e.ID}': ${selectedDrawableX} + ${selectedDrawableY} |`;
    }
}
