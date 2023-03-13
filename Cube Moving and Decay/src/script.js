// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import GUI from 'lil-gui'; 

let scene;
let camera;
let renderer;

//grid
scene = new THREE.Scene();
scene.add(new THREE.GridHelper(100000, 100, 0x424242, 0x424242));

// create the cube geometry and material
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.5,
});

// create the cube mesh and add it to the scene
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// set the decay rate
const decayRate = 0.01;

// define a noise texture for the cube
const noiseTexture = new THREE.TextureLoader().load('noise.jpg');
noiseTexture.wrapS = THREE.RepeatWrapping;
noiseTexture.wrapT = THREE.RepeatWrapping;

// define a displacement map for the cube
const displacementMap = new THREE.TextureLoader().load('displacement.jpg');
displacementMap.wrapS = THREE.RepeatWrapping;
displacementMap.wrapT = THREE.RepeatWrapping;

// create a shader material for the cube
const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        noiseTexture: { value: noiseTexture },
        displacementMap: { value: displacementMap },
    },
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
});

// set the material of the cube to the shader material
cube.material = shaderMaterial;

// define the update function
function update() {
    // update the time uniform of the shader material
    shaderMaterial.uniforms.time.value += 0.01;

    // reduce the size of the cube
    cube.scale.multiplyScalar(1 - decayRate);

    // update the camera position to follow the cube
    camera.position.set(cube.position.x + 5, cube.position.y + 5, cube.position.z + 5);
    camera.lookAt(cube.position);

    // render the scene
    renderer.render(scene, camera);
}

// call the update function in the animation loop
function animate() {
    requestAnimationFrame(animate);
    update();
}
animate();
