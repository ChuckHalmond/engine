import { HotKey } from "engine/core/input/Input";
import { HTMLEMenuBarElement } from "engine/editor/elements/lib/containers/menus/MenuBar";
import { Command, isUndoCommand } from "engine/libs/patterns/commands/Command";
import { EventDispatcher } from "engine/libs/patterns/messaging/events/EventDispatcher";
import { ResourceFetcher } from "engine/resources/ResourceFetcher";
import { Resources } from "engine/resources/Resources";
import { HTMLEStatusBarElement } from "./elements/lib/containers/status/StatusBar";
import { getPropertyFromPath, setPropertyFromPath } from "./elements/Snippets";
import { HTMLEMenubarTemplate, HTMLEMenubarTemplateDescription } from "./templates/menus/MenubarTemplate";
import { HTMLEMenuItemTemplate } from "./templates/menus/MenuItemTemplate";

export { editor };
export { Editor };
export { EditorBase };
export { EditorCommand };
export { EditorHotKey };

interface EditorEventsMap {
    "contextenter": {
        data: {
            value: any
        }
    },
    "contextleave": {
        data: {
            value: any
        }
    },
    "statechange": {
        data: {
            value: any
        }
    }
};

interface Editor extends EventDispatcher<EditorEventsMap> {
    //readonly resources: Resources;

    getState(key: string): any;
    setState(key: string, value: any): void;
    
    addStateListener(statekey: string, listener: (newValue: any) => void): number;
    removeStateListener(statekey: string, listener: (newValue: any) => void): void;

    addHotkeyExec(hotkey: EditorHotKey, exec: () => void): void;
    removeHotkeyExec(hotkey: EditorHotKey, exec: () => void): void;

    statusbar: HTMLEStatusBarElement | null;
    menubar: HTMLEMenuBarElement | null;

    registerCommand(name: string, command: EditorCommand): void;
    executeCommand(name: string, args?: any, opts?: {undo?: boolean}): void;
    
    undoLastCommand(): void;
    redoLastCommand(): void;

    setContext(context: string): void;

    setup(): Promise<void>;
    reloadState(): Promise<void>;
}

interface EditorCommand extends Command {
    context: string;
}

interface EditorSelection extends Object {}

interface EditorHotkey extends HotKey {}

interface EditorCommandCall extends EditorCommand {
    args: any;
}

// "my.object.property"  <=> my { object { property: val }}
// change events

interface EditorHotKey extends HotKey {}

class EditorBase extends EventDispatcher<EditorEventsMap> implements Editor {

    private _commands: Map<string, EditorCommand>;
    //TODO: Modifiers-optimized retrieving ?
    private _hotkeys: Map<EditorHotkey, (() => void)[]>;

    private _undoCommandsCallStack: Array<EditorCommandCall>;
    private _redoCommandsCallStack: Array<EditorCommandCall>;

    private _context: string;

    private _state: {};
    private _stateListeners: Map<string, Array<(newValue: any) => void>>;

    //readonly resources: Resources;

    public menubar: HTMLEMenuBarElement | null;
    public statusbar: HTMLEStatusBarElement | null;

    public _selection: EditorSelection | null;

    private _focusListeners: Array<() => void>;


    /*readonly toolbar: HTMLElement;
    readonly statusbar: HTMLElement;*/

    /*public readonly state: HTMLFormElement;
    */

    constructor() {
        super();

        this._commands = new Map();
        this._context = 'default';
        this._hotkeys = new Map();
        
        this._undoCommandsCallStack = [];
        this._redoCommandsCallStack = [];

        this.menubar = null;
        this.statusbar = null;

        this._selection = null;

        this._state = {};
        this._stateListeners = new Map();
        this._focusListeners = [];
    }

    public get context(): string {
        return this._context;
    }

    public setup(): Promise<any> {
        const menubarContainer = document.getElementById("menubar-container");
        this.statusbar = document.body.querySelector("e-statusbar");

        document.addEventListener("keydown", (event: KeyboardEvent) => {
            Array.from(this._hotkeys.keys()).forEach((hotkey) => {
                if (hotkey.test(event)) {
                    let execs = this._hotkeys.get(hotkey);
                    execs!.forEach((exec) => {
                        exec();
                    });
                }
            });
        });

        return Promise.all([
            new Promise<void>(
                (resolve, reject) => {
                    if (menubarContainer) {
                        ResourceFetcher.fetchJSON<HTMLEMenubarTemplateDescription>("assets/editor/editor.json").then((menubarTemplate) => {
                            const menubar = HTMLEMenubarTemplate(menubarTemplate);
                            this.menubar = menubar;
                            menubarContainer.append(menubar);
                            resolve();
                        });
                    }
                    else {
                        reject();
                    }
                }
            ),
            new Promise<void>(
                (resolve) => {
                    ResourceFetcher.fetchJSON<object>("assets/editor/state.json").then((state: {[key: string]: any}) => {
                        const keys = Object.keys(state);
                        keys.forEach((key) => {
                            this.setState(key, state[key]);
                        });
                        resolve();
                    });
                }
            )
        ]);
    }

