import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// Constants
//// Accurate Astronomical Constants (km)
const EARTH_RADIUS = 6357;
const MOON_RADIUS = 1737;
const SCALE = 1 / EARTH_RADIUS;

//// Fake Astronomical Constants
const EARTH_MOON_DISTANCE = 2.5 * EARTH_RADIUS;
const MOON_ROTATIONAL_PERIOD = 10; // In seconds
const MOON_ORBITAL_PERIOD = MOON_ROTATIONAL_PERIOD; // At least we'll have tidal locking

//// Rendering Constants
const SPHERE_SEGMENTS = 64;

// Loading
const textureLoader = new THREE.TextureLoader();
//// Earth
const earthTexture = textureLoader.load("/textures/earthTexture.jpg");
const earthNormalMap = textureLoader.load("/textures/earthNormalMap.png");

//// Moon
const moonTexture = textureLoader.load("/textures/moonTexture.png");
const moonNormalMap = textureLoader.load("/textures/moonNormalMap.png");

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
//// Earth
const earthGeometry = new THREE.SphereGeometry(
  EARTH_RADIUS * SCALE,
  SPHERE_SEGMENTS,
  SPHERE_SEGMENTS
);

//// Moon
const moonGeometry = new THREE.SphereGeometry(
  MOON_RADIUS * SCALE,
  SPHERE_SEGMENTS,
  SPHERE_SEGMENTS
);

// Materials
/// Earth
const earthMaterial = new THREE.MeshStandardMaterial();
earthMaterial.normalMap = earthNormalMap;
earthMaterial.map = earthTexture;

//// Moon
const moonMaterial = new THREE.MeshStandardMaterial();
moonMaterial.normalMap = moonNormalMap;
moonMaterial.map = moonTexture;

// Meshes
//// Earth
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.castShadow = true;
earth.receiveShadow = true;
scene.add(earth);

//// Moon
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.setX(EARTH_MOON_DISTANCE * SCALE);
moon.castShadow = true;
moon.receiveShadow = true;
scene.add(moon);

// Lights

const pointLight = new THREE.DirectionalLight(0xffffff, 1);
pointLight.position.x = 10;
pointLight.position.y = 0;
pointLight.position.z = 0;
pointLight.castShadow = true;
pointLight.shadow.radius = 50;
pointLight.shadow.mapSize.width = 4096;
pointLight.shadow.mapSize.height = 4096;
scene.add(pointLight);

gui.add(pointLight.position, "y");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  earth.rotation.y = 0.5 * elapsedTime;
  moon.rotation.y = 0.5 * elapsedTime;
  //   moon.position.set();

  // Update Orbital Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
