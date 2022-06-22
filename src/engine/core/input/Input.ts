import { Vector2 } from "../../libs/maths/algebra/vectors/Vector2";

export { Key };
export { KeyModifier };
export { HotKey };
export { MouseButton };
export { Input };

enum Key {
    A = "a",
    B = "b",
    C = "c",
    D = "d",
    E = "e",
    F = "f",
    G = "g",
    H = "h",
    I = "i",
    J = "j",
    K = "k",
    L = "l",
    M = "m",
    O = "o",
    P = "p",
    Q = "q",
    R = "r",
    S = "s",
    T = "t",
    U = "u",
    V = "v",
    W = "w",
    X = "x",
    Y = "y",
    Z = "z",
    ENTER = "Enter",
    BACKSPACE = "Backspace",
    ARROW_DOWN = "ArrowDown",
    ARROW_LEFT = "ArrowLeft",
    ARROW_RIGHT = "ArrowRight",
    ARROW_UP = "ArrowUp",
    SHIFT = "Shift"
}

const KEYS_COUNT = Object.keys(Key).length;

enum KeyModifier {
    Alt = "Alt",
    Control = "Control",
    Shift = "Shift",
}

function displayKeyModifier(mode: KeyModifier): string {
    switch (mode) {
        case KeyModifier.Control:
            return "Ctrl";
        default:
            return mode;
    }
}

enum MouseButton {
    LEFT = 0,
    WHEEL = 1,
    RIGHT = 2,
    FORWARD = 3,
    BACK = 4
}

const MOUSE_BUTTONS_COUNT = Object.keys(MouseButton).length;

const MOUSE_BUTTONS_INDICES = Object.freeze(
    Object.values(MouseButton).reduce(
        (map, button, index) => Object.assign(map, {[button]: index}), {} as any
    )
);

const KEYS_INDICES = Object.freeze(
    Object.values(Key).reduce(
        (map, key, index) => Object.assign(map, {[key]: index}), {} as any
    )
);

const INPUT_EVENT_UP = 0;
const INPUT_EVENT_DOWN = 1;
const INPUT_EVENT_REPEAT = 2;

const testKeyModifier = (mod: KeyModifier, event: KeyboardEvent) => {
    switch (mod) {
        case "Alt":
            return event.altKey;
        case "Control":
            return event.ctrlKey;
        case "Shift":
            return event.shiftKey;
        default:
            return () => true;
    }
}

class HotKey {

    public readonly key: Key;
    public readonly mod1?: KeyModifier;
    public readonly mod2?: KeyModifier;

    constructor(key: Key, mod1?: KeyModifier, mod2?: KeyModifier) {
        this.key = key;
        this.mod1 = mod1;
        this.mod2 = mod2;
    }

    public toString(): string {
        return `${this.mod1 ? `${displayKeyModifier(this.mod1)}+` : ''}${this.mod2 ? `${displayKeyModifier(this.mod2)}+` : ''}${(this.key.length === 1) ? this.key.toUpperCase() : this.key}`;
    }

    /*public static fromString(str: string): HotKey | null {
        const keys = Object.values(Key);
        const keyModifiers = Object.values(KeyModifier);

        let key: Key;
        let mod1: KeyModifier | undefined;
        let mod2: KeyModifier | undefined;

        const keysStr = str.split(' + ');
        if (keysStr.length >= 1) {
            key = keysStr[0] as Key;
            if (!keys.indexOf(key)) {
                return null;
            }
            if (keysStr.length >= 2) {
                mod1 = keysStr[1] as KeyModifier;
                if (!keyModifiers.indexOf(mod1)) {
                    return null;
                }
            }
            if (keysStr.length >= 3) {
                mod2 = keysStr[2] as KeyModifier;
                if (!keyModifiers.indexOf(mod2)) {
                    return null;
                }
            }
            return new HotKey(key, mod1, mod2);
        }
        return null;
    }*/

    public test(event: KeyboardEvent): boolean {
        return ((!this.mod1 || testKeyModifier(this.mod1, event)) && (!this.mod2 || testKeyModifier(this.mod2, event)) && event.key === this.key);
    }
}

interface Input {
    initialize(canvas: HTMLCanvasElement): void;
    clear(): void;
    getKey(key: Key): boolean;
    getKeyUp(key: Key): boolean;
    getKeyDown(key: Key): boolean;
    getMouseButton(button: MouseButton): boolean;
    getPointerPosition(): Vector2;
    getPointerScreenPosition(): Vector2;
    getWheelDelta(): number;
    getMouseButtonDown(button: MouseButton): boolean;
    getMouseButtonUp(button: MouseButton): boolean;
}

class InputBase implements Input {
    private readonly keyFlags = new Array<boolean>(3 * KEYS_COUNT).fill(false);
    private readonly mouseFlags = new Array<boolean>(3 * MOUSE_BUTTONS_COUNT).fill(false);
    private readonly pointerPosition = new Vector2();
    private wheelDelta = 0;
    private canvas: HTMLCanvasElement | null = null;
    private canvasRectangle: DOMRect | null = null;

