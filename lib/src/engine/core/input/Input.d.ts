import { Vector2 } from "../../libs/maths/algebra/vectors/Vector2";
export { Key };
export { KeyModifier };
export { HotKey };
export { MouseButton };
export { Input };
declare enum Key {
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
declare enum KeyModifier {
    Alt = "Alt",
    Control = "Control",
    Shift = "Shift"
}
declare enum MouseButton {
    LEFT = 1,
    WHEEL = 2,
    RIGHT = 3,
    FORWARD = 4,
    BACK = 5
}
declare class HotKey {
    readonly key: Key;
    readonly mod1?: KeyModifier;
    readonly mod2?: KeyModifier;
    constructor(key: Key, mod1?: KeyModifier, mod2?: KeyModifier);
    toString(): string;
    test(event: KeyboardEvent): boolean;
}
declare class Input {
    private static readonly keysCount;
    private static readonly mouseButtonsCount;
    private static readonly keyFlags;
    private static readonly mouseFlags;
    private static readonly mousePos;
    private static wheelDelta;
    static clear(): void;
    private static initializePointerHandlers;
    private static initializeKeyboardHandlers;
    static initialize(elem: HTMLElement): void;
    static getKey(key: Key): boolean;
    static getKeyUp(key: Key): boolean;
    static getKeyDown(key: Key): boolean;
    static getMouseButton(button: MouseButton): boolean;
    static getMouseButtonPosition(): Vector2;
    static getWheelDelta(): number;
    static getMouseButtonDown(button: MouseButton): boolean;
    static getMouseButtonUp(button: MouseButton): boolean;
}
