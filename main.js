import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";
//game variables
const SPEED = 400;
const JUMP_FORCE = 1350;
const GRAVITY = 4000;
let score = 0;
//initialize kaboom
kaboom({
  maxFPS: 61,
});
// load assets
loadSound("lifeisfullofjoy", "music/Lifeisfullofjoy.wav");
loadSprite("capybara", "sprites/capybara-v2-0.png");
loadSprite("background", "backgrounds/Summer4.png");

const music = play("lifeisfullofjoy", {
  volume: 0.7,
  loop: true,
});

// Game
scene("game", () => {
  let curTween = null;
  const game = add([timer()]);
  game.add([sprite("background", { width: width(), height: height() })]);
  //add a capybara
  const capybara = game.add([
    sprite("capybara"),
    pos(300, 786),
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
  game.add([
    rect(width() + 6, 48),
    pos(0, height() - 48),
    outline(4),
    area(),
    body({ isStatic: true }),
    color(0, 180, 2),
  ]);
  //gravity
  setGravity(GRAVITY);
  //obstacles
  function spawnTree() {
    game.add([
      // the tree components
      rect(48, rand(26, 64)),
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
    wait(rand(1, 2.5), () => {
      spawnTree();
    });
  }

  spawnTree();
  //death
  capybara.onCollide("tree", () => {
    addKaboom(capybara.pos);
    shake();
    burp();
    go("lose");
  });
  //score
  const scoreLabel = game.add([text(score), pos(24, 24), color(0, 0, 0)]);
  game.loop(0.08, () => {
    score++;
    scoreLabel.text = score;
  });
  //pause menu
  onKeyPress("p", () => {
    game.paused = !game.paused;
    if (curTween) curTween.cancel();
    curTween = tween(
      pauseMenu.pos,
      game.paused ? center() : center().add(0, 700),
      1,
      (p) => (pauseMenu.pos = p),
      easings.easeOutElastic
    );
    if (game.paused) {
      pauseMenu.hidden = false;
      pauseMenu.paused = false;
    } else {
      curTween.onEnd(() => {
        pauseMenu.hidden = true;
        pauseMenu.paused = true;
      });
    }
  });

  const pauseMenu = add([
    text(`Press "P" to resume game.`),
    color(0, 0, 0),
    anchor("center"),
    pos(center().add(0, 700)),
  ]);

  pauseMenu.hidden = true;
  pauseMenu.paused = true;
});
//losers
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

  //retry keys
  onKeyPress("space", () => go("game"));
  onKeyPress("w", () => go("game"));
  onClick(() => go("game"));
});

go("game");
