import './style/main.css'
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import Particle from './mass-spring/Particle.js';
import MassSpringSystem from './mass-spring/MassSpringSystem.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
let camera, scene, renderer;

const frustumSize = 500;

let aspect = window.innerWidth / window.innerHeight;
camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000);

camera.position.set(0, 0, 200);

scene = new THREE.Scene();
const stats = new Stats();
scene.background = new THREE.Color(0xfff8ec);

renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const container = document.getElementById('container');
container.appendChild(stats.dom);

window.addEventListener('resize', onWindowResize);
const massSystem = new MassSpringSystem()
massSystem.minX = frustumSize * aspect / - 2;
massSystem.maxX = frustumSize * aspect / 2;
massSystem.maxY = frustumSize / 2;
massSystem.minY = frustumSize / - 2;

document.addEventListener('mousedown', click);
document.addEventListener('touchstart', click);

// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath('/three/examples/js/libs/draco/gltf/');

// const loader = new GLTFLoader();
// loader.setDRACOLoader(dracoLoader);

let tips = {
    add: 'Right-click to add particle',
    fix: 'Right-click with shift to fix'
};
let gui = new GUI();
gui.add(tips, 'add').name('');
gui.add(tips, 'fix').name('');
gui.add(massSystem, 'springY').min(0).max(1000).step(10);
gui.add(massSystem, 'dashPotDamping').min(0).max(1).step(0.01);

animate();

function onWindowResize() {

    aspect = window.innerWidth / window.innerHeight;

    camera.left = - frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = - frustumSize / 2;

    massSystem.minX = frustumSize * aspect / - 2;
    massSystem.maxX = frustumSize * aspect / 2;
    massSystem.maxY = frustumSize / 2;
    massSystem.minY = frustumSize / - 2;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(time) {

    requestAnimationFrame(animate);

    //console.log(window.innerWidth)
    massSystem.update();
    stats.update();
    renderer.render(scene, camera);

}

const mouse = new THREE.Vector2();

function click(event) {

    if (event.button == 2) {

        console.log(event);

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        massSystem.addParticle(scene, new THREE.Vector2(mouse.x * frustumSize * aspect * 0.5, mouse.y * frustumSize * 0.5), event.shiftKey)
    }
}

