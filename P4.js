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
//GLOBAL VARIABLES
var ball_test;
var gravity = 0.001;
var ball_forward = 0;
var ball_up = 0;
var ball_angle=0;
var shooter = false;
var b = true;
var Vfinal = 0;
var mousedown = false;
var dragTime;
var NumOfBounces = 0;
var shootingOn = false; //if false ball wont be shot
var up_distance = 0;
var forward_distance = 0;

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

	

	requestAnimationFrame( update );
	scene.simulate();
};

// Declare objects 
var hand = new THREE.Object3D();
var backboard = new THREE.Object3D();
var backboard2 = new THREE.Object3D();
var ball = new THREE.Object3D();

// Build loader
var loader = new THREE.JSONLoader();

// Load hand
loader.load( 'obj/hand.json', function( geometry, materials ) {
	// Make callback
	hand = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
	// Scale hand to correct size
	hand.scale.multiplyScalar(3);
	// Position hand in scene
	hand.position.y += 20;
	hand.position.x -= 20;

	hand.rotation.y = -Math.PI/2;
	hand.rotation.y = Math.PI/2;
	hand.rotateX(-1);
	ball_angle += 1;
	// Add to scene
	scene.add(hand);

});

/*
// Load ballrack
loader.load('obj/ballrack.json', function( geometry, materials ) {
	// Make callback
	rack0 = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
	// Scale rack to correct size
	rack0.scale.multiplyScalar(10);
	// Position rack 
	rack0.position.y += 20;
	rack0.position.x -= 20;
	// Orient rack
	rack0.rotation.y = -Math.PI/2;
	rack0.rotation.y = Math.PI/2;
	// Add to scene
	scene.add(rack0);
});
*/

// Load backboard + net
loader.load('obj/backboard.json', function( geometry, materials ) {
	// Make callback
	backboard = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
	backboard2 = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
	// Scale backboard to correct size
	backboard.scale.multiplyScalar(5);
	backboard2.scale.multiplyScalar(5);
	// Position backboard 
	backboard.position.x -= 680;
	backboard2.position.x += 680;
	// Orient backboard
	backboard.rotation.y = Math.PI/2;
	backboard2.rotation.y = -Math.PI/2;
	// Add to scene
	scene.add(backboard);
	scene.add(backboard2);
});

// Load ball
loader.load('obj/ball.json', function( geometry, materials ) {
	// Make callback
	ball = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
	// Scale ball to correct size
	ball.scale.multiplyScalar(1/8);
	// Position
	ball.position.y += 25;
	ball_test = ball;
	// Add to scene
	scene.add(ball);
});

var ballz_material = new THREE.MeshBasicMaterial( {color: 0x828224} );
var ballz = new THREE.SphereGeometry(12.5, 64, 64);
var baller = new THREE.Mesh( ballz, ballz_material );
baller.position.y += 16;
// scene.add( baller );
ground = baller.position.y;


//shooting a
//make sure ball rotates with camera
function shoot (forceX,angle ){
	//forceX determined by drag distance
	//angle determined by angle of ball
	if(shootingOn) {
		ball_forward = forceX * Math.cos(angle);
		ball_forward = Math.abs(ball_forward);
		ball_up = forceX * Math.sin(angle);
		ball_up = Math.abs(ball_up);
		shooter = true;
		Vfinal = -ball_up;
		ball_angle = 0;
	}

}

function gForce(g){
	return gravity * g;
}

function bounceGround(){
	var bounceUp = -(ball_up * (0.69 - 0.002 * NumOfBounces));
	ball_up = bounceUp;
	Vfinal = -ball_up;
	ball_forward =  (ball_forward * (0.98 - 0.004 * NumOfBounces));
	NumOfBounces++;
}

function bounceBack(){

	ball_forward = -(ball_forward * 0.6 + Math.abs(ball_up * 0.4));
	ball_up = 0.9 * ball_up;

}
// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
var grid_state = false;
function onKeyDown(event){
	if(keyboard.pressed("a"))
	{

		hand.translateX(1);
		ball_test.translateZ(-1);
	}

	if(keyboard.pressed("w") && !shooter)
	{

		hand.rotateX(-0.1);
		ball_angle += 0.1;
	}

	if(keyboard.pressed("q") && !shooter)
	{

		shootingOn = !shootingOn;
	}

}
keyboard.domElement.addEventListener('keydown', onKeyDown );


var upTime = 0;
// SETUP UPDATE CALL-BACK
update = function() {
    requestAnimationFrame( update );
    renderer.render( scene, camera );
    render_stats.update();

	if (shooter) {
		if(ball_angle >= 0){
		hand.rotateX(0.1);
		ball_angle -= 0.1;
		}
		ball_test.translateX(ball_forward);
		//ball_test.rotateZ(ball_forward*0.1);
		ball_test.position.x += ball_forward;
		//forward_distance += ball_forward;
		ball_test.translateY(ball_up);
		up_distance += ball_up;
		ball_up = ball_up - gForce(150); //use this line for now so the ball stops
		ball_forward = ball_forward * 0.998; //exponential decrease

		//if (ball_up <= Vfinal) { //just so that the ball stops, have to be changed to collision dection later
		//	bounceGround();
		//}

		if(ball_up < 0 && up_distance <= 0){

			bounceGround();
		}

		if(Math.abs(ball_test.position.x + backboard.position.x) <=75 && (ball_test.position.y >= 192 && ball_test.position.y <=288) ){
			//alert(ball_test.position.x);

			bounceBack();
			//alert(ball_test.position.y);
		}

		if(NumOfBounces >= 50){
			shooter = false;
			ball_forward = 0;
			ball_up = 0;
			NumOfBounces=0;
			//ball_angle = 0;
		}
	}
	if (mousedown && dragTime < 500){
		dragTime++;
	}else{
		dragTime = 0;
	}



};

var mouseX = 0;
var mouseY = 0;
var deltaX = 0;
var deltaY = 0;
function onMouseDown(event) {
	mousedown = true;
	mouseX = event.clientX;
	mouseY = event.clientY;
}
function onMouseUp(event) {
	mousedown = false;
	if(!shooter){
	//shoot(dragTime * 0.08, deltaY * 5); //keep this line
		shoot(dragTime * 0.15, ball_angle);
	}
	deltaX = 0;
	deltaY = 0;
}
function onMouseMove(event) {
	if (!mousedown) {
		return;
	}

	event.preventDefault();

	deltaX = event.clientX - mouseX;
	deltaY = event.clientY - mouseY;
	mouseX = event.clientX;
	mouseY = event.clientY;
}
canvas.addEventListener('mousemove', onMouseMove );
canvas.addEventListener('mousedown', onMouseDown );
canvas.addEventListener('mouseup', onMouseUp );


window.onload = initScene;
