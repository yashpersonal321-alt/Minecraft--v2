export class Input {
    constructor() {
        // मूवमेंट की दिशा (-1 से 1 के बीच)
        this.move = { forward: 0, right: 0 };
        this.keys = {};
        this.isJumping = false;

        // कीबोर्ड सपोर्ट
        window.addEventListener('keydown', (e) => this.onKey(e.code, true));
        window.addEventListener('keyup', (e) => this.onKey(e.code, false));

        // मोबाइल जॉयस्टिक (टच इवेंट्स)
        this.initJoystick();
    }

    onKey(code, isDown) {
        this.keys[code] = isDown;
        this.updateMoveFromKeys();
    }

    updateMoveFromKeys() {
        this.move.forward = (this.keys['KeyW'] || this.keys['ArrowUp'] ? 1 : 0) - (this.keys['KeyS'] || this.keys['ArrowDown'] ? 1 : 0);
        this.move.right = (this.keys['KeyD'] || this.keys['ArrowRight'] ? 1 : 0) - (this.keys['KeyA'] || this.keys['ArrowLeft'] ? 1 : 0);
        this.isJumping = this.keys['Space'];
    }

    initJoystick() {
        const joy = document.getElementById('joystick');
        if (!joy) return;

        joy.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = joy.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // जॉयस्टिक की दिशा का हिसाब (Normalized -1 to 1)
            this.move.right = (touch.clientX - centerX) / (rect.width / 2);
            this.move.forward = -(touch.clientY - centerY) / (rect.height / 2);

            // लिमिट सेट करना
            this.move.right = Math.max(-1, Math.min(1, this.move.right));
            this.move.forward = Math.max(-1, Math.min(1, this.move.forward));
        });

        joy.addEventListener('touchend', () => {
            this.move.forward = 0;
            this.move.right = 0;
        });
    }
}
