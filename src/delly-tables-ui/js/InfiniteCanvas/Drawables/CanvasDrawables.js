import { Utilities } from '../Shared/Utilities.js';
export class CanvasDrawables {
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
