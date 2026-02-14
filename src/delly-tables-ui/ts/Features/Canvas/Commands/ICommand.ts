export interface ICommand {
    /** * Executes the command and changes state. */
    execute(): void;

    /** * Reverts the command's changes. */
    undo(): void;

    /** * Optional: A human-readable name for debugging or UI. */
    readonly name?: string;
    isCanvasUndoable: boolean;
}
