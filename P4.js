// =============================================================================
// -----------------------Project 4 - TreyZ-------------------------------------
// =============================================================================

// ==========================SCENE LOGIC=========================================

// SETUP CANVAS & RENDERER
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff, 0);  // White canvas, comment out for black canvas
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
canvas.appendChild(renderer.domElement);

// SETUP SCENE
var scene = new THREE.Scene();

// SETUP CAMERA
var VIEW_ANGLE = 60;
var ASPECT = 1;
var NEAR = 0.1;
var FAR = 5000;
var camera = new THREE.PerspectiveCamera(VIEW_ANGLE,ASPECT,NEAR,FAR);
camera.position.set(500,150,1000);
scene.add( camera );

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);

// ADAPT TO WINDOW RESIZE
function resize() {
    renderer.setSize(SCREEN_WIDTH,SCREEN_HEIGHT);
    camera.aspect = SCREEN_WIDTH/SCREEN_HEIGHT;
    camera.updateProjectionMatrix();
	camera.lookAt(new THREE.Vector3(0,0,-2000));
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

	requestAnimationFrame( update );

	var floorGeometry = new THREE.PlaneGeometry( 1450, 750, 5 );
	var floorTexture = THREE.ImageUtils.loadTexture( "images/floor.png" );
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture } );
	var floor = new THREE.Mesh( floorGeometry, floorMaterial );
	scene.add( floor );
	floor.rotateX(-90 * Math.PI / 180);
};

// ==================GAME LOGIC===================================================
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
var ball_radius=14;
var CollidingBoard =false;

// Declare Stage objects 
var hand = new THREE.Object3D();
var backboard = new THREE.Object3D();
var backboard2 = new THREE.Object3D();
var ball = new THREE.Object3D();

// Declare background objects
var bench = new THREE.Object3D();


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
	hand.rotateX(-1.3);
	ball_angle += 1.3;
	// Add to scene
	scene.add(hand);

});

// Load ballrack
var RACK_SCALE = 10;
loader.load('obj/rack.json', function( geometry, materials ) {
	// Make callback
	rack0 = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
	rack1 = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
	// Scale rack to correct size
	rack0.scale.multiplyScalar(RACK_SCALE);
	rack1.scale.multiplyScalar(RACK_SCALE);
	// Position rack 
	rack0.position.y += 10;
	rack0.position.x -= 20;
	rack0.position.z -= 100;
	rack1.position.y += 10;
	rack1.position.x -= 20;
	rack1.position.z += 100;
	// Orient rack
	rack0.rotation.y = Math.PI/8;
	rack1.rotation.y = -Math.PI/8;
	// Add to scene
	scene.add(rack0);
	scene.add(rack1);
});


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

// Load bench
loader.load( 'obj/bench-tex.json', function( geometry, materials ) {
	// Make callback
	var benches = [];
	// background benches
	bench = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
	var bench2 = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
	var bench3 = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
	// Foreground benches
	var bench4 = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
	var bench5 = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
	var bench6 = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
	benches.push(bench, bench2, bench3, bench4, bench5, bench6);
	
	// Scale bench to correct size
	var b;
	for(b = 0; b < benches.length; b++) {
		benches[b].scale.multiplyScalar(10);
		benches[b].position.y += 31;
		benches[b].rotation.y = -Math.PI/2;
		if (b < benches.length/2) { benches[b].position.z -= 350 } else { benches[b].position.z += 350;}
	}
	// Position bench in scene
	bench.position.x += 100;
	bench2.position.x += 350;
	bench3.position.x += 600;
	
	bench4.position.x += 100;
	bench5.position.x += 350;
	bench6.position.x += 600;
	
	// Add to scene
	for(b = 0; b < benches.length; b++) {
		scene.add(benches[b]);
	}

});

// Load ball
loader.load('obj/ball.json', function( geometry, materials ) {
	// Make callback
	ball = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
	// Scale ball to correct size
	ball.scale.multiplyScalar(1/8);
	// Position
	ball.position.y += 25;
	//////////
	//ball.position.y = 275;
	//ball.position.x = 601;


	ball_test = ball;
//	var helper = new THREE.BoundingBoxHelper(ball, 0xff0000);
//	helper.update();
//// If you want a visible bounding box
//	scene.add(helper);
//// If you just want the numbers
//	min = helper.box.min.z;
//	max = helper.box.max.y;

	// Add to scene
	scene.add(ball);
});

