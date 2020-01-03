const seedrandom = require('seedrandom');

export default class Random {
  private prng: seedrandom.prng;

  public readonly seed: string;

  constructor(seed: string) {
    this.seed = seed;

    this.prng = seedrandom(seed);
  }

  integer(min: number, max: number) {
    return Math.floor(this.prng() * (max - min + 1) + min);
  }

  pickone<T>(arr: T[]): T {
    return arr[this.integer(0, arr.length - 1)];
  }
}
