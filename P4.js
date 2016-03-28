// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
    this.matrix=a;
    this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// SETUP PHYSICS
Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var initScene, render,
		ground_material, car_material, wheel_material, wheel_geometry,
		loader, renderer, render_stats, physics_stats, scene, ground_geometry, ground, light, camera,
		car = {};

// SETUP RENDERER
var canvas = document.getElementById('canvas');
var renderer = new THREE.WebGLRenderer();
	renderer.shadowMap = true;
	renderer.shadowMapSoft = true;
renderer.setClearColor(0x000000); 
canvas.appendChild(renderer.domElement);

// SETUP SCENE
var scene = new Physijs.Scene();
scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
scene.addEventListener(
	'update',
	function() {
		scene.simulate( undefined, 2 );
		physics_stats.update();
	}
);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30,1,0.1,1000); 
camera.position.set(45,20,40);
camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);

// ADAPT TO WINDOW RESIZE
function resize() {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
    window.scrollTo(0,0);
}

// SETUP HELPER GRID
// Note: Press Z to show/hide!
var gridGeometry = new THREE.Geometry();
var i;
for(i=-50;i<51;i+=2) {
    gridGeometry.vertices.push( new THREE.Vector3(i,0,-50));
    gridGeometry.vertices.push( new THREE.Vector3(i,0,50));
    gridGeometry.vertices.push( new THREE.Vector3(-50,0,i));
    gridGeometry.vertices.push( new THREE.Vector3(50,0,i));
}

var gridMaterial = new THREE.LineBasicMaterial({color:0xBBBBBB});
var grid = new THREE.Line(gridGeometry,gridMaterial,THREE.LinePieces);

// GROUND + STADIUM
window.onload = function initScene() {
	
}

// LISTEN TO KEYBOARD
var key; var keyboard = new THREEx.KeyboardState();
var grid_state = false;
keyboard.domElement.addEventListener('keydown',function(event){
    if(keyboard.eventMatches(event,"Z")){ 
    	grid_state =! grid_state;
        grid_state? scene.add(grid) : scene.remove(grid);
    }
});

// SETUP UPDATE CALL-BACK
function update() {
    requestAnimationFrame(update);
    renderer.render(scene,camera);
}

update();