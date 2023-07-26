import "./style.css";
import * as THREE from "three";
import {
    MapControls,
    OrbitControls,
} from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import headshot from '../static/textures/headshot.jpg'
const img = document.querySelector('.profile-pic');
img.src = headshot;
//Scene
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const cloudTexture = textureLoader.load("/textures/2k_mars.jpg");
const particleTexture = textureLoader.load("/textures/alphaSnow.jpg")
//Debugging
const gui = new dat.GUI();


// * Sun light
// const directionalLight = new THREE.DirectionalLight('white', .8);
// directionalLight.position.set(1, 1, 1);
// scene.add(directionalLight);
// const ambientLight = new THREE.AmbientLight('white', .5);
// scene.add(ambientLight);



// gui.add(directionalLight, "intensity").min(0).max(1).step(0.01);
// gui.add(directionalLight.position, "x").min(-5).max(5).step(0.01);
// gui.add(directionalLight.position, "y").min(-5).max(5).step(0.01);
// gui.add(directionalLight.position, "z").min(-5).max(5).step(0.01);
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

// Box Geometry
const marsGeo = new THREE.SphereGeometry(1, 32, 32);
const marsMaterial = new THREE.MeshBasicMaterial({alphaMap: cloudTexture});
marsMaterial.map = cloudTexture;

const mars = new THREE.Mesh(marsGeo, marsMaterial);
// scene.add(mars);
// ? add box to gui
gui.add(mars.position, "y").min(-3).max(3).step(0.01).name("marsY");
gui.add(mars.position, "x").min(-3).max(3).step(0.01).name("marsX");
gui.add(mars.position, "z").min(-3).max(3).step(0.01).name("marsZ");
// gui.add(box, "visible");


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
camera.position.z = 2;
scene.add(camera);

// ? add camera to gui
gui.add(camera.position, "z").min(0).max(10).step(0.01).name("cameraZ");
gui.add(camera.position, "x").min(-3).max(3).step(0.01).name("cameraX");
gui.add(camera.position, "y").min(-3).max(3).step(0.01).name("cameraY");
gui.add(camera, "fov").min(0).max(180).step(0.01).name("cameraFOV");
gui.add(camera, "near").min(0).max(10).step(0.01).name("cameraNear");
gui.add(camera, "far").min(0).max(10).step(0.01).name("cameraFar");
gui.add(camera, "aspect").min(0).max(10).step(0.01).name("cameraAspect");

//Renderer
const canvas = document.querySelector(".draw");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true});
renderer.setSize(aspect.width, aspect.height);

//OrbitControls
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
// orbitControls.enableZoom = false;
// orbitControls.enableRotate = false;
//Clock Class
const clock = new THREE.Clock();

// * Grabbing body to change background color
const body = document.querySelector("body");
body.addEventListener("click", () => {
    console.log('here');
    if(body.classList.contains('snowy')){
        body.classList.remove('snowy');
        body.classList.add('sunny');
        // scene.remove(points);
    }
    else{
        body.classList.remove('sunny');
        body.classList.add('snowy');
        // scene.add(points);
    }

});
console.log(points.position);
const animate = () => {
    //GetElapsedTime
    const elapsedTime = clock.getElapsedTime();

    // * animate particles 
    points.rotation.x = elapsedTime * 0.1;
    // if(points.position.y < -1.5){
    //     points.position.set(0,0,0);
    // }
    // else{
    //     points.position.y = - elapsedTime * 0.2;
    // }
    // ? make points fall down and reset
    
    // points.position.y = Math.sin(-elapsedTime * 0.2);
    // console.log(points.position.y);
    // points.rotation.x = Math.sin(elapsedTime * 0.2);
    // points.rotation.x = Math.tan(elapsedTime * 0.2);

    //Update Controls
    orbitControls.update();

    //Renderer
    renderer.render(scene, camera);

    //RequestAnimationFrame
    window.requestAnimationFrame(animate);
};
animate();
