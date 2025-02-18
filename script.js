// Configuración básica
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0.9);
document.body.appendChild(renderer.domElement);

// Configuración de efectos visuales
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Iluminación avanzada
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x00ffff, 1, 100);
pointLight1.position.set(5, 5, 5);
pointLight1.castShadow = true;
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xff00ff, 1, 100);
pointLight2.position.set(-5, -5, 5);
pointLight2.castShadow = true;
scene.add(pointLight2);

// Crear geometría principal
const icosahedronGeometry = new THREE.IcosahedronGeometry(2, 1);
const icosahedronMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x00ffff,
    wireframe: true,
    wireframeLinewidth: 2,
    wireframeLinecap: 'round',
    wireframeLinejoin: 'round',
    transparent: true,
    opacity: 0.8,
    shininess: 100
});

const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
icosahedron.castShadow = true;
icosahedron.receiveShadow = true;
scene.add(icosahedron);

// Crear partículas de fondo
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 20000;
const posArray = new Float32Array(particlesCount * 5);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x00ffff,
    transparent: true,
    opacity: 0.5
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Posicionar cámara
camera.position.z = 8;

// Variables de control
let time = 0;
let isRotating = true;
const colors = [0x00ffff, 0xff00ff, 0xffff00, 0x00ff00, 0xff0000];
let currentColorIndex = 0;

// Mostrar título con fade in
setTimeout(() => {
    document.getElementById('info').style.opacity = '1';
}, 500);

// Controles de interfaz
document.getElementById('toggleWireframe').addEventListener('click', () => {
    icosahedronMaterial.wireframe = !icosahedronMaterial.wireframe;
});

document.getElementById('changeColor').addEventListener('click', () => {
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    icosahedronMaterial.color.setHex(colors[currentColorIndex]);
    particlesMaterial.color.setHex(colors[currentColorIndex]);
});

document.getElementById('toggleRotation').addEventListener('click', () => {
    isRotating = !isRotating;
});

// Interactividad con el mouse
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Función de animación mejorada
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    if (isRotating) {
        // Rotación principal
        icosahedron.rotation.x = time * 0.5;
        icosahedron.rotation.y = time * 0.75;
        
        // Efecto de "respiración" con escala
        const breathingScale = 1 + Math.sin(time * 2) * 0.1;
        icosahedron.scale.set(breathingScale, breathingScale, breathingScale);
        
        // Movimiento orbital suave
        icosahedron.position.x = Math.sin(time) * 0.5;
        icosahedron.position.y = Math.cos(time * 1.5) * 0.5;
    }

    // Interactividad con el mouse
    icosahedron.rotation.x += mouseY * 0.01;
    icosahedron.rotation.y += mouseX * 0.01;

    // Animación de partículas
    particlesMesh.rotation.x = time * 0.1;
    particlesMesh.rotation.y = time * 0.15;

    // Animación de luces
    pointLight1.position.x = Math.sin(time) * 5;
    pointLight1.position.y = Math.cos(time) * 5;
    pointLight2.position.x = Math.sin(time + Math.PI) * 5;
    pointLight2.position.y = Math.cos(time + Math.PI) * 5;

    renderer.render(scene, camera);
}

// Manejar redimensionamiento de ventana
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// Iniciar animación
animate();