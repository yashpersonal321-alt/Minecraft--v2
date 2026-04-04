export class Input {
    constructor() {
        this.keys = {};
        this.touch = { x: 0, y: 0, active: false };
        
        // Keyboard
        window.addEventListener('keydown', (e) => this.keys[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key.toLowerCase()] = false);

        // Mobile Touch (Joystick Logic)
        const joy = document.getElementById('joystick');
        joy.addEventListener('touchstart', (e) => { this.touch.active = true; });
        joy.addEventListener('touchmove', (e) => {
            const t = e.touches[0];
            this.touch.x = (t.clientX - 50) / 50; // Normalize
            this.touch.y = (t.clientY - window.innerHeight + 100) / 50;
        });
        joy.addEventListener('touchend', () => { 
            this.touch.active = false; 
            this.touch.x = 0; this.touch.y = 0;
        });
    }
}
