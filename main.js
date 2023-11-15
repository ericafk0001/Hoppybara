// import kaboom lib cdn
import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

const SPEED = 500;
let score = 0;
//initialize kaboom
kaboom();
// load a sprite "capybara" from an image
loadSprite("capybara", "sprites/capybara.png");

scene("game", () => {
  const capybara = add([
    // list of components
    sprite("capybara"),
    pos(80, 40),
    area(),
    body(),
    scale(3),
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

  // add platform
  add([
    rect(width() + 6, 48),
    pos(0, height() - 48),
    outline(4),
    area(),
    body({ isStatic: true }),
    color(0, 180, 2),
  ]);

  setGravity(1600);

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
  onClick(() => go("game"));
});

go("game");
