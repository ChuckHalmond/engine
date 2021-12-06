export { RandomNumberGenerator };
declare class RandomNumberGenerator {
    seed: number;
    m: number;
    a: number;
    c: number;
    xi: number;
    i: number;
    constructor(seed?: number, m?: number, a?: number, c?: number);
    reset(): void;
    random(): number;
    randomInRange(min: number, max: number): number;
}
