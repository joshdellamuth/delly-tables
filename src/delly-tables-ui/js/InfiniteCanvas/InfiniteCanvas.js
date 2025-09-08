import { CanvasObjects } from '../CanvasObjects/CanvasObjects.js';
export class InfiniteCanvas {
    constructor(canvasID, width, height, canvasObjects) {
        this.canvasObjects = new CanvasObjects();
        this.isPanning = false;
        this.panDistanceX = 0;
        this.panDistanceY = 0;
        this.panStartX = 0;
        this.panStartY = 0;
        this.scale = 1;
        this.mouseX = null;
        this.mouseY = null;
        this.backgroundColor = '#f7f7f7ff';
        this.selectedDrawable = null;
        this.isDragging = false;
        this.canvasID = canvasID;
        this.canvas = document.getElementById(canvasID);
        // The ! is a type assertion that says you are sure a non-null value will be returned
        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        if (canvasObjects) {
            this.canvasObjects = canvasObjects;
        }
        this.addEventlisteners();
        // Initial draw
        this.draw();
        // update the values seen on the UI 
        this.updateValues();
    }
    updateSize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    drawObjects() {
        this.canvasObjects.drawables.forEach((drawable) => {
            drawable.draw(this.ctx, this.panDistanceX, this.panDistanceY);
        });
    }
    draw() {
        // Reset transformation matrix. This cancels any previosu scale, rotate, translate or skew operations.
        // This ensures drawing commands start from a neutral coordinate system.  
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        // Removes the pixel content of the canvas. (Would get ghosting and trails without this)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw background before re-applying the transformations. 
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Re-applies the zoom and the panning for the current frame.
        // this.scale is used twice for both horizontal and vertical scaling. 
        this.ctx.setTransform(this.scale, 0, 0, this.scale, this.panDistanceX, this.panDistanceY);
        // Draw the objects on the canvas.
        this.drawObjects();
    }
    addEventlisteners() {
        // When inside of the canvas, this prevents right click menu showing when right clicking
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
                    if (this.canvasObjects.drawables[i].isMouseOver(e.offsetX, e.offsetY)) {
                        this.selectedDrawable = this.canvasObjects.drawables[i];
                        this.canvasObjects.drawables[i].isSelected = true;
                        this.draw();
                        this.resetSelectedShapes(this.canvasObjects.drawables);
                        this.updateValues();
                        break;
                    }
                }
            }
            if (e.button == 2) {
                this.isPanning = true;
                this.canvas.style.cursor = 'grab';
                this.panStartX = e.offsetX;
                this.panStartY = e.offsetY; // e.OffsetY is the veritical distance of the mouse from the top edge of the canvas 
                this.updateValues();
            }
        });
        // MOUSE MOVE ON CANVAS
        this.canvas.addEventListener('mousemove', (e) => {
            // Get mouse position when mouse moves.
            const mouse = this.getMousePos(e);
            this.mouseX = mouse.x;
            this.mouseY = mouse.y;
            this.updateValues();
            if (this.isDragging && this.selectedDrawable !== null) {
                // Move the selected shape
                this.selectedDrawable.xPosition = mouse.x - this.panDistanceX;
                this.selectedDrawable.yPosition = mouse.y - this.panDistanceY;
                this.draw();
                this.updateValues();
            }
            // The isPanning variable is only set when the right click is down.
            if (this.isPanning) {
                this.canvas.style.cursor = 'grabbing';
                this.panDistanceX += (e.offsetX - this.panStartX);
                this.panDistanceY += (e.offsetY - this.panStartY);
                this.panStartX = e.offsetX;
                this.panStartY = e.offsetY;
                this.updateValues();
                this.draw();
            }
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
            e.preventDefault();
            const zoomFactor = 1.12;
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;
            const delta = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
            const prevScale = this.scale;
            this.scale *= delta;
            this.panDistanceX = mouseX - (mouseX - this.panDistanceX) * (this.scale / prevScale);
            this.panDistanceY = mouseY - (mouseY - this.panDistanceY) * (this.scale / prevScale);
            this.updateValues();
            this.draw();
        });
        // #endregion Event Listeners
    }
    updateValues() {
        var _a, _b, _c, _d;
        const debuggingValuesElement = document.getElementById('debuggingValues');
        const panDistanceXDisplay = this.panDistanceX.toFixed(3);
        const panDistanceYDisplay = this.panDistanceY.toFixed(3);
        const panStartXDisplay = this.panStartX.toFixed(3);
        const panStartYDisplay = this.panStartY.toFixed(3);
        const isPanningDisplay = this.isPanning;
        const scaleDisplay = this.scale.toFixed(3);
        const mouseXDisplay = this.mouseX === null ? 'null' : this.mouseX.toFixed(3);
        const mouseYDisplay = this.mouseY === null ? 'null' : this.mouseY.toFixed(3);
        const selectedDrawableX = (_b = (_a = this.selectedDrawable) === null || _a === void 0 ? void 0 : _a.xPosition) !== null && _b !== void 0 ? _b : 'null';
        const selectedDrawableY = (_d = (_c = this.selectedDrawable) === null || _c === void 0 ? void 0 : _c.yPosition) !== null && _d !== void 0 ? _d : 'null';
        debuggingValuesElement.innerText =
            `| panDistanceX: ${panDistanceXDisplay} ` +
                `| panDistanceY: ${panDistanceYDisplay} ` +
                `| panStartX: ${panStartXDisplay} ` +
                `| panStartY: ${panStartYDisplay} ` +
                `| isPanning: ${isPanningDisplay} ` +
                `| scale: ${scaleDisplay} ` +
                `| mouseX: ${mouseXDisplay} ` +
                `| mouseY: ${mouseYDisplay} ` +
                `| selectedDrawable: ${selectedDrawableX} + ${selectedDrawableY} |`;
    }
    // getMousePos(mouseEvent: MouseEvent) {
    //     const rect = this.canvas.getBoundingClientRect();
    //     return {
    //         x: mouseEvent.clientX - rect.left,
    //         y: mouseEvent.clientY - rect.top
    //     };
    // }
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;
        // Transform canvas coordinates to world coordinates
        const worldX = (canvasX - this.panDistanceX) / this.scale;
        const worldY = (canvasY - this.panDistanceY) / this.scale;
        return { x: worldX, y: worldY, canvasX, canvasY };
    }
    resetSelectedShapes(drawables) {
        this.canvasObjects.drawables.forEach((drawable) => {
            drawable.isSelected = false;
        });
    }
}
