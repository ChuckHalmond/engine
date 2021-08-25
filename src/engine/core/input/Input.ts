import { Vector2 } from "engine/libs/maths/algebra/vectors/Vector2";

export { Key };
export { KeyModifier };
export { HotKey };
export { MouseButton };
export { Input };

enum Key {
    A = 'a',
    B = 'b',
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
    LEFT = 1,
    WHEEL = 2,
    RIGHT = 3,
    FORWARD = 4,
    BACK = 5
}

const BUTTONS_MAP: Array<MouseButton> = [
    MouseButton.LEFT, MouseButton.WHEEL, MouseButton.RIGHT, MouseButton.BACK, MouseButton.FORWARD
];

const KEYS_INDICES = Object.values(Key).reduce(
    (map, key, index) => {
        map[key] = index;
        return map;
    },
    {} as any
);

const INPUT_EVENT: List<number> = {
    "DOWN": 0,
    "REPEAT": 1,
    "UP": 2
};

const testKeyModifier = (mod: KeyModifier, event: KeyboardEvent) => {
    switch (mod) {
        case 'Alt':
            return event.altKey;
        case 'Control':
            return event.ctrlKey;
        case 'Shift':
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

class Input {
    
    private static readonly keysCount = Object.keys(Key).length;
    private static readonly mouseButtonsCount = Object.keys(MouseButton).length;

    private static readonly keyFlags = new Array<boolean>(Object.keys(INPUT_EVENT).length * Input.keysCount);
    private static readonly mouseFlags = new Array<boolean>(Object.keys(INPUT_EVENT).length * Input.mouseButtonsCount);

    private static readonly mousePos = new Vector2();
    private static wheelDelta = 0;

    public static clear() {
        this.keyFlags.fill(false);

        // Keeps the INPUT_EVENT.REPEAT section values
        this.mouseFlags.fill(false, INPUT_EVENT.DOWN * this.mouseButtonsCount, INPUT_EVENT.REPEAT * this.mouseButtonsCount);
        this.mouseFlags.fill(false, INPUT_EVENT.UP * this.mouseButtonsCount);

        this.wheelDelta = 0;
    }

    private static initializePointerHandlers(element: HTMLElement) {
        element.addEventListener('pointerdown', (event: MouseEvent) => {
            this.mouseFlags[INPUT_EVENT.DOWN * this.mouseButtonsCount + BUTTONS_MAP[event.button]] = true;
            this.mouseFlags[INPUT_EVENT.REPEAT * this.mouseButtonsCount + BUTTONS_MAP[event.button]] = true;
            /*if (document.activeElement === element) {
                event.preventDefault();
            }*/
        });

        element.addEventListener('pointerup', (event: MouseEvent) => {
            this.mouseFlags[INPUT_EVENT.REPEAT * this.mouseButtonsCount + BUTTONS_MAP[event.button]] = false;
            this.mouseFlags[INPUT_EVENT.UP * this.mouseButtonsCount + BUTTONS_MAP[event.button]] = true;
        });

        element.addEventListener('contextmenu', (event: MouseEvent) => {
            event.preventDefault();
        });

        element.addEventListener('pointermove', (event: MouseEvent) => {
            this.mousePos.setValues([(event.offsetX / element.clientWidth) - 0.5, (event.offsetY / element.clientHeight) - 0.5]);
        });

        element.addEventListener('wheel', (event: WheelEvent) => {
            this.wheelDelta = Math.min(event.deltaY, 1000) / 1000;
        }, {passive: true});
    }

    private static initializeKeyboardHandlers(element: HTMLElement) {
        element.addEventListener('keydown', (event: KeyboardEvent) => {
            this.keyFlags[(!event.repeat ? INPUT_EVENT.DOWN : INPUT_EVENT.REPEAT) * this.keysCount + KEYS_INDICES[event.key as Key]] = true;
        });

        element.addEventListener('keyup', (event: KeyboardEvent) => {
            this.keyFlags[INPUT_EVENT.UP * this.keysCount + KEYS_INDICES[event.key as Key]] = true;
            this.keyFlags[INPUT_EVENT.DOWN * this.keysCount + KEYS_INDICES[event.key as Key]] = false;
            this.keyFlags[INPUT_EVENT.REPEAT * this.keysCount + KEYS_INDICES[event.key as Key]] = false;
        });
    }

    public static initialize(elem: HTMLElement) {
        this.initializePointerHandlers(elem);
        this.initializeKeyboardHandlers(elem);
    }

    /*public static getAxis(axisName: string) {

    }

    public static getButton(buttonName: string) {

    }

    public static getButtonUp(buttonName: string) {

    }

    public static getButtonDown(buttonName: string) {

    }*/

    public static getKey(key: Key): boolean {
        return this.keyFlags[INPUT_EVENT.REPEAT * this.keysCount + KEYS_INDICES[key]];
    }

    public static getKeyUp(key: Key): boolean {
        return this.keyFlags[INPUT_EVENT.UP * this.keysCount + KEYS_INDICES[key]];
    }

    public static getKeyDown(key: Key): boolean {
        return this.keyFlags[INPUT_EVENT.DOWN * this.keysCount + KEYS_INDICES[key]];
    }

    public static getMouseButton(button: MouseButton): boolean {
        return this.mouseFlags[INPUT_EVENT.REPEAT * this.mouseButtonsCount + button];
    }

    public static getMouseButtonPosition(): Vector2 {
        return this.mousePos;
    }

    public static getWheelDelta(): number {
        return this.wheelDelta;
    }

    public static getMouseButtonDown(button: MouseButton): boolean {
        return this.mouseFlags[INPUT_EVENT.DOWN * this.mouseButtonsCount + button];
    }

    public static getMouseButtonUp(button: MouseButton): boolean {
        return this.mouseFlags[INPUT_EVENT.UP * this.mouseButtonsCount + button];
    }
}