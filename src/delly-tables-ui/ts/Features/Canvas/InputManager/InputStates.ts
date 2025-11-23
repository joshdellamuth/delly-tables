export class InputStates {
    public static readonly Idle = 0;
    // Panning the canvas
    public static readonly Panning = 1;
    // Drawing a select box
    public static readonly Selecting = 2;
    // Dragging the selected around the canvas
    public static readonly Dragging = 3;
    // Resizing the selected 
    public static readonly Resizing = 4;
    // Drawing a shape
    public static readonly Drawing = 6;
}