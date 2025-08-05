import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
camera.position.set(4, 3.2, 3.5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(400, 400);
renderer.setClearColor(0xddead1);
document.querySelector('.scene-container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.enableZoom = true;

const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0x859864, transparent: true, opacity: 0.5});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

const edgeGeometry = new THREE.EdgesGeometry(cubeGeometry);
const edgeMaterial = new THREE.LineBasicMaterial({color: 0x000000});
const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
scene.add(edges);

const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x233c67});
const PARTICLE_COUNT = 35;
const particles = [];
const velocities = [];

for(let i=0; i<PARTICLE_COUNT; i++) {
    const molecule = new THREE.Mesh(sphereGeometry, sphereMaterial);

    molecule.position.x = (Math.random() - 0.5) * 3;
    molecule.position.y = (Math.random() - 0.5) * 3;
    molecule.position.z = (Math.random() - 0.5) * 3;

    scene.add(molecule);
    particles.push(molecule);
    const dir_x = Math.random() < 0.5 ? -1 : 1;
    const dir_y = Math.random() < 0.5 ? -1 : 1;
    const dir_z = Math.random() < 0.5 ? -1 : 1;
    velocities.push(new THREE.Vector3(0.012 * dir_x, 0.02 * dir_y, 0.016 * dir_z));
}

function animate() {
    controls.update();
    renderer.render(scene, camera);
    
    const T = parseFloat(document.getElementById('tempSlider').value);
    let speedFactor = T/273;

    for (let i = 0; i<PARTICLE_COUNT; i++) {
        const particle = particles[i];
        const velocity = velocities[i];

        particle.position.add(velocity.clone().multiplyScalar(speedFactor));

        if (particle.position.x > 1.5 || particle.position.x < -1.5) {
            velocity.x *= -1;
            particle.position.x = THREE.MathUtils.clamp(particle.position.x, -1.5, 1.5);
        }
        if (particle.position.y > 1.5 || particle.position.y < -1.5) {
            velocity.y *= -1;
            particle.position.y = THREE.MathUtils.clamp(particle.position.y, -1.5, 1.5);
        }
        if (particle.position.z > 1.5 || particle.position.z < -1.5) {
            velocity.z *= -1;
            particle.position.z = THREE.MathUtils.clamp(particle.position.z, -1.5, 1.5);
        }
    }

    requestAnimationFrame(animate);
}

animate();

document.querySelector('.back').addEventListener('click', (e) => {
    window.location.href = 'pt4.html';
});

document.querySelector('.next').addEventListener('click', (e) => {
    window.location.href = 'welldone.html';
})