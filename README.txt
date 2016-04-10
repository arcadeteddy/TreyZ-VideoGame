======================================================================================
============================== Project 4: TreyZ ======================================
======================================================================================

Member 1: Yi Yang			20338142    n3v9a	yaqixyz@gmail.com
Member 2: Adam Magdurulan	34072124	z5r8	adam_m1@hotmail.ca
Member 3: Theodore Lau		12492112	i2v8	theodore.lau.888@gmail.com 


WHAT: TreyZ is a challenging sideline basketball shootout with an exotic and
vibrant setting. The player is to make as many points as they can within a maximum 
of 25 shots. Failure to get 25/25 shots will result in a game over, ergo the difficulty
aspect. Shots are performed through timed hold & release mechanics. 
The basketball follows realistic trajectories and interactions with the hoop.

Advanced functionality items:
- Advanced rendering effects: bump mapping on rack balls and court floor, environment
	mapping
- Shaders: phong and flat shading used on stage objects
- Texture mapping: UV texture mapping on basketball hoop and backboard, basketballs,
	court floor, wrapping textures to make the fences
- Collision Detection: realistic bouncing of the ball off of the backboard, rim, 
court floor (supports multiple collision if the ball touches both the rim and backboard)
- Animation: Background objects animated, smoothly animated basketball flight path

HOW: 
- Blender used to model and export complex geometry into THREE.js
- combination of conditional statements and computation of bounding boxes to 
  perform collisions
- used loops to render multiple instances of the same object into the scene if needed
	rather than creating completely new objects , instances stored in arrays
- directional velocity variables to keep track of the ball trajectory
- pseudo observer/listener pattens for mouse shooting and game state

HOWTO:
Keyboard controls:
- 'Q' to enter/exit shooting mode, toggles powerbar on/off (lit/unlit) accordingly
- 'W' to increase the angle of the shooting hand (determines shot angle)
- 'S' to decrease the angle of the shooting hand 
- Click and hold the left mouse button (LMB) while in shooting mode to shoot ball
	(duration of shot determines the power of the shot, reflected by the powerbar)
- 'Z' to reset the ball to shooting posiiton

Sources
- THREE.js documentation
- NBA 2K - https://pbs.twimg.com/profile_images/606562975109890048/SumJOzUN.jpg
- some lighting ideas from http://buildnewgames.com/webgl-threejs/ and basic
	bounds checking
- inspiration http://www.onlinegames.com/basketball/
- Blender
- Photoshop
- Google
- Youtube
  

