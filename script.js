// Escena, cámara y renderizador
const escena = new THREE.Scene();
const camara = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderizador = new THREE.WebGLRenderer();
renderizador.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderizador.domElement);

// Crear un cubo
const geometría = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cubo = new THREE.Mesh(geometría, material);
escena.add(cubo);

// Posicionar la cámara
camara.position.z = 5;

// Animación del cubo
function animacion() {
    requestAnimationFrame(animacion);
    cubo.rotation.x += 0.01;
    cubo.rotation.y += 0.01;
    renderizador.render(escena, camara);
}

animacion();
//saifhdgsdkjhfsdjklhfgsdljkhfgsd
// Ajustar el tamaño de la ventana al cambiar su tamaño
window.addEventListener('resize', () => {
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();
    renderizador.setSize(window.innerWidth, window.innerHeight);
});