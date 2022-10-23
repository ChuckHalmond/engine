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
    LEFT = 0,
    WHEEL = 1,
    RIGHT = 2,
    FORWARD = 3,
    BACK = 4
}
declare class HotKey {
    readonly key: Key;
    readonly mod1?: KeyModifier;
    readonly mod2?: KeyModifier;
    constructor(key: Key, mod1?: KeyModifier, mod2?: KeyModifier);
    toString(): string;
    test(event: KeyboardEvent): boolean;
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
declare var Input: Input;
