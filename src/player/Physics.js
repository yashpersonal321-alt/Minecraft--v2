import * as CANNON from 'cannon-es';

export class Physics {
    constructor() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0); // असली पृथ्वी की तरह ग्रेविटी

        // प्लेयर की बॉडी (एक सिलेंडर जैसा)
        this.playerBody = new CANNON.Body({
            mass: 60, // किलोग्राम
            shape: new CANNON.Sphere(0.5),
            position: new CANNON.Vec3(8, 20, 8)
        });
        this.world.addBody(this.playerBody);
    }

    update() {
        this.world.fixedStep();
    }
}
