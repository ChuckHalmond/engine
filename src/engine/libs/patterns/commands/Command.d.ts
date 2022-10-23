export { isCommand };
export { isUndoCommand };
export { Command };
export { UndoCommand };
declare function isCommand(obj: any): obj is Command;
declare function isUndoCommand(obj: any): obj is UndoCommand;
interface Command {
    exec: (args?: any) => void;
    undo?: (args?: any) => void;
}
interface UndoCommand {
    exec: (args?: any) => void;
    undo: (args?: any) => void;
}
