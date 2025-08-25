import { CanvasObjects } from '../CanvasObjects/CanvasObjects.js';
import { IDrawable } from '../CoreObjects/IDrawable.js';

export class InfiniteCanvas {
    canvasID: string;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    canvasObjects: CanvasObjects = new CanvasObjects();
    isPanning: boolean = false;
    panDistanceX: number = 0;
    panDistanceY: number = 0;
    public panStartX: number = 0;
    panStartY: number = 0;
    scale: number = 1;

    constructor(canvasID: string, width: number, height: number, canvasObjects?: CanvasObjects) {
        this.canvasID = canvasID;

        this.canvas = document.getElementById(canvasID) as HTMLCanvasElement;
        // The ! is a type assertion that says you are sure a non-null value will be returned
        this.ctx = this.canvas.getContext('2d')!;
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

    drawObjects() {
        this.canvasObjects.drawables.forEach((drawable: IDrawable) => {
            drawable.draw(this.ctx, this.panDistanceX, this.panDistanceY);
        });
    }

    draw() {
        // Reset transformation matrix 
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.setTransform(this.scale, 0, 0, this.scale, this.panDistanceX, this.panDistanceY);

        // Draw the objects on the canvas
        this.drawObjects();
    }


    addEventlisteners(): void {
        // When inside of the canvas, this prevents right click menu showing when right clicking
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // #region Event Listeners

        // MOUSE MOVE
        this.canvas.addEventListener("mousemove", e => {
            if (this.isPanning) {
                // e.OffsetX is the horizontal distance of the mouse from the left edge of the canvas 
                this.panDistanceX += (e.offsetX - this.panStartX);
                // e.OffsetY is the veritical distance of the mouse from the top edge of the canvas 
                this.panDistanceY += (e.offsetY - this.panStartY);
                this.panStartX = e.offsetX;
                this.panStartY = e.offsetY;
                this.updateValues();
                this.draw();
            }
        });

        // MOUSE DOWN ON CANVAS
        this.canvas.addEventListener('mousedown', (e) => {
            this.isPanning = true;
            this.canvas.style.cursor = 'grab';
            this.panStartX = e.offsetX;
            this.panStartY = e.offsetY; // e.OffsetY is the veritical distance of the mouse from the top edge of the canvas 
            this.updateValues();
        });

        // MOUSE MOVE ON CANVAS
        this.canvas.addEventListener('mousemove', (e) => {
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
            this.isPanning = false;
            this.canvas.style.cursor = 'grab';
            this.updateValues();
        });

        // MOUSE LEAVE ON CANVAS
        this.canvas.addEventListener("mouseleave", () => {
            this.isPanning = false;
            this.updateValues();
        });

        // MOUSE WHEEL ON CANVAS
        this.canvas.addEventListener("wheel", e => {
            e.preventDefault();
            const zoomFactor = 1.15;
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

        const panDistanceXElement = document.getElementById('panDistanceX') as HTMLParagraphElement;
        const panDistanceYElement = document.getElementById('panDistanceY') as HTMLParagraphElement;

        const panStartXElement = document.getElementById('panStartX') as HTMLParagraphElement;
        const panStartYElement = document.getElementById('panStartY') as HTMLParagraphElement;

        const isPanningElement = document.getElementById('isPanning') as HTMLParagraphElement;
        const scaleElement = document.getElementById('scale') as HTMLParagraphElement;

        panDistanceXElement.innerText = `panDistanceX: ${this.panDistanceX}`;
        panDistanceYElement.innerText = `panDistanceY: ${this.panDistanceY}`;
        panStartXElement.innerText = `panStartX: ${this.panStartX}`;
        panStartYElement.innerText = `panStartY: ${this.panStartY}`;
        isPanningElement.innerText = `isPanning: ${this.isPanning}`;
        scaleElement.innerText = `scale: ${this.scale}`;
    }


}