export class MoveTool {
    constructor() {
        this.name = 'move';
    }
    activate(canvas) {
        canvas.canvas.style.cursor = 'grab';
    }
    deactivate(canvas) {
        canvas.isPanning = false;
        canvas.canvas.style.cursor = 'default';
    }
    onMouseDown(e, canvas) {
        canvas.isPanning = true;
        canvas.canvas.style.cursor = 'grabbing';
        canvas.panStart.x = e.offsetX;
        canvas.panStart.y = e.offsetY;
    }
    onMouseMove(e, canvas) {
        if (canvas.isPanning) {
            canvas.panDistanceX += (e.offsetX - canvas.panStart.x);
            canvas.panDistanceY += (e.offsetY - canvas.panStart.y);
            canvas.panStart.x = e.offsetX;
            canvas.panStart.y = e.offsetY;
            canvas.draw();
        }
    }
    onMouseUp(e, canvas) {
        canvas.isPanning = false;
        canvas.canvas.style.cursor = 'grab';
    }
    onWheel(e, canvas) {
        e.preventDefault();
        const zoomFactor = 1.15;
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        const delta = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
        const prevScale = canvas.scale;
        canvas.scale *= delta;
        canvas.panDistanceX = mouseX - (mouseX - canvas.panDistanceX) * (canvas.scale / prevScale);
        canvas.panDistanceY = mouseY - (mouseY - canvas.panDistanceY) * (canvas.scale / prevScale);
        canvas.draw();
    }
}
