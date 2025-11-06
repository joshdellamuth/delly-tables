import { IInputManager } from './InputManager/IInputManager.ts';
import { InputManager } from './InputManager/InputManager.ts';
import { Size } from './Shared/Size.ts';
import { IDrawable } from '../Canvas/Drawables/IDrawable.ts';

export class Canvas {
    private readonly ID: string;
    private readonly canvas: HTMLCanvasElement;
    private readonly inputManager: IInputManager;
    private size: Size = new Size(0, 0);

    constructor(ID: string, width: number, height: number, canvasDrawables?: IDrawable[]) {
        this.ID = ID;
        this.canvas = document.getElementById(ID) as HTMLCanvasElement;
        const ctx : CanvasRenderingContext2D = this.canvas.getContext('2d')!;
        this.inputManager = new InputManager(this.canvas, ctx);
        this.updateSize(width, height);

        if (canvasDrawables) {
            this.inputManager.addDrawables(canvasDrawables);
        }

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
}