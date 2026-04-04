import * as THREE from 'three';
import { Chunk } from './Chunk.js';

export class World {
    constructor(scene) {
        this.scene = scene;
        this.chunks = [];
        this.init();
    }

    init() {
        // एक 3x3 चंक्स का एरिया बनाना (ताकि प्लेयर गिर न जाए)
        for (let x = -1; x <= 1; x++) {
            for (let z = -1; z <= 1; z++) {
                const chunk = new Chunk(16, x * 16, z * 16);
                chunk.generateMesh(this.scene);
                this.chunks.push(chunk);
            }
        }
    }

    update(playerPosition) {
        // भविष्य में यहाँ 'Infinite Terrain' का लॉजिक आएगा
    }
}
