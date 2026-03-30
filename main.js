import * as THREE from 'three';

// सेटअप
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
scene.fog = new THREE.Fog(0x87CEEB, 50, 100);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// लाइट्स
const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xfff5d1, 1);
sunLight.position.set(50, 100, 50);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 512;
sunLight.shadow.mapSize.height = 512;
scene.add(sunLight);

// ब्लॉक डेटा
const blocks = {
    grass: { color: 0x6b8c42, name: '🌿 Grass' },
    wood: { color: 0x8b5a2b, name: '🪵 Wood' },
    stone: { color: 0x808080, name: '🪨 Stone' },
    brick: { color: 0xb85c1a, name: '🧱 Brick' },
    diamond: { color: 0x4ec0e9, name: '💎 Diamond' }
};

let selectedBlock = 'grass';

// वर्ल्ड डेटा (सिंपल)
const world = new Map();
const renderDistance = 6;

function getBlockKey(x, y, z) {
    return `${x},${y},${z}`;
}

function setBlock(x, y, z, type) {
    const key = getBlockKey(x, y, z);
    if (type === 'air') {
        world.delete(key);
        const obj = blockObjects.get(key);
        if (obj) {
            scene.remove(obj);
            blockObjects.delete(key);
        }
    } else {
        world.set(key, type);
        updateBlockMesh(x, y, z, type);
    }
}

function getBlock(x, y, z) {
    return world.get(getBlockKey(x, y, z)) || 'air';
}

// ब्लॉक मेश
const blockObjects = new Map();

function updateBlockMesh(x, y, z, type) {
    const key = getBlockKey(x, y, z);
    const existing = blockObjects.get(key);
    if (existing) {
        scene.remove(existing);
        blockObjects.delete(key);
    }
    
    const color = blocks[type]?.color || 0x6b8c42;
    const geometry = new THREE.BoxGeometry(0.98, 0.98, 0.98);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
    blockObjects.set(key, cube);
}

// टेरेन जेनरेशन
function generateTerrain() {
    for (let x = -renderDistance; x <= renderDistance; x++) {
        for (let z = -renderDistance; z <= renderDistance; z++) {
            // सिंपल हाइट मैप
            const height = Math.floor(Math.sin(x * 0.3) * Math.cos(z * 0.3) * 3 + 4);
            
            for (let y = 0; y <= height; y++) {
                let blockType = 'stone';
                if (y === height) blockType = 'grass';
                else if (y >= height - 2) blockType = 'dirt';
                else blockType = 'stone';
                
                setBlock(x, y, z, blockType);
            }
            
            // पेड़
            if (height > 3 && Math.random() < 0.05) {
                const treeHeight = 3 + Math.floor(Math.random() * 2);
                for (let h = 1; h <= treeHeight; h++) {
                    setBlock(x, height + h, z, 'wood');
                }
                // पत्तियां
                for (let lx = -1; lx <= 1; lx++) {
                    for (let lz = -1; lz <= 1; lz++) {
                        if (Math.abs(lx) + Math.abs(lz) <= 2) {
                            setBlock(x + lx, height + treeHeight, z + lz, 'leaves');
                        }
                    }
                }
            }
        }
    }
}

// प्लेयर
let velocityY = 0;
let onGround = true;

function checkCollision(x, y, z) {
    const minX = Math.floor(x - 0.3);
    const maxX = Math.ceil(x + 0.3);
    const minY = Math.floor(y);
    const maxY = Math.ceil(y + 1.6);
    const minZ = Math.floor(z - 0.3);
    const maxZ = Math.ceil(z + 0.3);
    
    for (let ix = minX; ix <= maxX; ix++) {
        for (let iy = minY; iy <= maxY; iy++) {
            for (let iz = minZ; iz <= maxZ; iz++) {
                const block = getBlock(ix, iy, iz);
                if (block !== 'air' && block !== 'leaves') {
                    return true;
                }
            }
        }
    }
    return false;
}

// इनपुट
const keys = { forward: false, backward: false, left: false, right: false, jump: false };
let moveDir = { x: 0, z: 0 };
let mouseX = 0, mouseY = 0;
let pointerLock = false;

document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'KeyW': keys.forward = true; break;
        case 'KeyS': keys.backward = true; break;
        case 'KeyA': keys.left = true; break;
        case 'KeyD': keys.right = true; break;
        case 'Space': keys.jump = true; break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.code) {
        case 'KeyW': keys.forward = false; break;
        case 'KeyS': keys.backward = false; break;
        case 'KeyA': keys.left = false; break;
        case 'KeyD': keys.right = false; break;
        case 'Space': keys.jump = false; break;
    }
});

renderer.domElement.addEventListener('click', () => {
    renderer.domElement.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
    pointerLock = document.pointerLockElement === renderer.domElement;
});

document.addEventListener('mousemove', (e) => {
    if (!pointerLock) return;
    mouseX += e.movementX * 0.002;
    mouseY += e.movementY * 0.002;
    mouseY = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, mouseY));
    camera.rotation.order = 'YXZ';
    camera.rotation.y = mouseX;
    camera.rotation.x = mouseY;
});

