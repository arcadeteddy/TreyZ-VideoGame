// =============================================================================
// -----------------------Project 4 - TreyZ-------------------------------------
// =============================================================================

// ==========================SCENE LOGIC=========================================

// SETUP CANVAS & RENDERER
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x9ac2ff, 0);  // White canvas, comment out for black canvas
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
camera.position.set(0,250,450);
scene.add( camera );

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);

// ADAPT TO WINDOW RESIZE
function resize() {
    renderer.setSize(SCREEN_WIDTH,SCREEN_HEIGHT);
    camera.aspect = SCREEN_WIDTH/SCREEN_HEIGHT;
    camera.updateProjectionMatrix();
	camera.lookAt(new THREE.Vector3(0,0,0));
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

// ENVIRONMENT
initScene = function() {
    var ambientLight = new THREE.AmbientLight( 0xAFAFAF );
    scene.add( ambientLight );

    var spotLight = new THREE.SpotLight( 0xffffee );
    spotLight.position.set( 0, 1000, 0 );

    spotLight.castShadow = true;

    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;

    spotLight.shadowCameraNear = 500;
    spotLight.shadowCameraFar = 4000;
    spotLight.shadowCameraFov = 30;
    spotLight.shadowMapVisible = true;

    scene.add( spotLight );

	var floorGeometry = new THREE.BoxGeometry( 1600, 980, 5 );
	var floorTexture = THREE.ImageUtils.loadTexture( "images/concrete_floor.png" );
	var floorMaterial = new THREE.MeshPhongMaterial( { map: floorTexture, bumpMap: THREE.ImageUtils.loadTexture('images/concrete_floor_bump.png'), shininess: 1, bumpScale: 2.5 } );
	var floor = new THREE.Mesh( floorGeometry, floorMaterial );
	floor.rotateX(-90 * Math.PI / 180);
	scene.add( floor );
	var otherFloorGeometry = new THREE.BoxGeometry( 1600, 620, 5 );
    var otherFloorTexture = THREE.ImageUtils.loadTexture( "images/other_floor.png" );
    var otherFloorMaterial = new THREE.MeshPhongMaterial( { map: otherFloorTexture, bumpMap: THREE.ImageUtils.loadTexture('images/concrete_floor_bump.png'), shininess: 1, bumpScale: 2.5 } );
    var otherFloor = new THREE.Mesh( otherFloorGeometry, otherFloorMaterial );
    otherFloor.rotateX(-90 * Math.PI / 180); otherFloor.translateY(800);
    scene.add( otherFloor );

    var buildingGeometry = new THREE.BoxGeometry( 1700, 1700, 1700 );
    var buildingTexture = THREE.ImageUtils.loadTexture( "images/concrete_side.png" );
    buildingTexture.wrapS = buildingTexture.wrapT = THREE.RepeatWrapping;
    buildingTexture.repeat.set( 11, 11 );
    var buildingBumpTexture = THREE.ImageUtils.loadTexture( "images/concrete_side_bump.png" );
    buildingBumpTexture.wrapS = buildingBumpTexture.wrapT = THREE.RepeatWrapping;
    buildingBumpTexture.repeat.set( 11, 11 );
    buildingBumpTexture.offset.set( 0.1, 0.1 );
    var buildingMaterial = new THREE.MeshPhongMaterial( {map: buildingTexture, bumpMap: buildingBumpTexture, shininess: 1, bumpScale: 1 } );
    var building = new THREE.Mesh( buildingGeometry, buildingMaterial );
    building.translateY(-850); building.translateZ(-300);
    scene.add( building );

    for (var i = 0; i < 3; i++) {
        var sideGeometry = new THREE.BoxGeometry( 1700, 100, 50 );
        var sideTexture = THREE.ImageUtils.loadTexture( "images/concrete_side.png" );
        sideTexture.wrapS = sideTexture.wrapT = THREE.RepeatWrapping;
        sideTexture.repeat.set( 11, 1 );
        var sideBumpTexture = THREE.ImageUtils.loadTexture( "images/concrete_side_bump.png" );
        sideBumpTexture.wrapS = sideBumpTexture.wrapT = THREE.RepeatWrapping;
        sideBumpTexture.repeat.set( 11, 1 );
        sideBumpTexture.offset.set( 0.1, 0.1 );
        var sideMaterial = new THREE.MeshPhongMaterial( {map: sideTexture, bumpMap: sideBumpTexture, shininess: 1, bumpScale: 1 } );
        var side = new THREE.Mesh( sideGeometry, sideMaterial );
        side.translateY(25);
        scene.add( side );

        var sideTopGeometry = new THREE.BoxGeometry( 1700, 20, 60 );
        var sideTopMaterial = new THREE.MeshPhongMaterial( {color: 0x333333, bumpMap: sideBumpTexture, shininess: 1, bumpScale: 1 } );
        var sideTop = new THREE.Mesh( sideTopGeometry, sideTopMaterial );
        sideTop.rotateX(15 * Math.PI / 180); sideTop.translateY(50); sideTop.translateZ(-10);
        side.add( sideTop );

        var fenceGeometry = new THREE.PlaneGeometry( 1650, 275 );
        var fenceTexture = THREE.ImageUtils.loadTexture( "images/chain_link.png" );
        fenceTexture.wrapS = sideTexture.wrapT = THREE.RepeatWrapping;
        fenceTexture.repeat.set( 6, 1 );
        var fenceMaterial = new THREE.MeshBasicMaterial( {map: fenceTexture, side: THREE.DoubleSide, transparent: true } );
        var fence = new THREE.Mesh( fenceGeometry, fenceMaterial );
        fence.translateY(200);
        side.add( fence );

        if (i == 0) { side.translateZ(-1125); }
        else if (i == 1) { side.translateX(-825); side.translateZ(-300); { side.rotateY(90 * Math.PI / 180); } }
        else if (i == 2) { side.translateX(825); side.translateZ(-300); { side.rotateY(-90 * Math.PI / 180); } }
    }

    var backgroundGeometry = new THREE.CylinderGeometry( 2000, 2000, 2000, 2000 );
    var backgroundTexture = THREE.ImageUtils.loadTexture( "images/background.jpg" );
    var backgroundMaterial = new THREE.MeshBasicMaterial( {map: backgroundTexture, side: THREE.DoubleSide } );
    var background = new THREE.Mesh( backgroundGeometry, backgroundMaterial );
    background.translateY(250); background.translateZ(-300);
    scene.add( background );

	requestAnimationFrame( update );
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
		//forceX = 11.3;//todo////////////force of ball for testing
		ball_forward = forceX * Math.cos(angle);
		ball_forward = Math.abs(ball_forward);
		ball_up = forceX * Math.sin(angle);
		ball_up = Math.abs(ball_up);
		shooter = true;
		Vfinal = -ball_up;
		//ball_angle = 0;
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

//====================== Power Bar ===============================================
// Setup power bar window
var powbar_geom = new THREE.BoxGeometry(100, 20, 2);
var powbar_dim_mat = new THREE.MeshBasicMaterial( {color: 0xb8740a});
var powbar_lit_mat = new THREE.MeshBasicMaterial( {color: 0xff9e0a});
var powbar = new THREE.Mesh( powbar_geom, powbar_dim_mat );

var border_geom = new THREE.BoxGeometry(105, 25, 1.5);
var border_dim_mat = new THREE.MeshBasicMaterial( {color: 0x000000});
var border_lit_mat = new THREE.MeshBasicMaterial( {color: 0xfdff10});
var border = new THREE.Mesh( border_geom, border_dim_mat);

var power_indicator_geom = new THREE.BoxGeometry(0.1, 5, 2.5);
var power_indicator_mat = new THREE.MeshBasicMaterial( {color: 0x37ec27});
var power_indicator_bad_mat = new THREE.MeshBasicMaterial( {color: 0xdb0b00});
var power_indicator = new THREE.Mesh( power_indicator_geom, power_indicator_mat);

var gauge_geom = new THREE.BoxGeometry(80, 5, 2.3);
var gauge_mat = new THREE.MeshBasicMaterial( {color: 0x7c5100});
var gauge = new THREE.Mesh( gauge_geom, gauge_mat );
powbar.add(border);
powbar.add(power_indicator);
powbar.add(gauge);
scene.add(powbar);
camera.add(powbar);

// Orient power bar in window
powbar.translateX(-22);
powbar.translateY(105);
powbar.translateZ(-200);

// Update power bar
var incrementer = 1;
function managePowerbar() {
	if (shootingOn) {
		powbar.material = powbar_lit_mat;
		border.material = border_lit_mat;
	} else {
		powbar.material = powbar_dim_mat;
		border.material = border_dim_mat;
	}
	
	if (incrementer > 800) {
		power_indicator.material = power_indicator_bad_mat;
	} else {
		power_indicator.material = power_indicator_mat;
	}
	
	if (incrementer >= 1000) {
		incrementer = 1000;
	}
	power_indicator.scale.setX(incrementer);
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

	if(keyboard.pressed("z") && !shooter)
	{

		ball_test.position.x =0;
		ball_test.position.z =0;
	}




}
keyboard.domElement.addEventListener('keydown', onKeyDown );

//====================== ANIMATE =========================================
var upTime = 0;
// SETUP UPDATE CALL-BACK
update = function() {
    requestAnimationFrame( update );
    renderer.render( scene, camera );
	
	managePowerbar();
	
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

		if(NumOfBounces >= 50){
			shooter = false;
			ball_forward = 0;
			ball_up = 0;
			NumOfBounces=0;


			//ball_angle = 0;
		}
	}
	if (mousedown && dragTime < 500) {
		dragTime++;
		if (shootingOn) {
		incrementer+= 10.95;
		}
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