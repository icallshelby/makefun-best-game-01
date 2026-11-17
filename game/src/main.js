// Boot and main loop for Emberflock.

import { BEST_KEY, STEP } from './config.js';
import { createRandom } from './random.js';
import { createWorld, EVENT_OVER, EVENT_WIN } from './world.js';
import { ACTION_BURST, ACTION_PAUSE, ACTION_RESTART, ACTION_CONFIRM, createInput } from './input.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';

const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld(createRandom(seed));
const renderer = createRenderer(canvas);

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {}
}

function runShot(name) {
  const scene = stageShot(name, world);
  let painted = 0;
  function paint() {
    renderer.draw(world.state, scene.screen, scene.best);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas);
  let best = readBest();
  let accumulator = 0;
  let last = performance.now();

  function announce(msg) {
    status.textContent = msg;
  }

  function startGame() {
    world.reset();
    world.state.screen = 'play';
    accumulator = 0;
    announce('Night begins. Guide the ember-moths.');
  }

  function handleActions() {
    const actions = input.takeActions();
    if ((actions & ACTION_CONFIRM || actions & ACTION_BURST) && (world.state.screen === 'title' || world.state.screen === 'over' || world.state.screen === 'win')) {
      startGame();
    } else if (actions & ACTION_PAUSE && world.state.screen === 'play') {
      world.state.screen = 'paused';
      announce('Paused.');
    } else if (actions & ACTION_PAUSE && world.state.screen === 'paused') {
      world.state.screen = 'play';
      announce('Resumed.');
    } else if (actions & ACTION_RESTART) {
      startGame();
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;

    handleActions();

    if (world.state.screen === 'play') {
      while (accumulator >= STEP && world.state.screen === 'play') {
        const ptr = input.getPointer();
        const actions = input.takeActions();
        const burst = (actions & ACTION_BURST) !== 0;
        const events = world.step(STEP, ptr, burst, false);

        if (events & EVENT_OVER) {
          world.state.screen = 'over';
          if (world.state.score > best) {
            best = world.state.score;
            saveBest(best);
          }
          announce(`Game over. Score ${world.state.score}`);
        } else if (events & EVENT_WIN) {
          world.state.screen = 'win';
          if (world.state.score > best) {
            best = world.state.score;
            saveBest(best);
          }
          announce(`All nights complete! Score ${world.state.score}`);
        }
        accumulator -= STEP;
      }
    } else {
      accumulator = 0;
    }

    renderer.draw(world.state, world.state.screen, best);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && world.state.screen === 'play') {
      world.state.screen = 'paused';
    }
  });

  announce('Emberflock. Press Space or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
