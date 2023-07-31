import "./style.css";
import * as THREE from "three";
import {
    MapControls,
    OrbitControls,
} from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
const objLoader = new OBJLoader();
// ! Models 
let introBlock;

// import headshot from '../static/textures/headshot.jpg'
// const img = document.querySelector('.profile-pic');
// const profile = document.querySelector('.profile');
// img.src = headshot;
//Scene
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const brickWall = textureLoader.load("/textures/brick-wall.jpg");
const particleTexture = textureLoader.load("/textures/alphaSnow.jpg")
//Debugging
const gui = new dat.GUI();

// * Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.z = 2;
scene.add(ambientLight, directionalLight);


gui.add(directionalLight, "intensity").min(0).max(1).step(0.01);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.01);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.01);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.01);
//Resizing
window.addEventListener("resize", () => {
    //Update Size
    aspect.width = window.innerWidth;
    aspect.height = window.innerHeight;

    //New Aspect Ratio
    camera.aspect = aspect.width / aspect.height;
    camera.updateProjectionMatrix();

    //New RendererSize
    renderer.setSize(aspect.width, aspect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// * Button 
const planeGeo = new THREE.BoxGeometry(1,1,.01);
const buttonMaterial = new THREE.MeshBasicMaterial({ color: 'skyblue' });
const button = new THREE.Mesh(planeGeo, buttonMaterial);
button.position.set(-5, 2, -1);
scene.add(button);
gui.add(button.position, "y").min(-3).max(3).step(0.01).name("buttonY");
gui.add(button.position, "x").min(-3).max(3).step(0.01).name("buttonX");
gui.add(button.position, "z").min(-3).max(3).step(0.01).name("buttonZ");
// * Loading model
objLoader.load("./models/untitled.obj", (object) => {
    introBlock = object;
    object.position.set(0, 0, 2); 
    object.rotation.y = -1.5; 
    object.scale.set(0.1, 0.1, 0.1);
    object.children[0].material = new THREE.MeshBasicMaterial({ color: 'skyblue' });
    // scene.add(object);
});


//Mesh
const geometry = new THREE.BufferGeometry();
const verticesAmount = 12000
const positions = new Float32Array(verticesAmount * 3);
for (let i = 0; i < verticesAmount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 8;
}
geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
);
const material = new THREE.PointsMaterial();
material.size = 0.02;
material.alphaMap = particleTexture;
material.transparent = true;
material.depthTest = false;
// material.position.y = 1.5;

const points = new THREE.Points(geometry, material);
// points.position.z = -1;
scene.add(points);

//Camera
const aspect = {
    width: window.innerWidth,
    height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, aspect.width / aspect.height, 0.01, 100);
camera.position.set(0, 0, 3);
scene.add(camera);

// ? add camera to gui
gui.add(camera.position, "z").min(0).max(10).step(0.01).name("cameraZ");
gui.add(camera.position, "x").min(-3).max(3).step(0.01).name("cameraX");
gui.add(camera.position, "y").min(-3).max(3).step(0.01).name("cameraY");
gui.add(camera, "fov").min(0).max(180).step(0.01).name("cameraFOV");
gui.add(camera, "near").min(0).max(10).step(0.01).name("cameraNear");
gui.add(camera, "far").min(0).max(10).step(0.01).name("cameraFar");
gui.add(camera, "aspect").min(0).max(10).step(0.01).name("cameraAspect");

// * Raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
// ? add a hover event to a three js object
window.addEventListener("mousemove", (event) => {
    const elapsedTime = clock.getElapsedTime();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // console.log(pointer);
    // * Casting ray
    raycaster.setFromCamera(pointer, camera);
    // * Intersecting
    const intersectedObj = raycaster.intersectObjects([button]);
    if(intersectedObj.length > 0){
        button.material.color.set('red');
        button.scale.set(1.1,1.1,1.1);
        scene.add(introBlock);
    }
    else if(intersectedObj.length === 0){
        button.material.color.set('skyblue');
        button.scale.set(1,1,1);
        scene.remove(introBlock);
    }
})

//Renderer
const canvas = document.querySelector(".draw");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(aspect.width, aspect.height);

//OrbitControls
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
// orbitControls.enableZoom = false;
// orbitControls.enableRotate = false;
//Clock Class
const clock = new THREE.Clock();

// * Grabbing body to change background color
// const body = document.querySelector("body");
// body.addEventListener("click", () => {
//     console.log('here');
//     if(body.classList.contains('snowy')){
//         body.classList.remove('snowy');
//         body.classList.add('sunny');
//         // scene.remove(points);
//     }
//     else{
//         body.classList.remove('sunny');
//         body.classList.add('snowy');
//         // scene.add(points);
//     }

// });
console.log(points.position);
const animate = () => {
    //GetElapsedTime
    const elapsedTime = clock.getElapsedTime();

    // * animate particles 
    points.rotation.x = elapsedTime * 0.1;
    // if(introBlock){
    //     introBlock.rotation.y = -elapsedTime;
    // }

    //Update Controls
    orbitControls.update();

    //Renderer
    renderer.render(scene, camera);

    //RequestAnimationFrame
    window.requestAnimationFrame(animate);
};
animate();
