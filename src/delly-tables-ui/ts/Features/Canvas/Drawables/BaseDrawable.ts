export type BaseDrawable = {
    id: string;
    type: "shape" | "text" | "image" | "annotation" | "group" | "frame";
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number; // Used for rotation
    color: string;
    strokeWidth: number;
    isDeleted: boolean;
    zIndex: number;
    boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    selectionBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}