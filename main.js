// import kaboom lib cdn
import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

const SPEED = 500;
const JUMP_FORCE = 1300;
const GRAVITY = 4000;
let score = 0;
//initialize kaboom
kaboom();
// load sprites
loadSprite("capybara", "sprites/capybara-v2-0.png");
loadSprite("background", "backgrounds/Summer4.png");

scene("game", () => {
  add([sprite("background", { width: width(), height: height() })]);
  const capybara = add([
    // list of components
    sprite("capybara"),
    pos(100, 40),
    area(),
    body({ jumpForce: JUMP_FORCE }),
    scale(5.1),
  ]);

  onKeyPress("space", () => {
    if (capybara.isGrounded()) {
      capybara.jump();
    }
  });
  onKeyPress("w", () => {
    if (capybara.isGrounded()) {
      capybara.jump();
    }
  });
  onClick(() => {
    if (capybara.isGrounded()) {
      capybara.jump();
    }
  });

  // add platform
  add([
    rect(width() + 6, 48),
    pos(0, height() - 48),
    outline(4),
    area(),
    body({ isStatic: true }),
    color(0, 180, 2),
  ]);

  setGravity(GRAVITY);

  function spawnTree() {
    add([
      // the tree components
      rect(48, rand(24, 64)),
      area(),
      outline(4),
      pos(width(), height() - 48),
      anchor("botleft"),
      color(200, 0, 0),
      move(LEFT, SPEED),
      "tree", // tag
      offscreen({ destroy: true }),
      "tree",
    ]);
    wait(rand(0.8, 2), () => {
      spawnTree();
    });
  }

  spawnTree();

  capybara.onCollide("tree", () => {
    addKaboom(capybara.pos);
    shake();
    go("lose");
  });

  const scoreLabel = add([text(score), pos(24, 24), color(0, 0, 0)]);

  loop(0.08, () => {
    score++;
    scoreLabel.text = score;
  });
});

scene("lose", () => {
  add([
    text("Game Over!"),
    pos(center()),
    anchor("center"),
    color(0, 0, 0),
    scale(1.5),
  ]);
  add([
    text(`${score} points`),
    pos(width() / 2, height() / 2 + 80),
    scale(1.2),
    anchor("center"),
    color(0, 0, 0),
  ]);
  add([
    text("Press space to play again"),
    pos(width() / 2, height() / 2 + 420),
    anchor("center"),
    color(0, 0, 0),
    scale(1),
  ]);

  score = 0;

  // go back to game with space is pressed
  onKeyPress("space", () => go("game"));
  onKeyPress("w", () => go("game"));
  onClick(() => go("game"));
});

go("game");
