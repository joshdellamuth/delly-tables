import { InfiniteCanvas } from "../InfiniteCanvas.js";
export interface ITool {
    name: string;
    activate(canvas: InfiniteCanvas): void;
    deactivate(canvas: InfiniteCanvas): void;
    
    // Event handlers that tools can override, each marked with ? for being optional
    onMouseDown?(e: MouseEvent, canvas: InfiniteCanvas): void;
    onMouseMove?(e: MouseEvent, canvas: InfiniteCanvas): void;
    onMouseUp?(e: MouseEvent, canvas: InfiniteCanvas): void;
    onMouseLeave?(e: MouseEvent, canvas: InfiniteCanvas): void;
    onWheel?(e: WheelEvent, canvas: InfiniteCanvas): void;
    onKeyDown?(e: KeyboardEvent, canvas: InfiniteCanvas): void;
}