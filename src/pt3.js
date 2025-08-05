import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

class CustomArrow extends THREE.Group {
    constructor(col) {
        super();

        //Dimensions
        this.shaftLength = 1;
        this.headHeight = 0.05 * 3;
        this.shaftRadius = 0.002 * 3;
        this.headRadius = 0.02 * 3;

        //Shaft (move geometry UP so its base is at y=0)
        const shaftGeometry = new THREE.CylinderGeometry(this.shaftRadius, this.shaftRadius, this.shaftLength, 8);
        shaftGeometry.translate(0, this.shaftLength / 2, 0);  // <--- pivot at bottom
        const shaftMaterial = new THREE.MeshBasicMaterial({ color: col });
        this.shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
        this.add(this.shaft);

        //Head (move geometry UP so its base is at y=0)
        const headGeometry = new THREE.ConeGeometry(this.headRadius, this.headHeight, 8);
        headGeometry.translate(0, this.headHeight / 2, 0);  // <--- pivot at base
        const headMaterial = new THREE.MeshBasicMaterial({ color: col });
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.add(this.head);

        //Position head ABOVE the shaft
        this.head.position.y = this.shaftLength - this.headHeight;

        this.rotation.order = 'XYZ';
    }

    setDirection(dir) {
        const axis = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const yAxis = new THREE.Vector3(0, 1, 0);

        dir = dir.clone().normalize();
        if (dir.equals(yAxis)) return;
        if (dir.equals(yAxis.clone().negate())) {
            this.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
            return;
        }

        axis.crossVectors(yAxis, dir).normalize();
        const angle = Math.acos(yAxis.dot(dir));
        quaternion.setFromAxisAngle(axis, angle);
        this.quaternion.copy(quaternion);
    }

    setLength(length) {
        //Shaft now scales from the bottom, so the base stays fixed
        this.shaft.scale.y = length;

        //Head moves up correctly to stay attached to the shaft
        this.head.position.y = length - this.headHeight;
    }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
camera.position.set(4, 3.2, 3.5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(400, 400);
renderer.setClearColor(0xddead1);
document.querySelector('.scene-container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.enableZoom = true;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const scaleFactor = 3;

const sphereGeometry = new THREE.SphereGeometry(0.15 * scaleFactor, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x233c67, transparent: false, opacity: 1.0});
const molecule = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(molecule);

const velocity = new THREE.Vector3(3, 5, 4).normalize();
const origin = new THREE.Vector3(0, 0, 0);
const speed = velocity.length() * scaleFactor;

const c = new CustomArrow(0xff8da1);
c.setDirection(velocity);
c.setLength(speed);
c.position.copy(origin);
scene.add(c);

const velocity_x = new THREE.Vector3(velocity.x, 0, 0).normalize();
const speed_x = velocity.x * scaleFactor;

const cx = new CustomArrow(0xff0000);
cx.setDirection(velocity_x);
cx.setLength(speed_x);
cx.position.copy(origin);
scene.add(cx);

const velocity_y = new THREE.Vector3(0, velocity.y, 0).normalize();
const speed_y = velocity.y * scaleFactor;

const cy = new CustomArrow(0x00ff00);
cy.setDirection(velocity_y);
cy.setLength(speed_y);
cy.position.copy(origin);
scene.add(cy);

const velocity_z = new THREE.Vector3(0, 0, velocity.z).normalize();
const speed_z = velocity.z * scaleFactor;

const cz = new CustomArrow(0x0000ff);
cz.setDirection(velocity_z);
cz.setLength(speed_z);
cz.position.copy(origin);
scene.add(cz);

const boxGeometry = new THREE.BoxGeometry(velocity.x * scaleFactor, velocity.y * scaleFactor, velocity.z * scaleFactor);
const boxMaterial = new THREE.MeshBasicMaterial({color: 0xff8da1, transparent: true, opacity: 0.2});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
const translateFactor = new THREE.Vector3(velocity.x * scaleFactor / 2, velocity.y * scaleFactor / 2, velocity.z * scaleFactor / 2);
box.position.add(translateFactor);
scene.add(box);

const edgeGeometry = new THREE.EdgesGeometry(boxGeometry);
const edgeMaterial = new THREE.LineDashedMaterial({
    color: 0xff8da1, 
    linewidth: 1, 
    scale: 1, 
    dashSize: 0.1, 
    gapSize: 0.1,
});
const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
edges.position.copy(box.position);
edges.computeLineDistances();
scene.add(edges);

function animate() {
    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

animate();


document.querySelector('.back').addEventListener('click', (e) => {
    window.location.href = 'pt2.html';
});

document.querySelector('.next').addEventListener('click', (e) => {
    window.location.href = 'pt4.html';
});