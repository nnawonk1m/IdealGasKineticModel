import * as THREE from '../node_modules/three/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(300, 300);
renderer.setClearColor(0xddead1);
document.querySelector(".scene-container").appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(3, 3, 3);
const material = new THREE.MeshBasicMaterial({ color: 0x859864, wireframe: false, transparent: true, opacity: 0.5 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const edges = new THREE.EdgesGeometry(geometry);

const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // black border
const lineSegments = new THREE.LineSegments(edges, lineMaterial);
scene.add(lineSegments);

const Group = new THREE.Group();
Group.add(cube);
Group.add(lineSegments);


scene.add(Group);

const PARTICLE_COUNT = 20;
const particles = [];
const velocities = [];

const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x000000});

for (let i =0; i<PARTICLE_COUNT; i++) {
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.x = (Math.random() - 0.5) * 3;
    sphere.position.y = (Math.random() - 0.5) * 3;
    sphere.position.z = (Math.random() - 0.5) * 3;

    Group.add(sphere);
    particles.push(sphere);
    velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
    ));
}

camera.position.z = 5;

function animate() {
    renderer.render(scene, camera);

    Group.rotation.x += 0.01;
    Group.rotation.y += 0.01;

    for (let i = 0; i<PARTICLE_COUNT; i++) {
        const particle = particles[i];
        const velocity = velocities[i];

        particle.position.add(velocity);

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

document.querySelector('.start').addEventListener('click', (e)=> {
    window.location.href = "assumptions.html";
});