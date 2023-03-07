import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three-dragcontrols'

// Initialize variables
var container, scene, camera, renderer, dragControls, cube, particles, trace;
var width = window.innerWidth;
var height = window.innerHeight;

var orbit;

// Set up the scene
init();

function init() {

    // Create container and add it to the DOM
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // Set up the camera
    camera = new THREE.PerspectiveCamera( 75, width / height, 1, 1000 );
    camera.position.set( 0, 0, 5 );

    // Set up the scene
    scene = new THREE.Scene();

    // Set up the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    container.appendChild( renderer.domElement );

    // Add a cube to the scene
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    // Add particles to the scene
    particles = new THREE.Group();
    for ( var i = 0; i < 100; i++ ) {
        var particleGeometry = new THREE.SphereGeometry( 0.05, 16, 16 );
        var particleMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        var particle = new THREE.Mesh( particleGeometry, particleMaterial );
        particles.add( particle );
    }
    scene.add( particles );

    // Add a trace to the scene
    trace = new THREE.Group();
    scene.add( trace );

    // Set up drag controls for the cube
    dragControls = new DragControls( [ cube ], camera, renderer.domElement );

    // Start the animation loop
    animate();

}

orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();
orbit.addEventListener('change', render);


function animate() {

    requestAnimationFrame( animate );

    // Decay the cube into particles
    if ( cube.scale.x > 0.1 ) {
        cube.scale.x -= 0.01;
        cube.scale.y -= 0.01;
        cube.scale.z -= 0.01;
        for ( var i = 0; i < particles.children.length; i++ ) {
            particles.children[ i ].position.copy( cube.position );
            particles.children[ i ].position.x += ( Math.random() - 0.5 ) * 0.5;
            particles.children[ i ].position.y += ( Math.random() - 0.5 ) * 0.5;
            particles.children[ i ].position.z += ( Math.random() - 0.5 ) * 0.5;
        }
    }

    // Add a new trace point to the scene
    var traceGeometry = new THREE.SphereGeometry( 0.01, 16, 16 );
    var traceMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var tracePoint = new THREE.Mesh( traceGeometry, traceMaterial );
    tracePoint.position.copy( cube.position );
    trace.add( tracePoint );

    // Render the scene
    renderer.render( scene, camera );

}
