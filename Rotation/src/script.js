import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let render;

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a grid helper to represent the world plane
const gridHelper = new THREE.GridHelper(100, 100);
scene.add(gridHelper);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();
orbit.addEventListener('change', render);

// Create three cubes: red, green, and blue
const redCube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
const greenCube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
const blueCube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);

// Position the cubes in separate locations
redCube.position.set(-2, 0.5, 0);
greenCube.position.set(0, 0.5, 0);
blueCube.position.set(2, 0.5, 0);

// Add the cubes to the scene
scene.add(redCube);
scene.add(greenCube);
scene.add(blueCube);

// Add event listeners for mouse events
let mouseDown = false;
let mouseX = 0;
let mouseY = 0;
let selectedCube = null;

document.addEventListener('mousedown', (event) => {
  mouseDown = true;
  mouseX = event.clientX;
  mouseY = event.clientY;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Convert the mouse coordinates to normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Use the raycaster to find the selected cube
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([redCube, greenCube, blueCube]);
  if (intersects.length > 0) {
    selectedCube = intersects[0].object;
  }
});

document.addEventListener('mouseup', () => {
  mouseDown = false;
  selectedCube = null;
});

document.addEventListener('mousemove', (event) => {
  if (!mouseDown) return;

  const deltaX = event.clientX - mouseX;
  const deltaY = event.clientY - mouseY;

  if (selectedCube === redCube) {
    redCube.rotation.x += deltaY * 0.01;
    redCube.rotation.y += deltaX * 0.01;

    // Fade out the cube's material with each rotation
    redCube.material.opacity -= 0.01;
    if (redCube.material.opacity <= 0) {
      // Remove the cube from the scene when it has completely faded out
      scene.remove(redCube);
    }
  } else if (selectedCube === greenCube) {
    greenCube.rotation.x += deltaY * 0.01;
    greenCube.rotation.y += deltaX * 0.01;

    // Fade out the cube's material with each rotation
    greenCube.material.opacity -= 0.01;
    if (greenCube.material.opacity <= 0) {
      // Remove the cube from the scene when it has completely faded out
      scene.remove(greenCube);
    }
  } else if (selectedCube === blueCube) {
    blueCube.rotation.x += deltaY * 0.01;
    blueCube.rotation.y += deltaX * 0.01;
   
    // Fade out the cube's material with each rotation
    blueCube.material.opacity -= 0.01;
   
    if (blueCube.material.opacity <= 0) {
  // Remove the cube from the scene when it has completely faded out
  scene.remove(blueCube);
    }
}

mouseX = event.clientX;
mouseY = event.clientY;
});

document.addEventListener('wheel', (event) => {
// Zoom in or out depending on the direction of the scroll
const zoomFactor = event.deltaY > 0 ? 1.1 : 0.9;
camera.position.z *= zoomFactor;
});

// Set the camera position and look at the center of the scene
camera.position.z = 5;
camera.lookAt(scene.position);

// Define the animate function to update the scene
function animate() {
requestAnimationFrame(animate);

renderer.render(scene, camera);
}

// Call the animate function to start the animation loop
animate();