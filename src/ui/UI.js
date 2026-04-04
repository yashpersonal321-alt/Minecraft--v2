/**
 * UI CLASS
 * यह मोबाइल के कंट्रोल बटन्स और गेम के HUD (Heads-Up Display) को मैनेज करता है।
 */
export class UI {
    constructor() {
        this.initHUD();
        this.fpsContainer = document.getElementById('fps-counter');
        this.lastTime = performance.now();
        this.frames = 0;
    }

    initHUD() {
        // अगर HTML में बटन्स नहीं हैं, तो उन्हें यहाँ से भी बनाया जा सकता है
        // फिलहाल हम index.html के बटन्स का इस्तेमाल करेंगे।
        console.log("UI Initialized: Mobile Controls Ready.");
    }

    /**
     * FPS काउंटर अपडेट करना (प्रोफेशनल टच)
     */
    updateHUD(player) {
        this.frames++;
        const time = performance.now();
        
        if (time >= this.lastTime + 1000) {
            const fps = Math.round((this.frames * 1000) / (time - this.lastTime));
            // स्क्रीन पर FPS और प्लेयर के कोऑर्डिनेट्स दिखाना
            // document.getElementById('info').innerText = `FPS: ${fps} | X: ${player.position.x.toFixed(1)} Z: ${player.position.z.toFixed(1)}`;
            this.frames = 0;
            this.lastTime = time;
        }
    }
}
