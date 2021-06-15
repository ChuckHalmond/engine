
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

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

const deg2Rad = function(deg: number): number {
	return DEG2RAD * deg;
}

const rad2Deg = function(rad: number): number {
	return RAD2DEG / rad;
}

const _bytes = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT);
const _floatView = new Float32Array(_bytes);
const _intView = new Uint32Array(_bytes);

const qSqrt = function(x: number) {
	const halfx = x * 0.5;

	_floatView[0] = x;
	_intView[0] = 0x5f3759df -(_intView[0] >> 1);

	let y = _floatView[0];
	y = y * (1.5 - (halfx * y * y));

	return y;
}

const pow2 = function(k: number): number {
	return 1 << k;
}
	
const inRange = function(x: number, min: number, max: number): boolean {
	return (min <= x) && (x <= max);
}

const clamp = function(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

const lerp = function(x: number, y: number, t: number): number {
	return (1 - t) * x + t * y;
}

const smoothstep = function(x: number, min: number, max: number): number {
	if (x <= min) return 0;
	if (x >= max) return 1;

	x = (x - min) / (max - min);

	return x * x * (3 - 2 * x);
}

const smootherstep = function(x: number, min: number, max: number): number {
	if (x <= min) return 0;
	if (x >= max) return 1;

	x = (x - min) / (max - min);

	return x * x * x * ( x * ( x * 6 - 15) + 10);
}

const randInt = function(low: number, high: number): number {
	return low + Math.floor(Math.random() * (high - low + 1));
}

const randFloat = function(low: number, high: number): number {
	return low + Math.random() * (high - low);
}

const randFloatSpread = function(range: number): number {
	return range * (0.5 - Math.random());
}

const degToRad = function(degrees: number): number {
	return degrees * DEG2RAD;
}

const radToDeg = function(radians: number): number {
	return radians * RAD2DEG;
}
const isPowerOfTwo = function(value: number): boolean {
	return (value & (value - 1)) === 0 && value !== 0;
}

const ceilPowerOfTwo = function(value: number): number {
	return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
}

const floorPowerOfTwo = function(value: number): number {
	return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
}