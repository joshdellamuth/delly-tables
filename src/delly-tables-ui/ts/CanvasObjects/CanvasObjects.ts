import { IDrawable } from '../CoreObjects/IDrawable.js';

export class CanvasObjects {
    private _drawables: IDrawable[];

    constructor() {
        this._drawables = [];
    }

    get drawables(): IDrawable[] {
        return this._drawables;
    }

    set drawables(drawables: IDrawable[]) {
        this._drawables = drawables;
    }

    // This method removes a drawable from the canvas object list
    addDrawable(drawable: IDrawable): void {
        this._drawables.push(drawable);
    }

    // This method removes a drawable from the canvas object list
    removeDrawable(drawable: IDrawable): void {
        // This will return -1 if not found.
        const index = this._drawables.indexOf(drawable);
        if (index !== -1) {
            this._drawables.splice(index, 1);
        }
    }
}