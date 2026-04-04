import * as THREE from 'three';

export class Player {
    constructor(camera, physics, world) {
        this.camera = camera;
        this.physics = physics;
        this.world = world;
        this.position = new THREE.Vector3(8, 20, 8); // शुरुआती पोजीशन
        this.velocity = new THREE.Vector3();
        this.speed = 0.15;
    }

    update(input) {
        // 1. कैमरा की दिशा के हिसाब से मूवमेंट कैलकुलेट करना
        const direction = new THREE.Vector3();
        const frontVector = new THREE.Vector3(0, 0, -input.move.forward);
        const sideVector = new THREE.Vector3(input.move.right, 0, 0);

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(this.speed)
            .applyQuaternion(this.camera.quaternion);

        // 2. फिजिक्स बॉडी को मूव करना (ग्रेविटी का ध्यान रखते हुए)
        this.physics.playerBody.velocity.x = direction.x * 50;
        this.physics.playerBody.velocity.z = direction.z * 50;

        if (input.isJumping && Math.abs(this.physics.playerBody.velocity.y) < 0.1) {
            this.physics.playerBody.velocity.y = 5; // जम्प की ताकत
        }

        // 3. कैमरा को फिजिक्स बॉडी के साथ सिंक करना
        this.position.copy(this.physics.playerBody.position);
        this.camera.position.set(this.position.x, this.position.y + 1.5, this.position.z);
    }

    jump() {
        // मोबाइल बटन के लिए अलग फंक्शन
        if (Math.abs(this.physics.playerBody.velocity.y) < 0.1) {
            this.physics.playerBody.velocity.y = 5;
        }
    }
}
