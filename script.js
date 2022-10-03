let container = document.getElementById('container');
let containerHeight = container.clientHeight;
let containerWidth = container.clientWidth;

const playerSize = 80;
const obstacleSize = 60;
// Obstacle Movement Counter
let move = null;
let newObstacles = null;
let jump = null;
// Player Ground Position
let playerVerticalPos = containerHeight - playerSize;
// Player horizontal Position
let horizontalPos = 40;
// How high the player can jump!
let playerJumpHeight = 200;
// Run Step!!
const step = 5;
// Obstacle Step!!
const movestep = 2;
// Obstacle Position
const divider = 1.1
let obstableWidthPos = containerWidth - obstacleSize / divider
let obstacleHeightPos = containerHeight - obstacleSize / divider
// Obstacle Delay
let obstacleDelay = 500
// Obstacles List
const obstableTypes = [
    "rock.png", "rocks.png",
    "dog.gif", "zombie.gif",
    "spike.gif", "tree.png",
    "spikeball.png"
]

let score = 0;
const scoreCounter = document.getElementById("scoreCounter")

const playerObstacles = []

const playerJump = player => {
    player.style.backgroundImage = `url(./player/Jump.gif)`
}

const playerRun = player => {
    player.style.backgroundImage = `url(./player/Run.gif)`
}

const player = document.createElement('div');
const createPlayer = () => {
    player.classList.add("player")
    player.style.left = `${horizontalPos}px`
    player.style.height = `${playerSize}px`
    player.style.width = `${playerSize}px`
    player.style.top = `${playerVerticalPos}px`
    playerRun(player)

    container.appendChild(player)
}

const createObstable = () => {
    newObstacles = setTimeout(function create() {
        const obstable = document.createElement('div');
        obstacleDelay = 3000;
        const type = Math.floor(Math.random() * obstableTypes.length)
        obstable.classList.add("obstacle")
        obstable.style.position = 'absolute'
        obstable.style.width = `${obstacleSize}px`
        obstable.style.height = `${obstacleSize}px`
        obstable.style.top = `${obstacleHeightPos}px`
        obstable.style.left = `${obstableWidthPos}px`
        obstable.style.backgroundImage = `url(./obstacles/${obstableTypes[type]})`
        const newObs = container.appendChild(obstable)
        playerObstacles.push(newObs)
        newObstacles = setTimeout(create, obstacleDelay)
    }, obstacleDelay)
}

const moveObstacles = async () => {
    createObstable();

    move = setInterval(async () => {
        for (let obs of playerObstacles) {
            const currentPos = parseInt(obs.style.left.replace('px', '')) - movestep
            obs.style.left = `${currentPos}px`
            if (currentPos <= 0) {
                obs.remove();
                playerObstacles.splice(0, 1);
                score += 5;
                scoreCounter.innerText = score
            }
        }
    }, 10)
}

document.addEventListener('keydown', e => {
    // Player Selectors
    const player = document.querySelector('.player');

    switch (e.code) {
        case "ArrowUp":
            let goingUp = true;
            const upStep = 2;
            const downStep = 1;
            let altitude = playerJumpHeight;
            playerJump(player);

            jump = setInterval(() => {
                if (goingUp) {
                    altitude -= upStep;
                    if (altitude <= 0) goingUp = false;
                    playerVerticalPos -= upStep;
                }
                else {
                    altitude += downStep;
                    if (altitude >= playerJumpHeight) goingUp = true;
                    playerVerticalPos += downStep;
                }

                if (altitude >= playerJumpHeight) {
                    playerRun(player);
                    clearInterval(jump);
                }

                player.style.top = `${playerVerticalPos}px`
            }, 0)
            break
        case "ArrowLeft":
            horizontalPos -= step;
            if (horizontalPos < 0) horizontalPos = 0;

            player.style.left = `${horizontalPos}px`
            break
        case "ArrowRight":
            horizontalPos += step;
            if (horizontalPos > containerWidth - playerSize) horizontalPos = containerWidth - playerSize;
            player.style.left = `${horizontalPos}px`
            break
    }
})

const updateBoudries = () => {
    container = document.getElementById('container');
    containerHeight = container.clientHeight;
    containerWidth = container.clientWidth;
    playerVerticalPos = containerHeight - playerSize;
    obstacleHeightPos = containerHeight - obstacleSize / divider
    obstableWidthPos = containerWidth - obstacleSize / divider

    player.style.top = `${playerVerticalPos}px`
    for (const obs of playerObstacles) {
        obs.style.top = `${obstacleHeightPos}px`
        obs.style.left = `${obstableWidthPos}px`
    }
}

window.addEventListener('resize', () => updateBoudries())

// Start the game
createPlayer();
moveObstacles();

const stateChecker = setInterval(() => {
    if (playerObstacles.length > 0) {
        const obstacleLeftPos = parseInt(playerObstacles[0].style.left.replace('px', ''))
        const obstacleTopPos = parseInt(playerObstacles[0].style.top.replace('px', ''))
        const distance = obstacleLeftPos - horizontalPos;
        if(distance <= playerSize/1.5 && distance > (obstacleLeftPos-playerSize)){
            if(playerVerticalPos >= (obstacleTopPos-obstacleSize)){                
                clearInterval(move)
                clearInterval(jump)
                clearInterval(stateChecker)
                clearTimeout(newObstacles)
            }
        }
    }
}, 0)