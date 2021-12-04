import "./style.css";
import * as THREE from "three";
import { MathUtils } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/// Constants
//// Accurate Astronomical Constants (km)
const EARTH_RADIUS = 6357;
const MOON_RADIUS = 1737;
const SCALE = 1 / EARTH_RADIUS;
const EARTH_AXIAL_TILT = (23.4 * Math.PI) / 180; // tilt in radians

//// Fake Astronomical Constants (seconds, radians)
const EARTH_MOON_DISTANCE = 2.5 * EARTH_RADIUS;
const EARTH_SUN_DISTANCE = 12 * EARTH_MOON_DISTANCE;
const SUN_RADIUS = 10000;
const ATMOSPHERE_RADIUS = EARTH_RADIUS + 100;
const SUN_ROTATIONAL_PERIOD = 30;
const MOON_ROTATIONAL_PERIOD = 10;
// We'll make time scales accurate relative to moon period
const EARTH_ROTATIONAL_PERIOD = (1 * MOON_ROTATIONAL_PERIOD) / 28;
const MOON_ORBITAL_PERIOD = MOON_ROTATIONAL_PERIOD; // At least we'll have tidal locking

// This is fake, we'll make the atmosphere rotate 20% faster than the Earth itself
const EARTH_ATMOSPHERE_ROTATIONAL_PERIOD = 0.8 * EARTH_ROTATIONAL_PERIOD;

const MOON_ORBITAL_PLANE_INCLINATION = MathUtils.degToRad(5);
const MOON_ORBITAL_DISPLACEMENT =
  Math.tan(MOON_ORBITAL_PLANE_INCLINATION) * EARTH_MOON_DISTANCE;
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
earth.geometry.applyMatrix(
  new THREE.Matrix4().makeRotationZ(-EARTH_AXIAL_TILT)
);
const earthAxis = new THREE.Vector3(
  Math.sin(EARTH_AXIAL_TILT),
  Math.cos(EARTH_AXIAL_TILT),
  0
).normalize();
scene.add(earth);

//// Moon
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.setX(EARTH_MOON_DISTANCE * SCALE);
moon.castShadow = true;
moon.receiveShadow = true;
scene.add(moon);

// Lights

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.x = 10;
directionalLight.position.y = 0;
directionalLight.position.z = 0;
directionalLight.castShadow = true;
directionalLight.shadow.radius = 50;
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
scene.add(directionalLight);

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
let lastEarthAngle = 0;
let lastEarthAtmosphereAngle = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const earthAngleDelta =
    ((((2 * Math.PI) / EARTH_ROTATIONAL_PERIOD) * elapsedTime) %
      (2 * Math.PI)) -
    lastEarthAngle;
  lastEarthAngle += earthAngleDelta;

  const earthAtmosphereAngleDelta =
    ((((2 * Math.PI) / EARTH_ATMOSPHERE_ROTATIONAL_PERIOD) * elapsedTime) %
      (2 * Math.PI)) -
    lastEarthAtmosphereAngle;
  lastEarthAtmosphereAngle += earthAtmosphereAngleDelta;

  //Update objects
  earth.rotateOnAxis(earthAxis, earthAngleDelta);
  moon.rotation.y = ((2 * Math.PI) / MOON_ROTATIONAL_PERIOD) * elapsedTime;

  const newMoonX =
    EARTH_MOON_DISTANCE *
    SCALE *
    Math.cos(-((2 * Math.PI) / MOON_ORBITAL_PERIOD) * elapsedTime);
  const newMoonY =
    MOON_ORBITAL_DISPLACEMENT *
    SCALE *
    Math.sin(-((2 * Math.PI) / MOON_ORBITAL_PERIOD) * elapsedTime);
  const newMoonZ =
    EARTH_MOON_DISTANCE *
    SCALE *
    Math.sin(-((2 * Math.PI) / MOON_ORBITAL_PERIOD) * elapsedTime);

  moon.position.set(newMoonX, newMoonY, newMoonZ);

  // Update Orbital Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
