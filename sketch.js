/*

DELIVERABLE COMMENTS:

I HAVE DECIDED TO IMPLEMENT ALL FOUR EXTENSIONS LISTED BELOW.
1) ADD ADVANCED GRAPHICS: I HAVE IMPROVED GRAPHICS FROM PREVIOUS SUBMISSIONS ADDING FURTHER ELEMENTS SUCH AS ADDITIONAL MOUNTAINS, CANYONS, ENEMIES REDESIGN AND A NEW COLOUR PALETTE FOR ALL THE ELEMENTS. NO MAJOR ISSUE HERE ALTHOUGH GIVEN THE TIME CONSTRAINTS I HAD FROM MY JOB I COULD NOT PUSH THIS AS MUCH AS I WISHED.
2) CREATED 2 PLATFORMS AND MADE SURE THAN CHARACTER IS CORRECTLY MOVING ON PLATFORM, THIS WAS THE MOST DIFFICULT PART FOR ME I HAVE SPENT SOMETIME ON THIS PART SINCE I HAD USED GAME PROJECT 6 SUBMISSION AS A DRAFT TO ADD THE EXTENSION BUT FOR SOME REASON THE CHARACTER WAS NOT STAYING ON THE PLATFORM AND I HAD TO GO THROUGH ALL THE CODE AGAIN TO SPOT A VARIABLE SETTING THAT WAS CAUSING ISSUES IN THE GAME CHARACTER FUNCTION.
3) SOUNDS: ADDED THE JUMP SOUND AND IN ADDITION I HAVE ADDED A VINTAGE PACMAN JINGLE THAT PLAYS AT THE START OF THE GAME AND EVERYTIME THE GAME IS RESTARTED AFTER GAME END OR LEVEL REACHED, NO MAJOR ISSUES IN THE IMPLEMENTATION ACQUIRED AN UNDERSTANDING OF SOUND GAME CONCEPTS.
4) ENEMIES, CREATED 2 ENEMIES ACCORDING TO INSTRUCTION, NO MAJOR ISSUES HERE IT WAS QUITE IMMEDIATE FOLLOWING THE INSTRUCTIONS TO CREATE THE EXTENSION.

-DIFFICULT BITS: I HAD PROBLEMS WITH THE CARACHTER PLATFORM POSITIONING, THERE WAS A BUG FROM PREVIOUS SUBMISSIONS I COULD NOT SOLVE AFTER 1 DAY OF BANGING MY HEAD I SOLVED IT SUCCESSFULLY FIXING THE ISFALLING VARIABLE IN THE DRAWGAMECHAR FUNCTION.

-SKILLS LEARNED:I LEARNED MORE THAN EVERYTHING THE IMPORTANCE OF BANGING YOUR HEAD ON THE PROBLEM AND APPLY LOGIC AND USE AN INVESTIGATIVE APPROACH IN SOLVING PROBLEMS, THE TECHNIQUES I HAVE LEARNED IN THIS COURSE IN A GAMIFICATION CONTEXT ARE INVALUABLE AND FOR THIS I WANT TO THANKS BOTH INSTRUCTORS FOR THE GREAT COURSE THEY HAVE CREATED.

The final stage of your Game project is to make your game awesome.

Extensions
Complete two out of four possible extensions shown below.

1. Add advanced graphics DONE!!!
Make your graphics as pretty as possible. We don't think you need tutorials for this.

2. Create platforms DONE!!!

Use the factory pattern to create platforms. Watch the tutorial video from this topic to do this.

3. Add sound DONE!!!

Use p5.sound to add sound effects to your game. Watch the tutorial video from this topic to do this.

4. Create enemies DONE!!!

Use a constructor function to create enemies. To do this, you'll need to wait until the next topic when a tutorial video will be provided.

Make your code awesome
Secondly, review your code and make sure it is awesome. This means:

1. Make sure your code is well formatted. If you're unsure about how to do this, then rewatch the code philosophy video "The elegant coder".
2. Make sure that you have used variables, objects and functions well. The code philosophy lecture, "The elegant coder" also has help for this area.
3. Make sure your code works as well as can be. Iron out those bugs. Code philosophy videos "The debugger's mindset" and "Testing" will help you in your approach to this.

Grading

The assignment grading criteria are as follows.

Code formatting - 20%
Use of variables, objects and functions - 20%
Does it work? - 20%
Extension 1 - 20%
Extension 2 - 20%

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here

https://freesound.org/
*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;


var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var clouds;
var mountains_x;
var canyons;
var collectables;

var game_score;
var flagpole;
var lives;

var platforms;
var enemies;

var jumpSound;
var startjingle;

function preload()
{
    soundFormats('mp3','wav');
    
    //Load sounds
    
    startjingle = loadSound('assets/beginning.wav');
    startjingle.setVolume(0.1);
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
}


function setup()
{
	createCanvas(1024, 576);
    lives = 3;
    startGame();

}

function startGame()
{
    //Play StartJingle at start of game.
    
    if(lives > 0)
    {
        startjingle.play();
    }
    
    //Start initialization.
    
    floorPos_y = height * 3/4; 
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
    
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game world. Needed for collision detection.
    
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
    
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    isFound=false;
    isContact=false; 
    

	// Initialise arrays of scenery objects.
    
    trees_x=[60,400,680,900];
    clouds =[{pos_x:100,pos_y:200},
             {pos_x:600,pos_y:100},
             {pos_x:800,pos_y:200}
            ];
    marray = [
        {pos_x:300, height:400},
        {pos_x:500, height:200},
        {pos_x:800, height:200},
        {pos_x:1000, height:300},

    ];
    mountains_x=[50,150,500,700];
    canyons=[{x_pos:200,width:120},
             {x_pos:700,width:120},
             {x_pos:0,width:50}
            ];
    collectables=[{x_pos:350, y_pos:floorPos_y,size:30,isFound:false}, {x_pos:650, y_pos:floorPos_y,size:30,isFound:false}];
    
    platforms = [];
    platforms.push(createPlatforms(100,floorPos_y-70,100));
    platforms.push(createPlatforms(500,floorPos_y-70,100));
    
    game_score=0;
     
    
    enemies =[];
    enemies.push(new Enemy(100,floorPos_y-10,100));
    enemies.push(new Enemy(600,floorPos_y-10,100));
    
    flagpole = {isReached:false,x_pos:1000};
    
}

function draw()
{
	
    background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    push();
    
    
    translate(scrollPos,0);
    
	// Draw clouds.
    
    drawClouds();
    
	// Draw mountains.
    
    drawMountains();
    
	// Draw trees.
    
    drawTrees();
    
    // Draw platforms.
    
    for (var i = 0; i< platforms.length; i++)
        {
            
            platforms[i].draw();
            
        }

	// Draw canyons.
   
    for(var i = 0; i < canyons.length; i++)
    {
    
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
       
    }

	// Draw collectable items.
    
    for(var i = 0; i < collectables.length; i++)
        {
            if (collectables[i].isFound == false )
            {
                drawCollectable(collectables[i]);
                checkCollectable(collectables[i]);
                
 
            }
        }
    
    renderFlagpole();
    
    // Draw Enemies.
    
    for (var i=0; i<enemies.length;i++)
        {
            enemies[i].draw();
            var isContact=enemies[i].checkContact(gameChar_world_x,gameChar_y);
            
            if(isContact)
                {
                    if(lives>0)
                        {
                            startGame();
                            lives-=1;
                            break;
                        }
                }
        }
      

    pop();
    
    
    
	// Draw game character.
	
	drawGameChar();
    
    // Draw Score and Lives.
    
    fill(255);
    noStroke();
    text("Score: " + game_score,20,20);
    
    fill(255);
    noStroke();
    text("Lives: " + lives,20,40);
    fill(255,255,0);
    ellipse(20,50,15,15);
    ellipse(40,50,15,15);
    ellipse(60,50,15,15);
    
  
    //Restart the game if game over or level complete. 
    
    if(lives < 1)
    {
        text("GAME OVER. PRESS SPACE TO CONTINUE", width/2,height/2);
        if(keyCode == 32)
        {
            location.reload();
        }
        return;
    }  
    
    
    if(flagpole.isReached == true)
    {
        
        text("LEVEL COMPLETE. PRESS SPACE TO CONTINUE", width/2,height/2);
        if(keyCode == 32)
        {
            location.reload();
        }
        
        return;
    }
    
    if(gameChar_y>height)
        {
            if(lives>0)startGame();
        }
    
    // Logic to make the game character move or the background scroll.
    
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    
    if (gameChar_y < floorPos_y)  
    {
            var isContact = false;
            for (var i = 0; i < platforms.length; i++)
                {
                    if(platforms[i].checkContact(gameChar_world_x,gameChar_y) == true)
                            {
                        
                                isContact = true;
                                console.log("contact");
                                break;
                            }
                            
                        
                }
            
                if(isContact == false)
                {
                    gameChar_y += 2;
                    isFalling=true;
                }
    }
    else if(gameChar_y <= floorPos_y)
    {
        isFalling = false; 

    }
        
    
    if(flagpole.isReached == false)
    {
        
        checkFlagpole();
        
    }
    
    
        
    // Update real position of gameChar for collision detection.
    
	gameChar_world_x = gameChar_x - scrollPos;
    
    if(lives > 0)
    {
        
    checkPlayerDie();
    
    }
}



// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{

	console.log("press" + keyCode);
	console.log("press" + key);
    if(keyCode == 37)
    {
        console.log("left arrow")
        isLeft=true;
    }
    else if(keyCode == 39)
    {
        console.log("right arrow")
        isRight=true;
    }
    else  if(keyCode == 32 & isFalling!=true) 
        {
            console.log("space")
            gameChar_y -= 100;
            jumpSound.play();
        }

}

function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);
        if(keyCode == 37)
    {
        console.log("left arrow")
        isLeft=false;
    }
    else if(keyCode == 39)
    {
        console.log("right arrow")
        isRight=false;
    }
    
    
}



// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    stroke(0);
    
	if(isLeft && isFalling)
	{
		// add your jumping-left code
        fill(0);
        rect(gameChar_x-12,gameChar_y-10,15,10);
        fill(255,0,0);
        rect(gameChar_x-10,gameChar_y-55,20,50);
        fill(0,255,0);
        ellipse(gameChar_x,gameChar_y-55,25,40);
        rect(gameChar_x+12,gameChar_y-55,10,10);
        fill(35);
        rect(gameChar_x,gameChar_y-10,15,10);

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        fill(0);
        rect(gameChar_x,gameChar_y-10,15,10);
        fill(255,0,0);
        rect(gameChar_x-10,gameChar_y-55,20,50);
        fill(0,255,0);
        ellipse(gameChar_x,gameChar_y-55,25,40);
        rect(gameChar_x-22,gameChar_y-35,10,10);
        fill(35);
        rect(gameChar_x-12,gameChar_y-10,15,10);

	}
	else if(isLeft)
	{
		// add your walking left code
        fill(0);
        rect(gameChar_x-12,gameChar_y-10,15,10);
        fill(255,0,0);
        rect(gameChar_x-10,gameChar_y-55,20,50);
        fill(0,255,0);
        ellipse(gameChar_x,gameChar_y-55,25,40);
        fill(35);
        rect(gameChar_x,gameChar_y-10,15,10);


    }
	else if(isRight)
	{
        fill(0);
        rect(gameChar_x,gameChar_y-10,15,10);
        fill(255,0,0);
        rect(gameChar_x-10,gameChar_y-55,20,50);
        fill(0,255,0);
        ellipse(gameChar_x,gameChar_y-55,25,40);
        fill(35);
        rect(gameChar_x-12,gameChar_y-10,15,10);

	}
	else if(isFalling || isPlummeting)
	{ 
		// add your jumping facing forwards code
        fill(255,0,0);
        rect(gameChar_x-15,gameChar_y-55,30,50);
        fill(0,255,0);
        ellipse(gameChar_x,gameChar_y-55,40,40);
        rect(gameChar_x+12,gameChar_y-55,10,10);
        rect(gameChar_x-22,gameChar_y-35,10,10);
        fill(0);
        rect(gameChar_x-16,gameChar_y-20,10,10);
        rect(gameChar_x+6,gameChar_y-20,10,10);
	}
	else
	{
		// add your standing front facing code

        fill(255,0,0);
        rect(gameChar_x-15,gameChar_y-55,30,50);
        fill(0,255,0);  
        ellipse(gameChar_x,gameChar_y-55,40,40);
        fill(0);
        rect(gameChar_x-16,gameChar_y-10,10,10);
        rect(gameChar_x+6,gameChar_y-10,10,10);
	} 
    
 if (gameChar_y  != floorPos_y && isContact==false) 
    {
        
        gameChar_y += 1;
        isFalling = true; 
        
    }
    else
    {
        isContact=true;
        isFalling = false; 
        
    }         
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(var i=0; i<clouds.length; i++) 
        {
            fill(255);
            ellipse(clouds[i].pos_x,clouds[i].pos_y,55,55);
            ellipse(clouds[i].pos_x+25,clouds[i].pos_y,35,35);
            ellipse(clouds[i].pos_x+45,clouds[i].pos_y,25,25);
        }
}
// Function to draw mountains objects.
function drawMountains()
{
    for(var i=0; i<mountains_x.length; i++) 
        {
            fill(128,128,128);
            triangle(mountains_x[i],floorPos_y,mountains_x[i]+100,floorPos_y-120,mountains_x[i]+200,floorPos_y);
            fill(0,200,0);
            triangle(mountains_x[i]+50,floorPos_y-60,mountains_x[i]+100,floorPos_y-120,mountains_x[i]+150,floorPos_y-60);
            fill(0,128,0);
            triangle(marray[i].pos_x - marray[i].height/2, 
                     floorPos_y, marray[i].pos_x,
                     floorPos_y - marray[i].height,
                     marray[i].pos_x + marray[i].height/2,
                     floorPos_y);


        }
}

// Function to draw trees objects.
function drawTrees()
{
    for (var i=0; i<trees_x.length; i++)
        {
            fill(128,128,128);
            rect(trees_x[i],floorPos_y-80,10,80);
            fill(85,107,47);
            triangle(trees_x[i],floorPos_y-80,trees_x[i]-30,floorPos_y-43,trees_x[i],floorPos_y-43);
            triangle(trees_x[i]+10,floorPos_y-80,trees_x[i]+40,floorPos_y-43,trees_x[i]+10,floorPos_y-43);
            triangle(trees_x[i],floorPos_y-20,trees_x[i]-40,floorPos_y-20,trees_x[i],floorPos_y-43);
            triangle(trees_x[i]+10,floorPos_y-20,trees_x[i]+50,floorPos_y-20,trees_x[i]+10,floorPos_y-43);
        }
 
}



// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(0,0,0);
    rect(t_canyon.x_pos,432,t_canyon.width,200);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y)
        
    {
        isPlummeting = true;
    }
    
    if(isPlummeting == true)
        
    {
            
        gameChar_y += 5;
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    fill(255,255,0);
    ellipse(t_collectable.x_pos,t_collectable.y_pos-20,t_collectable.size,t_collectable.size);
    fill(0,0,0);
    text("$$$",t_collectable.x_pos-10,t_collectable.y_pos-15);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x,gameChar_y,t_collectable.x_pos,t_collectable.y_pos) < 20)
        {
            t_collectable.isFound = true; 
            game_score+=1;
        }
}

//Function to render Flagpole.

function renderFlagpole()
{
    
    push();
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos,floorPos_y,flagpole.x_pos,floorPos_y - 250);
    fill(255,0,0);
    noStroke();
    
    if(flagpole.isReached)
    {
        
        rect(flagpole.x_pos,floorPos_y-250,50,50);
        
    }
    else
    {
        
        rect(flagpole.x_pos,floorPos_y-50,50,50);
    }
    
    
    pop();
}

// Flagpole check function.

function checkFlagpole()
{
    
    var d = abs(gameChar_world_x - flagpole.x_pos);
   
    if(d < 15)
    {
        
        flagpole.isReached = true;
    }
 
}

//Function to check if player is dead.

function checkPlayerDie()
{ 
    
    if(isPlummeting==true)  
    {
        
        lives -= 1; 
        startGame();
        
            
        
    } 
    if (lives <   0)
    {
         
        
        startGame();
        
        
    }

}

//Factory pattern function to create platforms.

function createPlatforms(x,y,length)
{
    
    var p =  {
        x:x,
        y:y,
        length:length,
        draw:function()
        {
            
            fill(0,0,255);
            rect(this.x,this.y,this.length,20);
                      
        },
        checkContact: function(gc_x,gc_y)
        {
            if (gc_x > this.x && gc_x < this.x + this.length)
            {
                    console.log("in line with platform")
                    var d = this.y-gc_y;
                    if (d >= 0 && d < 5)
                        {  
                                                        
                            
                            console.log("on platform");
                            return true;
                            gc_y=this.y;
                        }
                    
            
            }
            
            return false;
            
        }
    }
    return p;
}
 
//Function to create enemies.

function Enemy(x,y,range)
{
    this.x=x;
    this.y=y;
    this.range=range;
    this.currentX=x;
    this.inc = 1;
    
    this.update = function()
    {
        
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
            {
                this.inc=-1;
            }
        else if(this.currentX < this.x)
            {
                this.inc=1;
            }
        
        
    }
    
    this.draw = function()
    {
        this.update();
        fill(255,0,0);
        ellipse(this.currentX,this.y,20,20);
        fill(0,0,0);
        ellipse(this.currentX-5,this.y-2,3,3);
        ellipse(this.currentX+5,this.y-2,3,3);
        ellipse(this.currentX,this.y+5,5,5);
        
    }
    
    this.checkContact = function(gc_x,gc_y)
    {
        var d=dist(gc_x,gc_y,this.currentX,this.y)
        
        if(d<20)
            {
                return true;
            }
        return false;
    }
    
}
