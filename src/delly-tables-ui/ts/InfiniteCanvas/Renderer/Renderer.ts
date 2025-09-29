import { Camera } from '../Camera/Camera.js';
import { CanvasDrawables } from '../Drawables/CanvasDrawables.js';

export class Renderer {
    private ctx: CanvasRenderingContext2D;
    private backgroundColor: string = '#f7f7f7ff';

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    clear(width: number, height: number): void {
        this.ctx.clearRect(0, 0, width, height);
    }

    render(canvasObjects: CanvasDrawables, camera: Camera, canvas: HTMLCanvasElement): void {
        this.clear(canvas.width, canvas.height);

        this.ctx.save();
        this.ctx.translate(camera.panX, camera.panY);
        this.ctx.scale(camera.scale, camera.scale);

        canvasObjects.drawObjects(this.ctx, canvas, 0, 0, camera.scale);

        this.ctx.restore();
    }
}