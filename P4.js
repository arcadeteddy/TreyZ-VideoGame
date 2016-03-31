// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
    this.matrix=a;
    this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// SETUP PHYSICS
Physijs.scripts.worker = 'js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';
var initScene, update;

// SETUP RENDERER
var canvas = document.getElementById('canvas');
var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
renderer.setClearColor(0x000000); 
canvas.appendChild(renderer.domElement);

var render_stats = new Stats();
render_stats.domElement.style.position = 'absolute';
render_stats.domElement.style.top = '0px';
render_stats.domElement.style.right = '0px';
render_stats.domElement.style.zIndex = 100;
document.getElementById( 'canvas' ).appendChild( render_stats.domElement );

var physics_stats = new Stats();
physics_stats.domElement.style.position = 'absolute';
physics_stats.domElement.style.top = '50px';
physics_stats.domElement.style.right = '0px';
physics_stats.domElement.style.zIndex = 100;
document.getElementById( 'canvas' ).appendChild( physics_stats.domElement );

// SETUP SCENE
var scene = new Physijs.Scene();
scene.setGravity(new THREE.Vector3( 0, -100, 0 ));
scene.addEventListener(
	'update',
	function() {
		scene.simulate( undefined, 2 );
		physics_stats.update();
	}
);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30,1,0.1,5000); 
camera.position.set(500,300,500);
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
window.onscroll = function() {
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
initScene = function() {
	// Light
	var light = new THREE.DirectionalLight( 0xFFFFFF );
	light.position.set( 20, 150, -50 );
	light.target.position.copy( scene.position );
	light.castShadow = true;
	light.shadowCameraLeft = -60;
	light.shadowCameraTop = -60;
	light.shadowCameraRight = 60;
	light.shadowCameraBottom = 60;
	light.shadowCameraNear = 20;
	light.shadowCameraFar = 200;
	light.shadowBias = -.0001
	light.shadowMapWidth = light.shadowMapHeight = 2048;
	light.shadowDarkness = .8;
	scene.add( light );

	// Materials
	var court_inside_material = Physijs.createMaterial(new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture( "images/floor.png" ) }), 1, 0.5 );
	var court_outside_material = Physijs.createMaterial(new THREE.MeshLambertMaterial({ color: 0x543233 }));
		
	// Environment
	var court_inside = new Physijs.BoxMesh( new THREE.BoxGeometry(1400, 5, 750), court_inside_material, 0 ); // Geometry, Material, Mass
	var court_outside = new Physijs.BoxMesh( new THREE.BoxGeometry(1500, 1, 850), court_outside_material, 0 ); // Geometry, Material, Mass
	court_inside.castShadow = true;
	court_inside.receiveShadow = true;
	court_outside.receiveShadow = true; 
	court_inside.position.y = 2.5;
		scene.add( court_inside );
	scene.add( court_outside );

	// Ball
	var ball_material = Physijs.createMaterial(new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture( "images/basketball.jpg" ) }), 1, 2.5 );
	var ball = new Physijs.SphereMesh( new THREE.SphereGeometry(12.5, 64, 64), ball_material, 500 );
	ball.castShadow = true;
	ball.receiveShadow = true;
	ball.position.y = 100;
	scene.add( ball );
	
	//  Player hand
		// Declare hand object
	var hand = new THREE.Object3D();
		// Build loader
	var loader = new THREE.JSONLoader();
		// Use load method
	loader.load( 'obj/hand.json', function( geometry, materials ) {
		// Make callback
		hand = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
		// Scale hand to correct size
		hand.scale.multiplyScalar(3);
		// Position hand in scene
		hand.position.y += 20;
		hand.position.x += 20;
		hand.rotation.y = -Math.PI/2;
		// Add to scene
		scene.add(hand);

	});
		
	requestAnimationFrame( update );
	scene.simulate();
};

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
update = function() {
    requestAnimationFrame( update );
    renderer.render( scene, camera );
    render_stats.update();
};

window.onload = initScene;
