export class InfiniteCanvas {
    canvasID: string;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;

    constructor(canvasID: string, width: number, height: number) {
        this.canvasID = canvasID;

        this.canvas = document.getElementById(canvasID) as HTMLCanvasElement;
        // The ! is a type assertion that says you are sure a non-null value will be returned
        this.context = this.canvas.getContext('2d')!;
        this.width = width;
        this.height = height;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
}