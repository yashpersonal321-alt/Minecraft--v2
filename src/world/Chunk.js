import * as THREE from 'three';

export class Chunk {
    constructor(size, x, z) {
        this.size = size;
        this.x = x;
        this.z = z;
        this.mesh = null;
    }

    generateMesh(scene) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x55aa55 });
        
        // InstancedMesh का उपयोग - बहुत सारे ब्लॉक्स के लिए बेस्ट परफॉरमेंस
        this.mesh = new THREE.InstancedMesh(geometry, material, this.size * this.size * 5);
        
        let i = 0;
        const matrix = new THREE.Matrix4();
        for(let x=0; x<this.size; x++) {
            for(let z=0; z<this.size; z++) {
                matrix.setPosition(this.x + x, 0, this.z + z);
                this.mesh.setMatrixAt(i++, matrix);
            }
        }
        scene.add(this.mesh);
    }
}
