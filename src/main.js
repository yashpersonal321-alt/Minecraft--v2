import * as THREE from 'three';
import { Engine } from './core/Engine.js';
import { Physics } from './player/Physics.js';
import { World } from './world/World.js';
import { Player } from './player/Player.js';
import { Input } from './core/Input.js';
import { UI } from './ui/UI.js';

/**
 * MINECRAFT PRO CLONE - ENTRY POINT
 * यह फाइल सभी सिस्टम्स को इनिशियलाइज और सिंक करती है।
 */
class Game {
    constructor() {
        // 1. रिंडरिंग इंजन सेटअप (Three.js)
        this.engine = new Engine();
        
        // 2. फिजिक्स इंजन (Gravity & Collision)
        this.physics = new Physics();

        // 3. इनपुट सिस्टम (Keyboard + Mobile Touch)
        this.input = new Input();

        // 4. दुनिया का निर्माण (Chunks & Terrain)
        this.world = new World(this.engine.scene);

        // 5. प्लेयर और कैमरा कंट्रोल
        this.player = new Player(this.engine.camera, this.physics, this.world);

        // 6. यूजर इंटरफेस (HUD, Joystick, Crosshair)
        this.ui = new UI();

        // इवेंट्स और लूप शुरू करें
        this.initEventListeners();
        this.startLoop();
    }

    initEventListeners() {
        // विंडो रिसाइज हैंडलर (मोबाइल रोटेशन के लिए)
        window.addEventListener('resize', () => {
            this.engine.onResize(window.innerWidth, window.innerHeight);
        });

        // मोबाइल एक्शन बटन्स (Jump & Action)
        const jumpBtn = document.getElementById('jump-btn');
        if (jumpBtn) {
            jumpBtn.addEventListener('touchstart', () => this.player.jump());
        }
    }

    /**
     * मेन गेम लूप (60 FPS)
     */
    startLoop() {
        const update = () => {
            requestAnimationFrame(update);

            // A. फिजिक्स को एक स्टेप आगे बढ़ाएं
            this.physics.update();

            // B. इनपुट के आधार पर प्लेयर की पोजीशन अपडेट करें
            this.player.update(this.input);

            // C. अगर प्लेयर मूव कर रहा है, तो नए चंक्स लोड करें
            this.world.update(this.player.position);

            // D. सीन को रेंडर करें
            this.engine.render();
            
            // E. UI अपडेट करें (जैसे FPS या कोऑर्डिनेट्स)
            this.ui.updateHUD(this.player);
        };

        update();
    }
}

// गेम शुरू करें जब DOM लोड हो जाए
window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