var ballz_material = new THREE.MeshBasicMaterial( {color: 0x828224} );
var ballz = new THREE.SphereGeometry(12.5, 64, 64);
var baller = new THREE.Mesh( ballz, ballz_material );
baller.position.y += 16;
// scene.add( baller );
ground = baller.position.y;

//====================== PHYSICS =========================================

//shooting a
//make sure ball rotates with camera
function shoot (forceX,angle ){
	//forceX determined by drag distance
	//angle determined by angle of ball
	if(shootingOn) {
		forceX = 11.3;//todo////////////force of ball for testing
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
	CollidingBoard =false;
}

function bounceBack(){
	ball_forward = -(ball_forward * 0.6 + Math.abs(ball_up * 0.4));
	ball_up = 0.9 * ball_up;
	CollidingBoard =true;
}

function bounceUp(X){
	ball_forward = -(ball_forward * 0.6 + Math.abs(ball_up * 0.4)) * 0.1;
	ball_up = Math.abs( ball_forward * 0.6 + Math.abs(ball_up * 0.73));
	CollidingBoard =true;
	//alert("UPPPPPPPP");
	//alert(X);
}

function boardCollision(X, Y){

	//alert(X);
	//alert(Y);
	//alert(backboard2.position.x);
	if(Math.abs(X - 630) <= ball_radius && (Y + ball_radius >= 165 && Y - ball_radius <=275) ){ ///todo//////////

		return true;
	}else{
		return false;
	}
}

function boardCollision2(X, Y){

	if(X >= 632 && X< 638 && Y <= 300 && Y >= 165 ){ ///todo//////////

		return true;
	}else{
		return false;
	}
}

function boardCollision3(X, Y){

	if(X >= 632 && X < 638 && Y >= 165 && Y <= 300){ ///todo//////////

		return true;
	}else{
		return false;
	}
}

function checkCollision(){
	var originPoint = ball_test.position.clone();
	var X = ball_test.position.x;
	var Y = ball_test.position.y;

	var DxDown = Math.cos(0.78) * ball_radius;
	var DyDown = Math.sin(0.78) * ball_radius;
	var DxUp = Math.cos(2.356) * ball_radius;
	var DyUp = Math.sin(2.356) * ball_radius;
	var NxUp = Math.cos(3.92) * ball_radius;
	var NyUp = Math.sin(3.92) * ball_radius;
	var NxDown = Math.cos(5.45) * ball_radius;
	var NyDown = Math.sin(5.45) * ball_radius;


	if(CollidingBoard == false) {
		 if (boardCollision2(X + DxDown, Y + DyDown)) {
			bounceUp(X + DxDown);
		} else if (boardCollision3(X + DxUp, Y - DyUp)) {

			bounceUp(X + DxDown);
		}else if (boardCollision(X, Y )) {
			bounceBack();
		}

		//else if (boardCollision(X + NxUp, Y + NyUp)) {
		//	bounceGround();
		//} else if (boardCollision(X + NxDown, Y + NyDown)) {
		//	bounceGround();
		//}
	}


	//0.78  2.356   3.92   5.45

}

//====================== Player controls =========================================

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

//====================== ANIMATE =========================================
var upTime = 0;
// SETUP UPDATE CALL-BACK
update = function() {
    requestAnimationFrame( update );
    renderer.render( scene, camera );

	if (shooter) {
		if(ball_angle >= 0){
		hand.rotateX(0.1);
		ball_angle -= 0.1;
		}
		ball_test.translateX(ball_forward);
		//ball_test.rotateZ(ball_forward*0.1);
		ball_test.position.x += ball_forward;
		forward_distance += ball_forward;
		ball_test.translateY(ball_up);
		up_distance += ball_up;
		ball_up = ball_up - gForce(150); //use this line for now so the ball stops
		ball_forward = ball_forward * 0.998; //exponential decrease


		if(ball_up < 0 && up_distance <= 0){

			bounceGround();
		}
		checkCollision();
		//if(forward_distance >300){
		//	var x = ball_test.position.x;
		//	var y = ball_test.position.y;
		//	boardCollision(x,y );
		//}

		//if(boardCollision(ball_test.position.x, ball_test.position.y)){
		//	bounceBack();
		//}

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

//====================== Mouse controls =========================================

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