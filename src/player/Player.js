import * as THREE from 'three';

export class Player {
    constructor(camera, physics) {
        this.camera = camera;
        this.physics = physics;
        this.speed = 5;
    }

    update(input) {
        const body = this.physics.playerBody;
        
        // जॉयस्टिक या कीबोर्ड से मूवमेंट
        if (input.touch.active) {
            body.velocity.x = input.touch.x * this.speed;
            body.velocity.z = input.touch.y * this.speed;
        }

        // कैमरा को फिजिक्स बॉडी के ऊपर रखें
        this.camera.position.copy(body.position);
        this.camera.position.y += 1.5; // आँखों की ऊंचाई
    }
}