// ब्लॉक प्लेस/ब्रेक
function getLookingAtBlock() {
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const start = camera.position.clone();
    
    for (let i = 0; i <= 8; i++) {
        const point = start.clone().add(direction.clone().multiplyScalar(i * 0.5));
        const bx = Math.floor(point.x);
        const by = Math.floor(point.y);
        const bz = Math.floor(point.z);
        
        const block = getBlock(bx, by, bz);
        if (block !== 'air') {
            return { x: bx, y: by, z: bz };
        }
    }
    return null;
}

document.getElementById('place-btn')?.addEventListener('click', () => {
    const hit = getLookingAtBlock();
    if (hit) {
        const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        const placeX = hit.x + Math.round(dir.x);
        const placeY = hit.y + Math.round(dir.y);
        const placeZ = hit.z + Math.round(dir.z);
        
        if (!checkCollision(placeX, placeY, placeZ)) {
            setBlock(placeX, placeY, placeZ, selectedBlock);
        }
    }
});

document.getElementById('break-btn')?.addEventListener('click', () => {
    const hit = getLookingAtBlock();
    if (hit) {
        setBlock(hit.x, hit.y, hit.z, 'air');
    }
});

// जंप
document.getElementById('jump-btn')?.addEventListener('click', () => {
    if (onGround) {
        velocityY = 5;
        onGround = false;
    }
});

// हॉटबार
document.querySelectorAll('.slot').forEach((slot, i) => {
    slot.addEventListener('click', () => {
        document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        selectedBlock = slot.dataset.block;
        const blockName = document.getElementById('block-name');
        if (blockName) blockName.innerText = blocks[selectedBlock]?.name || '🌿 Grass';
    });
});

// जॉयस्टिक
const joystick = document.getElementById('joystick');
const handle = document.getElementById('joystick-handle');
let joystickActive = false;
let joystickCenter = { x: 0, y: 0 };

joystick.addEventListener('touchstart', (e) => {
    e.preventDefault();
    joystickActive = true;
    const rect = joystick.getBoundingClientRect();
    joystickCenter = { x: rect.left + rect.width/2, y: rect.top + rect.height/2 };
});

joystick.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!joystickActive) return;
    const touch = e.touches[0];
    const dx = touch.clientX - joystickCenter.x;
    const dy = touch.clientY - joystickCenter.y;
    const dist = Math.min(40, Math.hypot(dx, dy));
    const angle = Math.atan2(dy, dx);
    const offsetX = Math.cos(angle) * dist;
    const offsetY = Math.sin(angle) * dist;
    handle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    moveDir = { x: dx / 40, z: dy / 40 };
});

joystick.addEventListener('touchend', () => {
    joystickActive = false;
    handle.style.transform = 'translate(0px, 0px)';
    moveDir = { x: 0, z: 0 };
});

// गेम लूप
let health = 20;
let lastTime = performance.now();

function update() {
    const now = performance.now();
    let dt = Math.min(0.033, (now - lastTime) / 1000);
    lastTime = now;
    
    // मूवमेंट
    let dx = 0, dz = 0;
    if (keys.forward || moveDir.z < 0) dz -= 1;
    if (keys.backward || moveDir.z > 0) dz += 1;
    if (keys.left || moveDir.x < 0) dx -= 1;
    if (keys.right || moveDir.x > 0) dx += 1;
    
    if (dx !== 0 || dz !== 0) {
        const len = Math.hypot(dx, dz);
        dx /= len;
        dz /= len;
    }
    
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    forward.y = 0;
    right.y = 0;
    forward.normalize();
    right.normalize();
    
    let newX = camera.position.x + (forward.x * dz + right.x * dx) * 5 * dt;
    let newZ = camera.position.z + (forward.z * dz + right.z * dx) * 5 * dt;
    
    if (!checkCollision(newX, camera.position.y, camera.position.z)) {
        camera.position.x = newX;
    }
    if (!checkCollision(camera.position.x, camera.position.y, newZ)) {
        camera.position.z = newZ;
    }
    
    // ग्रेविटी
    velocityY -= 20 * dt;
    let newY = camera.position.y + velocityY * dt;
    
    if (checkCollision(camera.position.x, newY, camera.position.z)) {
        if (velocityY < 0) {
            newY = Math.floor(camera.position.y);
            velocityY = 0;
            onGround = true;
        } else {
            velocityY = 0;
        }
    } else {
        onGround = false;
    }
    camera.position.y = newY;
    
    if (keys.jump && onGround) {
        velocityY = 5;
        onGround = false;
        keys.jump = false;
    }
    
    // कॉर्डिनेट्स अपडेट
    const coordsEl = document.getElementById('coords');
    if (coordsEl) {
        coordsEl.innerText = `X: ${Math.floor(camera.position.x)}, Y: ${Math.floor(camera.position.y)}, Z: ${Math.floor(camera.position.z)}`;
    }
    
    // हेल्थ
    const healthEl = document.getElementById('health');
    if (healthEl) healthEl.innerText = `❤️ ${Math.floor(health)}`;
    
    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

// शुरू करें
generateTerrain();
update();

console.log('✅ Game Started!');
