import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

class CustomArrow extends THREE.Group {
    constructor(col) {
        super();

        //Dimensions
        this.shaftLength = 1;
        this.headHeight = 0.25;
        this.shaftRadius = 0.02;
        this.headRadius = 0.08;

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
        this.head.position.y = this.shaftLength;

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
        this.head.position.y = length;
    }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
camera.position.set(4, 3.2, 4.5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(400, 400);
renderer.setClearColor(0xddead1);
document.querySelector('.scene-container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.enableZoom = true; 

const axesHelper = new THREE.AxesHelper(6);
axesHelper.position.set(-0.5, -0.5, -0.5);

const geometry = new THREE.BoxGeometry(3, 3, 3);
const material = new THREE.MeshBasicMaterial({color: 0x859864, transparent: true, opacity: 0.5});
const cube = new THREE.Mesh(geometry, material);
geometry.translate(1, 1, 1);

const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.MeshBasicMaterial({color: 0x000000, transparent: false, opacity: 1.0});
const lineSegments = new THREE.LineSegments(edges, lineMaterial);

const sphereGeometry = new THREE.SphereGeometry(0.15, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x233c67 });
const molecule = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereGeometry.translate(1.5, 1.5, 1.5);

const velocity = new THREE.Vector3(3, 5, -4).normalize();
const origin = new THREE.Vector3(1.5, 1.5, 1.5);
const speed = velocity.length();

const c = new CustomArrow(0xff8da1);
c.setDirection(velocity);
c.setLength(speed);
c.position.copy(origin);

const velocity_x = new THREE.Vector3(velocity.x, 0, 0).normalize();
const speed_x = velocity.x;

const cx = new CustomArrow(0xff0000);
cx.setDirection(velocity_x);
cx.setLength(speed_x);
cx.position.copy(origin);

const tip_c = origin.clone().add(velocity.clone().multiplyScalar(speed + 0.25));
const tip_cx = origin.clone().add(velocity_x.clone().multiplyScalar(speed_x + 0.25));
const points = [
    tip_c,
    tip_cx,
]

const dashedLineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const dashedLineMaterial = new THREE.LineDashedMaterial({
    color: 0xff0000, 
    linewidth: 1, 
    scale: 1, 
    dashSize: 0.1, 
    gapSize: 0.1,
});
const dashedLine = new THREE.Line(dashedLineGeometry, dashedLineMaterial);
dashedLine.computeLineDistances();

const group = new THREE.Group();
group.add(axesHelper);
group.add(cube);
group.add(lineSegments);
group.add(molecule);
group.add(c);
group.add(cx);
group.add(dashedLine);

scene.add(group);

function animate() {
    controls.update();
    renderer.render(scene, camera);
    
    requestAnimationFrame(animate);
}

animate();

document.querySelector('.back').addEventListener('click', (e) => {
    window.location.href = 'assumptions.html';
})

document.querySelector('.next').addEventListener('click', (e) => {
    window.location.href = 'pt2.html';
});