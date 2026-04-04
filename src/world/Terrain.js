import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();

export class Terrain {
    constructor() {
        this.seed = Math.random();
    }

    getHeight(x, z) {
        // यह पहाड़ों की ऊंचाई तय करता है
        let h = noise2D(x / 30, z / 30) * 8; // बड़े पहाड़
        h += noise2D(x / 10, z / 10) * 2;    // छोटी बारीकियां
        return Math.floor(h + 10);
    }
}
