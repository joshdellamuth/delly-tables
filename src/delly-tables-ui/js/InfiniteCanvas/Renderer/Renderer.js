export class Renderer {
    constructor(ctx) {
        this.backgroundColor = '#f7f7f7ff';
        this.ctx = ctx;
    }
    clear(width, height) {
        this.ctx.clearRect(0, 0, width, height);
    }
    render(canvasObjects, camera, canvas) {
        this.clear(canvas.width, canvas.height);
        this.ctx.save();
        this.ctx.translate(camera.panX, camera.panY);
        this.ctx.scale(camera.scale, camera.scale);
        canvasObjects.drawObjects(this.ctx, canvas, 0, 0, camera.scale);
        this.ctx.restore();
    }
}
