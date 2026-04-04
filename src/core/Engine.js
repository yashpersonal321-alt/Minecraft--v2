import * as THREE from 'three';

/**
 * ENGINE CLASS
 * यह Three.js के रेंडरर, सीन, लाइटिंग और कैमरा को मैनेज करता है।
 * यह मोबाइल के हाई-रेजोल्यूशन (Retina Display) को भी सपोर्ट करता है।
 */
export class Engine {
    constructor() {
        // 1. सीन (The World Container)
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // माइनक्राफ्ट का नीला आसमान
        
        // 2. फॉग (Fog) - दूर के ब्लॉक्स को धीरे-धीरे धुंधला दिखाने के लिए (प्रोफेशनल लुक)
        this.scene.fog = new THREE.Fog(0x87CEEB, 20, 100);

        // 3. कैमरा सेटअप
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );

        // 4. रेंडरर (The Drawing Engine)
        this.renderer = new THREE.WebGLRenderer({
            antialias: true, // किनारों को स्मूथ रखने के लिए
            powerPreference: "high-performance" // मोबाइल पर GPU का इस्तेमाल बढ़ाने के लिए
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // मोबाइल बैटरी बचाने के लिए 2x तक सीमित
        this.renderer.shadowMap.enabled = true; // परछाई (Shadows) इनेबल करना
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // HTML में रेंडरर जोड़ना
        document.body.appendChild(this.renderer.domElement);

        // 5. लाइटिंग (Sun & Ambient Light)
        this.initLights();
    }

    initLights() {
        // एम्बिएंट लाइट: पूरे सीन को थोड़ी रौशनी देने के लिए
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // सूरज की रौशनी (Directional Light)
        this.sun = new THREE.DirectionalLight(0xffffff, 1.0);
        this.sun.position.set(50, 100, 50);
        this.sun.castShadow = true;

        // शैडो सेटिंग्स (प्रोफेशनल क्वालिटी के लिए)
        this.sun.shadow.mapSize.width = 1024;
        this.sun.shadow.mapSize.height = 1024;
        this.sun.shadow.camera.near = 0.5;
        this.sun.shadow.camera.far = 500;

        this.scene.add(this.sun);
    }

    /**
     * स्क्रीन साइज बदलने पर (जैसे मोबाइल रोटेट करने पर) कैमरा और रेंडरर अपडेट करना
     */
    onResize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /**
     * फाइनल सीन को स्क्रीन पर ड्रा करना
     */
    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