    public initialize(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this.canvasRectangle = canvas.getBoundingClientRect();
        canvas.addEventListener("pointerdown", this);
        canvas.addEventListener("pointerup", this);
        canvas.addEventListener("contextmenu", this);
        canvas.addEventListener("pointermove", this);
        canvas.addEventListener("wheel", this);
        canvas.addEventListener("keydown", this);
        canvas.addEventListener("keyup", this);
        canvas.addEventListener("focusout", this);
    }

    public getCanvasRect(): DOMRect {
        const rect = this.canvasRectangle;
        if (rect === null) {
            throw new Error(`Input manager not initialized.`);
        }
        return rect;
    }

    public clear(): void {
        this.keyFlags.fill(false, 0, INPUT_EVENT_REPEAT * KEYS_COUNT);
        this.mouseFlags.fill(false, 0, INPUT_EVENT_REPEAT * MOUSE_BUTTONS_COUNT);
        this.wheelDelta = 0;
    }
    
    public handleEvent(event: Event): void {
        let eventIndex = -1;
        switch (event.type) {
            case "pointerdown":
                eventIndex = MOUSE_BUTTONS_INDICES[(event as MouseEvent).button as MouseButton];
                this.mouseFlags[INPUT_EVENT_DOWN * MOUSE_BUTTONS_COUNT + eventIndex] = true;
                this.mouseFlags[INPUT_EVENT_REPEAT * MOUSE_BUTTONS_COUNT + eventIndex] = true;
                break;
            case "pointerup":
                eventIndex = MOUSE_BUTTONS_INDICES[(event as MouseEvent).button as MouseButton];
                this.mouseFlags[INPUT_EVENT_UP * MOUSE_BUTTONS_COUNT + eventIndex] = true;
                this.mouseFlags[INPUT_EVENT_REPEAT * MOUSE_BUTTONS_COUNT + eventIndex] = false;
                break;
            case "pointermove":
                const canvasRect = this.getCanvasRect();
                this.pointerPosition.setValues([
                    ((event as MouseEvent).clientX - canvasRect.left),
                    ((event as MouseEvent).clientY - canvasRect.top),
                ]);
                break;
            case "wheel":
                this.wheelDelta = (event as WheelEvent).deltaY / 100;
                break;
            case "keydown":
                eventIndex = KEYS_INDICES[(event as KeyboardEvent).key as Key];
                this.keyFlags[INPUT_EVENT_DOWN * KEYS_COUNT + eventIndex] = true;
                this.keyFlags[INPUT_EVENT_REPEAT * KEYS_COUNT + eventIndex] = true;
                break;
            case "keyup":
                eventIndex = KEYS_INDICES[(event as KeyboardEvent).key as Key];
                this.keyFlags[INPUT_EVENT_UP * KEYS_COUNT + eventIndex] = true;
                this.keyFlags[INPUT_EVENT_REPEAT * KEYS_COUNT + eventIndex] = false;
                break;
            case "focusout":
                this.keyFlags.fill(false);
                this.mouseFlags.fill(false);
                this.wheelDelta = 0;
                this.pointerPosition.setZeros();
                break;
        }
    }
    
    /*public static getAxis(axisName: string) {

    }

    public static getButton(buttonName: string) {

    }

    public static getButtonUp(buttonName: string) {

    }

    public static getButtonDown(buttonName: string) {

    }*/

    public getKey(key: Key): boolean {
        return this.keyFlags[INPUT_EVENT_REPEAT * KEYS_COUNT + KEYS_INDICES[key]];
    }

    public getKeyUp(key: Key): boolean {
        return this.keyFlags[INPUT_EVENT_UP * KEYS_COUNT + KEYS_INDICES[key]];
    }

    public getKeyDown(key: Key): boolean {
        return this.keyFlags[INPUT_EVENT_DOWN * KEYS_COUNT + KEYS_INDICES[key]];
    }

    public getMouseButton(button: MouseButton): boolean {
        return this.mouseFlags[INPUT_EVENT_REPEAT * MOUSE_BUTTONS_COUNT + MOUSE_BUTTONS_INDICES[button]];
    }

    public getPointerPosition(): Vector2 {
        return this.pointerPosition.clone();
    }

    public getPointerScreenPosition(): Vector2 {
        const positionAray = this.pointerPosition.array;
        const canvasRect = this.getCanvasRect();
        const x = (positionAray[0] / canvasRect.width) * 2 - 1;
        const y = (positionAray[1] / canvasRect.height) * 2 - 1;
        return new Vector2([x, y]);
    }

    public getWheelDelta(): number {
        return this.wheelDelta;
    }

    public getMouseButtonDown(button: MouseButton): boolean {
        return this.mouseFlags[INPUT_EVENT_DOWN * MOUSE_BUTTONS_COUNT + MOUSE_BUTTONS_INDICES[button]];
    }

    public getMouseButtonUp(button: MouseButton): boolean {
        return this.mouseFlags[INPUT_EVENT_UP * MOUSE_BUTTONS_COUNT + MOUSE_BUTTONS_INDICES[button]];
    }
}

var Input: Input = new InputBase();