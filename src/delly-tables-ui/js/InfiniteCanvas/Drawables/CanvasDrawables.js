"use strict";
// import { IDrawable } from './IDrawable.js';
// import { Position } from '../Shared/Position.js';
// import { Utilities } from '../Shared/Utilities.js';
// export class CanvasDrawables{
//     private _drawables: IDrawable[];
//     constructor() {
//         this._drawables = [];
//     }
//     get drawables(): IDrawable[] {
//         return this._drawables;
//     }
//     set drawables(drawables: IDrawable[]) {
//         this._drawables = drawables;
//     }
//     // This method removes a drawable from the canvas object list
//     addDrawable(drawable: IDrawable): void {
//         this._drawables.push(drawable);
//     }
//     // This method removes a drawable from the canvas object list
//     removeDrawable(drawable: IDrawable): void {
//         // This will return -1 if not found.
//         const index = this._drawables.indexOf(drawable);
//         if (index !== -1) {
//             this._drawables.splice(index, 1);
//         }
//     }
//     drawObjects(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, xDistanceFromOrigin: number,
//         yDistanceFromOrigin: number, scale: number): void {
//         this._drawables.forEach((drawable: IDrawable) => {
//             const screenPosition: Position = this._utilities.convertToScreenPos(drawable.gridPosition,
//                 canvas, xDistanceFromOrigin, yDistanceFromOrigin, scale);
//             drawable.updateScreenPosition(screenPosition);
//             drawable.draw(ctx, xDistanceFromOrigin, yDistanceFromOrigin);
//         });
//     }
// }
