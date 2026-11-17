// Staged shots for Emberflock screenshots.

import { FIELD, STEP } from './config.js';

export function stageShot(name, world) {
  world.reset();

  if (name === 'play') {
    world.resetNight(3); // Night 3: Old Town with mirrors & wisps
    // Autopilot / step forward to get a rich gameplay scene
    for (let i = 0; i < 90; i++) {
      let targetLamp = null;
      for (const l of world.state.lamps) {
        if (!l.lit) { targetLamp = l; break; }
      }
      const ptr = targetLamp ? { x: targetLamp.x, y: targetLamp.y } : { x: FIELD.width / 2, y: FIELD.height / 2 };
      world.step(STEP, ptr, false, true);
    }
    world.state.screen = 'play';
    return { screen: 'play', best: 1500 };
  } else if (name === 'beacon') {
    world.resetNight(7); // Night 7: The Deep / Beacon
    for (const l of world.state.lamps) l.lit = true; // All lit for beacon shot
    world.state.screen = 'play';
    return { screen: 'play', best: 3200 };
  } else if (name === 'end') {
    world.state.score = 4250;
    world.state.screen = 'win';
    return { screen: 'win', best: 4250 };
  } else {
    // start
    world.state.screen = 'title';
    return { screen: 'title', best: 0 };
  }
}