    public reloadState(): Promise<void> {
        return new Promise<void>(
            (resolve) => {
                ResourceFetcher.fetchJSON<object>("assets/editor/state.json").then((state: {[key: string]: any}) => {
                    const keys = Object.keys(state);
                    keys.forEach((key) => {
                        this.setState(key, state[key]);
                    });
                    resolve();
                });
            }
        )
    }

    public setContext(context: string): void {
        if (context !== this._context) {
            /*this.dispatchEvent(`${this._context}contextleave`, {data: void 0});
            this.dispatchEvent(`${context}contextenter`, {data: void 0});
            this._context = context;
            if (this.menubar) {
                this.menubar.findItems((item) => {
                    return !!item.command && (item.command.context === this._context)
                }).forEach((item) => {
                    item.disabled = true;
                });
            }*/
        }
    }

    public getState(key: string): any {
        return getPropertyFromPath(this._state, key);
    }

    //TODO: Create a listeners object with the same structure as the state object
    public setState(key: string, value: any): void {
        setPropertyFromPath(this._state, key, value);
        const listenedStates = Array.from(this._stateListeners.keys());
        listenedStates.filter(
            (state) => {
                return (state.startsWith(key) && (state.charAt(key.length) === "." || state.charAt(key.length) === "")) ||
                    (key.startsWith(state) && (key.charAt(state.length) === "." || key.charAt(state.length) === ""));
            }
        ).forEach((state) => {
            let stateListeners = this._stateListeners.get(state);
            if (stateListeners) {
                let newStateValue = (state.length === key.length) ? value :
                    (state.length >= key.length) ? getPropertyFromPath(value, state.substring(key.length + 1)) :
                    getPropertyFromPath(this._state, state);
                stateListeners.forEach((stateListener) => {
                    stateListener(newStateValue);
                });
            }
        });
    }

    public addStateListener(statekey: string, listener: (newValue: any) => void): number {
        let stateListeners = this._stateListeners.get(statekey);
        if (typeof stateListeners === "undefined") {
            this._stateListeners.set(statekey, [listener]);
            return 0;
        }
        else {
            return stateListeners.push(listener) - 1;
        }
    }

    public removeStateListener(statekey: string, listener: (newValue: any) => void): void {
        let stateListeners = this._stateListeners.get(statekey);
        if (typeof stateListeners !== "undefined") {
            let index = stateListeners.indexOf(listener);
            if (index >= 0) {
                stateListeners.splice(index, 1);
            }
            if (stateListeners.length === 0) {
                this._stateListeners.delete(statekey);
            }
        }
    }

    public registerCommand(name: string, command: EditorCommand) {
        this._commands.set(name, command);
    }

    public executeCommand(name: string, args?: any, opts?: {undo?: boolean}): void {
        const command = this._commands.get(name);
        if (command && command.context === this._context) {

            if (opts && opts.undo && isUndoCommand(command)) {
                command.undo(args);
                this._redoCommandsCallStack.push({...command, args: args});
            }
            else {
                command.exec(args);
                if (isUndoCommand(command)) {
                    this._undoCommandsCallStack.push({...command, args: args});
                }
            }
        }
    }

    public undoLastCommand(): void {
        const lastCommand = this._undoCommandsCallStack.pop();
        if (lastCommand) {
            if (isUndoCommand(lastCommand) && lastCommand.context === this._context) {
                lastCommand.undo();
                this._redoCommandsCallStack.push(lastCommand);
            }
        }
    }

    public redoLastCommand(): void {
        const lastCommand = this._redoCommandsCallStack.pop();
        if (lastCommand) {
            if (lastCommand.context === this._context) {
                lastCommand.exec();
                if (isUndoCommand(lastCommand)) {
                    this._undoCommandsCallStack.push(lastCommand);
                }
            }
        }
    }

    public addHotkeyExec(hotkey: EditorHotKey, exec: () => void): number {
        let hotkeys = this._hotkeys.get(hotkey);
        if (typeof hotkeys === "undefined") {
            this._hotkeys.set(hotkey, [exec]);
            return 0;
        }
        else {
            return hotkeys.push(exec) - 1;
        }
    }

    public removeHotkeyExec(hotkey: EditorHotKey, exec: () => void): void {
        let hotkeys = this._hotkeys.get(hotkey);
        if (typeof hotkeys !== "undefined") {
            let index = hotkeys.indexOf(exec);
            if (index >= 0) {
                hotkeys.splice(index, 1);
            }
            if (hotkeys.length === 0) {
                this._hotkeys.delete(hotkey);
            }
        }
    }
}

var editor: Editor = new EditorBase();