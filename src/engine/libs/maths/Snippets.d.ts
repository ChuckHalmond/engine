export { deg2Rad };
export { rad2Deg };
export { qSqrt };
export { pow2 };
export { inRange };
export { clamp };
export { lerp };
export { smoothstep };
export { smootherstep };
export { randInt };
export { randFloat };
export { randFloatSpread };
export { degToRad };
export { radToDeg };
export { isPowerOfTwo };
export { ceilPowerOfTwo };
export { floorPowerOfTwo };
declare const deg2Rad: (deg: number) => number;
declare const rad2Deg: (rad: number) => number;
declare const qSqrt: (x: number) => number;
declare const pow2: (k: number) => number;
declare const inRange: (x: number, min: number, max: number) => boolean;
declare const clamp: (value: number, min: number, max: number) => number;
declare const lerp: (x: number, y: number, t: number) => number;
declare const smoothstep: (x: number, min: number, max: number) => number;
declare const smootherstep: (x: number, min: number, max: number) => number;
declare const randInt: (low: number, high: number) => number;
declare const randFloat: (low: number, high: number) => number;
declare const randFloatSpread: (range: number) => number;
declare const degToRad: (degrees: number) => number;
declare const radToDeg: (radians: number) => number;
declare const isPowerOfTwo: (value: number) => boolean;
declare const ceilPowerOfTwo: (value: number) => number;
declare const floorPowerOfTwo: (value: number) => number;
