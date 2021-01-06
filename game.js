/**
 * @name T-Rex sample game
 * @author Marcin Zygmunt
 * @version 1.0
 * 
 */

document.addEventListener('DOMContentLoaded',() => {
//set const varas *NO NEED TO CHANGE* 
const dino = document.getElementById('dino');
const grid = document.getElementById('grid');
const gridBg = document.getElementById('gridBg');
const scoreboard = document.getElementById('score');
const gameOver = document.getElementById('gameOver')
const status = document.getElementById('status')

//game setings
let position = 10 //dino start position
let basepostion = position; // stored init value *NO NEED TO CHANGE* 
let isJumping = false //for jump purpose *NO NEED TO CHANGE* 
let jumpStep = 30 //jump speed 
let jumpHeightMulti =  60 //multipler for jump speed for max jump height
let refreshInterv = 10 // refreshing interval for game
let gameSpeed = 5 // game speed 
let gravity = 0.1 * (gameSpeed/10) //garvity force
let score = 0 // initla score
let gameRunning = false; //temp var *NO NEED TO CHANGE* 
let isGameOver = false //temp var *NO NEED TO CHANGE* 

let img = document.createElement('img')
img.src = 'images/castle.jpg'
let bgPosition = 0;
// COMPUTED VALUES
let jumpMaxHeight = (jumpStep*gravity) * jumpHeightMulti //calcuating max height
let radomTimeOffset = refreshInterv * jumpStep * jumpHeightMulti //calculating delay for obstacle genration based on jumplenght and game refreshinterval
// 
//BACKGROUND LOOP

function bgLoop()
{
    gridBg.appendChild(img)
    gridBg.appendChild(img.cloneNode(true))
    let bganim = setInterval(function() {
   
        if (!isGameOver && gameRunning) 
        {     
        bgPosition -= gameSpeed;
        if (Math.abs(bgPosition) >=  grid.getBoundingClientRect().width)   bgPosition = 0
        gridBg.style.left = bgPosition
       
        } 
        
    },refreshInterv)
    
}

// OBSTACLES function 
function generateObstacles() {
    if (!isGameOver) 
     {   
        let randomTime = (Math.random() * radomTimeOffset) + (gravity*radomTimeOffset) //msec interval to make game playable 
        //create obstalce div and add to it some classes
        const obstacle = document.createElement('div')
        obstacle.classList.add('obstacle')
        obstacle.classList.add('hideonover')
        // calculate obstacle postion outsied visible box
        let obstaclePosition = grid.getBoundingClientRect().width + obstacle.getBoundingClientRect().width 
        //append obstacle to grid and set positon
        grid.appendChild(obstacle)
        obstacle.style.left = obstaclePosition
    
    //Start interval fo movin obstacles  
    let timerObstacle = setInterval(function() {
    if (obstaclePosition < 0 - obstacle.getBoundingClientRect().width) {   
        clearInterval(timerObstacle)
        obstacle.remove()
        score += 10;
        //increse game speed at score +
        radomTimeOffset -= 10 
        gameSpeed +=0.1 
        scoreboard.textContent = score    // write score to page
        } else {
        obstaclePosition -= gameSpeed
        obstacle.style.left = obstaclePosition +'px'
        // check for colision and stop the game
            if (obstaclePosition > 10 && obstaclePosition < dino.getBoundingClientRect().width && position < obstacle.getBoundingClientRect().height){
            clearInterval(timerObstacle)
            gameOver.style.visibility = "visible"
            dino.classList.remove('dinoAnimation')
            dino.style.width = '70px'
            dino.style.backgroundImage = 'url(images/ch_dead.png)'
            isGameOver = true
            document.querySelectorAll('.hideonover').forEach(e => e.remove());  //remove all elements with hideonover class
            }
        }
    },refreshInterv)
    //run obstacle generation on randomTime
    timeout = setTimeout(generateObstacles,randomTime)
    }   else    {
        timeout.clearTimeout();
        while(grid.firstChild)  {
           // grid.removeChild(grid.lastChild)
        }
    }
}

// BACKGROUND ELEMENTS function 
function generateBackElem(elem,offset,speed) {
    if (!isGameOver)    {   
        let randomTime = Math.random() * offset //Element creation offset / time
        const backelem = document.createElement('div')
        backelem.classList.add(elem)
        backelem.classList.add('hideonover')
        grid.appendChild(backelem)
        let backelemPosition = grid.getBoundingClientRect().width + backelem.getBoundingClientRect().width
        backelem.style.left = backelemPosition

    let timerbackelem = setInterval(function() {
    if (backelemPosition < 0 - backelem.getBoundingClientRect().width)  {   
        clearInterval(timerbackelem)
        backelem.remove()
        } else {
            backelemPosition -= speed
            backelem.style.left = backelemPosition +'px'
        }
    },refreshInterv)
    //run obstacle generation on randomTime
    timeoutback = setTimeout(function(){generateBackElem(elem,radomTimeOffset,gameSpeed);},randomTime)
    }
}

//Dino JUMP function
function dinoJump() {
    if (!isGameOver)
    {   
        let up = true
        let timer = setInterval(function() {  
        if (!up)
            {   //going down
                if ( position > basepostion) 
                position -= jumpStep * gravity
                else 
                {
                position = basepostion
                clearInterval(timer)
                isJumping = false 
                }  
            } 
            else
            {    //going up
                if (position > jumpMaxHeight)
                up = false;
                else position += jumpStep
            }
            dino.style.bottom = position+'px' //moving Dino
        },refreshInterv) 

    }
}
//Game Start
bgLoop();


function gameStart(e) {
    if (e.keyCode == 32 && !gameRunning) {
       
        gameRunning = true;
        document.getElementById('gameStart').remove()
        dino.classList.add('dinoAnimation')
        generateObstacles() // generate obstacles boxes
        generateBackElem('back_elem',100+(refreshInterv*gameSpeed*20), gameSpeed) // generate  mousholes 
        generateBackElem('back_elem2',60, gameSpeed) // generate  chains
        generateBackElem('back_elem3',100+(refreshInterv*gameSpeed*100), gameSpeed) // generate windows
    } else {
        
        if (!isJumping) {// check if dino is on ground
            isJumping = true 
             dinoJump(); // call dinoJump function  
        }
    }
}
document.addEventListener('keyup', gameStart)

//Restart game on playAgain button
const refreshPage = () => {
    location.reload();
  }
  document.getElementById('playAgain').addEventListener('click', refreshPage)
})
