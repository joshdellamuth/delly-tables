import { Utilities } from '../InfiniteCanvas/Utilities.js';
export class CanvasObjects {
    constructor() {
        this._utilities = new Utilities();
        this._drawables = [];
    }
    get drawables() {
        return this._drawables;
    }
    set drawables(drawables) {
        this._drawables = drawables;
    }
    // This method removes a drawable from the canvas object list
    addDrawable(drawable) {
        this._drawables.push(drawable);
    }
    // This method removes a drawable from the canvas object list
    removeDrawable(drawable) {
        // This will return -1 if not found.
        const index = this._drawables.indexOf(drawable);
        if (index !== -1) {
            this._drawables.splice(index, 1);
        }
    }
    drawObjects(ctx, canvas, xDistanceFromOrigin, yDistanceFromOrigin, scale) {
        this._drawables.forEach((drawable) => {
            const screenPosition = this._utilities.convertToScreenPos(drawable.gridPosition, canvas, xDistanceFromOrigin, yDistanceFromOrigin, scale);
            console.log(`Converting for drawable: ${drawable.ID}. Screen position is: (${screenPosition.x}, ${screenPosition.y})`);
            drawable.updateScreenPosition(screenPosition);
            drawable.draw(ctx, xDistanceFromOrigin, yDistanceFromOrigin);
        });
    }
    resetSelectedShapes() {
        this._drawables.forEach((drawable) => {
            drawable.isSelected = false;
        });
    }
}
