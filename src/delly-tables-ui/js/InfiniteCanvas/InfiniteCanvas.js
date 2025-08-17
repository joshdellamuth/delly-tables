export class InfiniteCanvas {
    constructor(canvasID, width, height) {
        this.canvasID = canvasID;
        this.canvas = document.getElementById(canvasID);
        // The ! is a type assertion that says you are sure a non-null value will be returned
        this.context = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
}
