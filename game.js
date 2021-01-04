document.addEventListener('DOMContentLoaded',() => {
const dino = document.getElementById('dino');
const grid = document.getElementById('grid');
const scoreboard = document.getElementById('score');
const gameOver = document.getElementById('gameOver')
let position = 10 //dino position
let basepostion = position;
let isJumping = false
let gravity = 0.1 //garvity force
let jumpStep = 30 //step
let jumpHeightMulti =  30 //multopler for max jump height
let refreshInterv = 20
let radomTimeOffset = refreshInterv * jumpStep * jumpHeightMulti //delay based on jumplenght and game refreshinterval
let gameSpeed = 5
let score = 0
console.log(radomTimeOffset);
// computing  hight
let jumpMaxHeight = (jumpStep*gravity) * jumpHeightMulti
let isGameOver = false
console.log(jumpMaxHeight);
function control(e) {
    if (e.keyCode == 32)
    {
       console.log("space");
        
       if (!isJumping)
       {
            isJumping = true
             dinoJump();    
       }
        //on space 
    }
}
document.addEventListener('keyup', control)

function dinoJump() {
    if (!isGameOver)
    {   
            let up = true
            let timer = setInterval(function() {
            console.log(dino.style.bottom);
            console.log(up);
        
        if (!up)
            {
                //going down
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
            {
                //going up
                if (position > jumpMaxHeight)
                up = false;
                else position += jumpStep
            }
            dino.style.bottom = position+'px'
        },refreshInterv) 

    }
}

function generateObstacles() {
    if (!isGameOver)
     {   
        let randomTime = (Math.random() * radomTimeOffset) + (gravity*radomTimeOffset) //msec
        let obstaclePositionOffset = 100
        let obstaclePosition = grid.getBoundingClientRect().width + obstaclePositionOffset
        const obstacle = document.createElement('div')
        obstacle.classList.add('obstacle')
        obstacle.classList.add('hideonover')
        grid.appendChild(obstacle)
        obstacle.style.left = obstaclePosition
        console.log(randomTime);

    let timerObstacle = setInterval(function() {

    if (obstaclePosition < 10)
        {   
        clearInterval(timerObstacle)
        obstacle.remove()
        score += 10;
        radomTimeOffset -= 10 //increse game speed
        scoreboard.textContent = score    
        } else 
        {
        obstaclePosition -= gameSpeed
        obstacle.style.left = obstaclePosition +'px'
            if (obstaclePosition > 10 && obstaclePosition < dino.getBoundingClientRect().width && position < obstacle.getBoundingClientRect().height){
            clearInterval(timerObstacle)
           gameOver.style.visibility = "visible"
            isGameOver = true
            document.querySelectorAll('.hideonover').forEach(e => e.remove());
            }
        }
    },refreshInterv)
    timeout = setTimeout(generateObstacles,randomTime)
    }
    else
    {
        timeout.clearTimeout();
        while(grid.firstChild)
        {
           // grid.removeChild(grid.lastChild)
        }
    }
}

function generateBackElem(elem) {
    if (!isGameOver)
     {   
        let randomTime = Math.random() * radomTimeOffset //msec
        let backelemPositionOffset = 100
        let backelemPosition = grid.getBoundingClientRect().width + backelemPositionOffset
        const backelem = document.createElement('div')
        backelem.classList.add(elem)
        backelem.classList.add('hideonover')
        grid.appendChild(backelem)
        backelem.style.left = backelemPosition
        console.log(randomTime);

    let timerbackelem = setInterval(function() {
    if (backelemPosition < 0)
        {   
        clearInterval(timerbackelem)
        backelem.remove()
        } else 
        {
            backelemPosition -= gameSpeed / 2
            backelem.style.left = backelemPosition +'px'
        }
    },refreshInterv)
    timeoutback = setTimeout(function(){generateBackElem(elem);},randomTime)
    }
}

generateObstacles()
generateBackElem('back_elem')
generateBackElem('back_elem2')

const refreshPage = () => {
    location.reload();
  }
  
  document.getElementById('playAgain').addEventListener('click', refreshPage)

})
