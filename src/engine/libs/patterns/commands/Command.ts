export { isCommand };
export { isUndoCommand };
export { Command };
export { UndoCommand };

function isCommand(obj: any): obj is Command {
    return (typeof obj.exec === 'function');
}

function isUndoCommand(obj: any): obj is UndoCommand {
    return (typeof obj.exec === 'function')
        && (typeof obj.undo === 'function');
}

interface Command {
    exec: (args?: any) => void;
    undo?: (args?: any) => void;
}

interface UndoCommand {
    exec: (args?: any) => void;
    undo: (args?: any) => void;
}