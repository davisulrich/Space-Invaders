// import "./styles.css";
const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const playerWidth = 20;

const GAME_STATE = {
  leftPressed: false,
  rightPressed: false,
  spacePressed: false,
  playerX: 0,
  playerY: 0
};

// Set position of player or enemy
function setPosition($el, x, y) {
  $el.style.transform = `translate(${x}px, ${y}px)`;
}

// Clamps the player from going outside the screen
function clamp(currPosition, min, max) {
  if (currPosition < min) {
    return min;
  } else if (currPosition + playerWidth / 2 > max) {
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
}

// update player
function updatePlayer() {
  if (GAME_STATE.leftPressed) {
    GAME_STATE.playerX -= 10;
  }
  if (GAME_STATE.rightPressed) {
    GAME_STATE.playerX += 10;
  }
  // Check edges of screen
  GAME_STATE.playerX = clamp(
    GAME_STATE.playerX,
    playerWidth,
    GAME_WIDTH - playerWidth
  );

  const $player = document.querySelector(".player");
  setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}
// The gameloop
function update() {
  updatePlayer();
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

// document.getElementById("app").innerHTML = `
// <h1>Hello Vanilla!</h1>
// <div>
//   We use the same configuration as Parcel to bundle this sandbox, you can find more
//   info about Parcel
//   <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
// </div>
// `;
