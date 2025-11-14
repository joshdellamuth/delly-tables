import { IInputManager } from './InputManager/IInputManager.ts';
import { InputManager } from './InputManager/InputManager.ts';
import { Size } from './Shared/Size.ts';
import { IDrawable } from '../Canvas/Drawables/IDrawable.ts';

export class Canvas {
    private readonly ID: string;
    private readonly canvas: HTMLCanvasElement;
    private readonly inputManager: IInputManager;
    private size: Size = new Size(0, 0);
    private shapesButton: HTMLButtonElement = document.getElementById('shapes-button') as HTMLButtonElement;

    constructor(ID: string, width: number, height: number, canvasDrawables?: IDrawable[]) {
        this.ID = ID;
        this.canvas = document.getElementById(ID) as HTMLCanvasElement;
        const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
        this.inputManager = new InputManager(this.canvas, ctx);
        this.updateSize(width, height);

        if (canvasDrawables) {
            this.inputManager.addDrawables(canvasDrawables);
        }

        this.addButtonListeners();

        console.log('This is the shapes button');
        console.log(this.shapesButton);

        //this.setupEventListeners();
        this.render();
    }

    private render(): void {
        this.inputManager.render();
    }

    public updateSize(width: number, height: number): void {
        this.size.width = width;
        this.size.height = height;
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
    }

    private addButtonListeners(): void {
        // Shapes button
        this.shapesButton.addEventListener('click', () => {
            console.log('Shapes button clicked');
            this.inputManager.toggleShapesButton(); // This will trigger the callback
            this.shapesButton.classList.toggle('active');
        });
    }
}