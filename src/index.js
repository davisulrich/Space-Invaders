// import "./styles.css";
// Video: https://www.youtube.com/watch?v=ytCWn96h3j4 4.30

const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const PLAYER_WIDTH = 20;
const PLAYER_MAX_SPEED = 500;

const LASER_MAX_SPEED = 300;
// how long in seconds it takes for laser to shoot again
const LASER_COOLDOWN = 0.2;

const ENEMIES_PER_ROW = 10;
// how far from right and left edges of screen to start
const ENEMY_HORIZONTAL_PADDING = 80;
// how far from top of screen to start
const ENEMY_VERTICAL_PADDING = 70;
// space in between rows of enemies
const ENEMY_VERTICAL_SPACING = 80;

const GAME_STATE = {
  lastTime: Date.now(),
  leftPressed: false,
  rightPressed: false,
  spacePressed: false,
  playerX: 0,
  playerY: 0,
  playerCoolDown: 0,
  lasers: []
};

// Set position of player or enemy
function setPosition($el, x, y) {
  $el.style.transform = `translate(${x}px, ${y}px)`;
}

// Clamps the player from going outside the screen
function clamp(currPosition, min, max) {
  if (currPosition < min) {
    return min;
  } else if (currPosition > max) {
    return max;
  } else {
    return currPosition;
  }
}

// Create player object
function createPlayer($container) {
  // X and Y position
  GAME_STATE.playerX = GAME_WIDTH / 2;
  GAME_STATE.playerY = GAME_HEIGHT - 50;

  // Get player image
  const $player = document.createElement("img");
  $player.src = "src/images/playerShip1_green.png";
  $player.className = "player";
  $container.appendChild($player);

  // Set player position
  setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

// Initialize game
function init() {
  const $container = document.querySelector(".game");
  createPlayer($container);

  const enemySpacing =
    (GAME_WIDTH - ENEMY_HORIZONTAL_PADDING * 2) / (ENEMIES_PER_ROW - 1);

  // for the three rows of enemies,
  for (let j = 0; j < 3; j++) {
    const y = ENEMY_VERTICAL_PADDING + j * ENEMY_VERTICAL_SPACING;
  }
}

// update player
function updatePlayer(deltaTime, $container) {
  if (GAME_STATE.leftPressed) {
    GAME_STATE.playerX -= deltaTime * PLAYER_MAX_SPEED;
  }
  if (GAME_STATE.rightPressed) {
    GAME_STATE.playerX += deltaTime * PLAYER_MAX_SPEED;
  }
  // Check edges of screen
  GAME_STATE.playerX = clamp(
    GAME_STATE.playerX,
    PLAYER_WIDTH,
    GAME_WIDTH - PLAYER_WIDTH
  );

  // create new laser
  if (GAME_STATE.spacePressed && GAME_STATE.playerCoolDown <= 0) {
    createLaser($container, GAME_STATE.playerX, GAME_STATE.playerY);
    GAME_STATE.playerCoolDown = LASER_COOLDOWN;
  }

  // if cooldown value greater than 0, subtract delta time
  if (GAME_STATE.playerCoolDown > 0) {
    GAME_STATE.playerCoolDown -= deltaTime;
  }

  const $player = document.querySelector(".player");
  setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

// create a laser
function createLaser($container, x, y) {
  const $element = document.createElement("img");
  $element.src = "src/images/laserBlue01.png";
  $element.className = "laser";
  $container.appendChild($element);

  const laser = { x, y, $element };
  GAME_STATE.lasers.push(laser);

  setPosition($element, x, y);

  // play audio
  const audio = new Audio("src/audio/sfx_laser1.ogg");
  audio.play();
}

// update the laser objects
function updateLasers(deltaTime, $container) {
  const lasers = GAME_STATE.lasers;
  for (let i = 0; i < lasers.length; i++) {
    const laser = lasers[i];
    laser.y -= deltaTime * LASER_MAX_SPEED;

    if (laser.y < 0) {
      destroyLaser($container, laser);
    }

    setPosition(laser.$element, laser.x, laser.y);
  }

  GAME_STATE.lasers = GAME_STATE.lasers.filter((e) => !e.isDead);
}

// when the laser goes off the screen, delete it
function destroyLaser($container, laser) {
  $container.removeChild(laser.$element);
  laser.isDead = true;
}

// The gameloop
function update() {
  const currentTime = Date.now();
  const deltaTime = (currentTime - GAME_STATE.lastTime) / 1000;

  const $container = document.querySelector(".game");
  updatePlayer(deltaTime, $container);
  updateLasers(deltaTime, $container);

  GAME_STATE.lastTime = currentTime;
  window.requestAnimationFrame(update);
}

function onKeyDown(e) {
  // Left arrow
  if (e.keyCode === KEY_CODE_LEFT) {
    GAME_STATE.leftPressed = true;
  } else if (e.keyCode === KEY_CODE_RIGHT) {
    GAME_STATE.rightPressed = true;
  } else if (e.keyCode === KEY_CODE_SPACE) {
    GAME_STATE.spacePressed = true;
  }
}

function onKeyUp(e) {
  // Left arrow
  if (e.keyCode === KEY_CODE_LEFT) {
    GAME_STATE.leftPressed = false;
  } else if (e.keyCode === KEY_CODE_RIGHT) {
    GAME_STATE.rightPressed = false;
  } else if (e.keyCode === KEY_CODE_SPACE) {
    GAME_STATE.spacePressed = false;
  }
}

init();

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.requestAnimationFrame(update);
