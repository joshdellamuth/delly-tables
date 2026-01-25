import { IInputManager, InputManager } from './InputManager/InputManager.ts';
import { Size } from './Shared/Size.ts';
import { IDrawable } from '../Canvas/Drawables/IDrawable.ts';

export class Canvas {
    private readonly ID: string;
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly inputManager: IInputManager;
    private size: Size = new Size(0, 0);

    constructor(
        ID: string,
        width: number,
        height: number,
        canvasDrawables?: IDrawable[]
    ) {
        this.ID = ID;

        const canvas = document.getElementById(ID);
        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            throw new Error(`Canvas element with ID "${ID}" not found`);
        }
        this.canvas = document.getElementById(ID) as HTMLCanvasElement;

        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D context from canvas');
        }
        this.ctx = ctx;

        const shapesButton = this.getButtonById('shapes-button');
        const textButton = this.getButtonById('text-button');
        const annotateButton = this.getButtonById('annotate-button');

        this.inputManager = new InputManager(
            this.canvas,
            ctx,
            shapesButton,
            textButton,
            annotateButton
        );

        // Update the canvas size according to what it was set to. 
        this.updateSize(width, height);

        if (canvasDrawables) {
            this.inputManager.addDrawables(canvasDrawables);
        }

        this.render();
    }

    private getButtonById(id: string): HTMLButtonElement {
        const button = document.getElementById(id);
        if (!button || !(button instanceof HTMLButtonElement)) {
            throw new Error(`Button element with ID "${id}" not found`);
        }
        return button;
    }

    private render(): void {
        this.inputManager.render();
    }

    // Update the canvas size. 
    public updateSize(width: number, height: number): void {
        this.size.width = width;
        this.size.height = height;
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
    }
}