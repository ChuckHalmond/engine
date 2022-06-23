export { RandomNumberGenerator };

class RandomNumberGenerator {
    seed: number;
    m: number;
    a: number;
    c: number;
    xi: number;
    i: number;

    constructor(seed: number = 12, m: number = Math.pow(2, 64), a: number = 6364136223846793005, c: number = 1442695040888963407) {
        this.m = m;
        this.a = a;
        this.c = c;
        
        this.xi = this.seed = seed;
        this.i = 0;
    }

    reset(): void {
        this.xi = this.seed;
        this.i = this.i + 1;
    }

    random(): number {
        this.xi = (this.a * this.xi + this.c) % this.m;
        this.i = this.i + 1;

        const normalizedXi = this.xi / this.m;
        return normalizedXi;
    }

    randomInRange(min: number, max: number): number {
        return this.random() * (max - min) + min;
    }
}
