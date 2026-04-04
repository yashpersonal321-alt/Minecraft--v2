import * as THREE from 'three';
import { Input } from './core/Input.js';
import { Chunk } from './world/Chunk.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const input = new Input();
const chunk = new Chunk(16, 0, 0);
chunk.generateMesh(scene);

camera.position.set(8, 10, 20);
camera.lookAt(8, 0, 8);

function animate() {
    requestAnimationFrame(animate);
    
    // Mobile Movement Logic
    if(input.touch.active) {
        camera.position.z += input.touch.y * 0.1;
        camera.position.x += input.touch.x * 0.1;
    }

    renderer.render(scene, camera);
}
animate();
