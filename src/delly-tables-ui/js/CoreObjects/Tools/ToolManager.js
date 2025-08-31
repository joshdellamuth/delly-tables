import { MoveTool } from "./MoveTool.js";
import { ShapeTool } from "./ShapeTool.js";
import { SelectTool } from "./SelectTool.js";
class ToolManager {
    constructor() {
        this.tools = new Map(); // Key: string, Value: ITool
    }
    registerTools() {
        // These are the key-value pairs stored in the Map:
        this.tools.set('move', new MoveTool()); // key: 'move', value: MoveTool instance
        this.tools.set('shape', new ShapeTool()); // key: 'shape', value: ShapeTool instance
        this.tools.set('select', new SelectTool()); // key: 'select', value: SelectTool instance
    }
    getTool(name) {
        const tool = this.tools.get(name); // Look up the tool by name
        if (!tool) {
            throw new Error(`Tool '${name}' not found`);
        }
        return tool; // Return the found tool
    }
}
