// World simulation for Emberflock: boids flock steering, lamps, mirrors, shadow-wisps, and 7 nights.

import { FIELD, REALMS } from './config.js';
import { playChime, playBurstSound, playHitSound } from './audio.js';

export const EVENT_LAMP = 1;
export const EVENT_HIT = 2;
export const EVENT_OVER = 4;
export const EVENT_WIN = 8;
export const EVENT_NIGHT = 16;

export function createWorld(random) {
  const state = {
    screen: 'title', // title, play, paused, over, win
    night: 1,
    realmIdx: 0,
    score: 0,
    timer: 45.0,
    moths: [],
    lamps: [],
    mirrors: [],
    wisps: [],
    burstCooldown: 0,
    burstActive: 0,
  };

  function resetNight(nightNum) {
    state.night = nightNum;
    state.timer = 50.0;
    state.burstActive = 0;
    state.burstCooldown = 0;

    // Determine realm
    if (nightNum <= 2) state.realmIdx = 0;
    else if (nightNum <= 5) state.realmIdx = 1;
    else state.realmIdx = 2;

    const realmConfig = REALMS[state.realmIdx];

    // Initialize moths (~24 initial)
    state.moths = [];
    for (let i = 0; i < 24; i++) {
      state.moths.push({
        x: 200 + random() * 880,
        y: 200 + random() * 300,
        vx: (random() - 0.5) * 60,
        vy: (random() - 0.5) * 60,
        alive: true,
      });
    }

    // Initialize lamps
    state.lamps = [];
    const lampCount = realmConfig.lampCount;
    for (let i = 0; i < lampCount; i++) {
      const angle = (i / lampCount) * Math.PI * 2 + random() * 0.2;
      const dist = 180 + random() * 220;
      const x = FIELD.width / 2 + Math.cos(angle) * dist;
      const y = 300 + Math.sin(angle) * (dist * 0.7);
      state.lamps.push({
        x: Math.max(100, Math.min(FIELD.width - 100, x)),
        y: Math.max(120, Math.min(FIELD.groundY - 80, y)),
        lit: false,
        requiresMirror: nightNum >= 3 && (i % 2 === 1),
      });
    }

    // Initialize mirrors
    state.mirrors = [];
    const mirrorCount = realmConfig.mirrorCount;
    for (let i = 0; i < mirrorCount; i++) {
      state.mirrors.push({
        x: 250 + random() * 780,
        y: 180 + random() * 320,
        angle: random() * Math.PI,
        width: 70,
        height: 12,
      });
    }

    // Initialize wisps
    state.wisps = [];
    const wispCount = realmConfig.wispCount;
    for (let i = 0; i < wispCount; i++) {
      state.wisps.push({
        x: random() * FIELD.width,
        y: random() * FIELD.groundY,
        vx: (random() - 0.5) * 80,
        vy: (random() - 0.5) * 80,
        radius: 35,
      });
    }
  }

  function reset() {
    state.score = 0;
    resetNight(1);
  }

  function step(dt, pointer, burstRequested, harmless) {
    let events = 0;
    if (state.screen !== 'play' && !harmless) return events;

    state.timer -= dt;
    if (state.timer <= 0 && !harmless) {
      events |= EVENT_OVER;
      state.screen = 'over';
      return events;
    }

    if (state.burstCooldown > 0) state.burstCooldown -= dt;
    if (burstRequested && state.burstCooldown <= 0 && !harmless) {
      state.burstActive = 0.6;
      state.burstCooldown = 2.0;
      playBurstSound();
    }
    if (state.burstActive > 0) state.burstActive = Math.max(0, state.burstActive - dt);

    // Boids flock steering parameters
    const maxSpeed = state.burstActive > 0 ? 320 : 180;
    const sepDist = 30;
    const cohDist = 120;

    let aliveCount = 0;
    let avgX = 0, avgY = 0;

    for (let i = 0; i < state.moths.length; i++) {
      const m = state.moths[i];
      if (!m.alive) continue;
      aliveCount++;
      avgX += m.x;
      avgY += m.y;
    }

    if (aliveCount < 12 && !harmless) {
      events |= EVENT_OVER;
      state.screen = 'over';
      return events;
    }

    if (aliveCount > 0) {
      avgX /= aliveCount;
      avgY /= aliveCount;
    } else {
      avgX = pointer.x;
      avgY = pointer.y;
    }

    // Update moths
    for (let i = 0; i < state.moths.length; i++) {
      const m = state.moths[i];
      if (!m.alive) continue;

      let sepX = 0, sepY = 0;
      let alignVx = 0, alignVy = 0;
      let neighbors = 0;

      for (let j = 0; j < state.moths.length; j++) {
        if (i === j) continue;
        const other = state.moths[j];
        if (!other.alive) continue;
        const dx = other.x - m.x;
        const dy = other.y - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0 && dist < sepDist) {
          sepX -= dx / dist;
          sepY -= dy / dist;
        }
        if (dist < cohDist) {
          alignVx += other.vx;
          alignVy += other.vy;
          neighbors++;
        }
      }

      if (neighbors > 0) {
        alignVx /= neighbors;
        alignVy /= neighbors;
      }

      // Steer towards pointer / lead target
      const targetDx = pointer.x - m.x;
      const targetDy = pointer.y - m.y;
      const targetDist = Math.sqrt(targetDx * targetDx + targetDy * targetDy);
      const targetSteerX = targetDist > 0 ? (targetDx / targetDist) * 120 : 0;
      const targetSteerY = targetDist > 0 ? (targetDy / targetDist) * 120 : 0;

      m.vx += sepX * 15 + alignVx * 0.05 + targetSteerX * 0.15;
      m.vy += sepY * 15 + alignVy * 0.05 + targetSteerY * 0.15;

      // Speed clamp
      const speed = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
      if (speed > maxSpeed) {
        m.vx = (m.vx / speed) * maxSpeed;
        m.vy = (m.vy / speed) * maxSpeed;
      }

      m.x += m.vx * dt;
      m.y += m.vy * dt;

      // Bounds
      if (m.x < 40) { m.x = 40; m.vx *= -1; }
      if (m.x > FIELD.width - 40) { m.x = FIELD.width - 40; m.vx *= -1; }
      if (m.y < 40) { m.y = 40; m.vy *= -1; }
      if (m.y > FIELD.groundY - 30) { m.y = FIELD.groundY - 30; m.vy *= -1; }
    }

    // Update wisps
    for (let w of state.wisps) {
      w.x += w.vx * dt;
      w.y += w.vy * dt;
      if (w.x < 50 || w.x > FIELD.width - 50) w.vx *= -1;
      if (w.y < 50 || w.y > FIELD.groundY - 50) w.vy *= -1;

      // Check collision with moths
      for (let m of state.moths) {
        if (!m.alive) continue;
        const dx = m.x - w.x;
        const dy = m.y - w.y;
        if (dx * dx + dy * dy < w.radius * w.radius && !harmless) {
          m.alive = false;
          playHitSound();
          events |= EVENT_HIT;
        }
      }
    }

    // Check lamp ignition by swarm
    let allLit = true;
    for (let lamp of state.lamps) {
      if (!lamp.lit) {
        let litBySwarm = false;
        for (let m of state.moths) {
          if (!m.alive) continue;
          const dx = m.x - lamp.x;
          const dy = m.y - lamp.y;
          if (dx * dx + dy * dy < 45 * 45) {
            if (!lamp.requiresMirror) {
              litBySwarm = true;
              break;
            }
          }
        }

        // Check mirror reflection beam if required
        if (!litBySwarm && lamp.requiresMirror) {
          for (let mir of state.mirrors) {
            // Check if swarm is near mirror and mirror points towards lamp
            let swarmNearMirror = false;
            for (let m of state.moths) {
              if (m.alive && Math.abs(m.x - mir.x) < 80 && Math.abs(m.y - mir.y) < 80) {
                swarmNearMirror = true;
                break;
              }
            }
            if (swarmNearMirror) {
              const dx = lamp.x - mir.x;
              const dy = lamp.y - mir.y;
              if (dx * dx + dy * dy < 250 * 250) {
                litBySwarm = true;
                break;
              }
            }
          }
        }

        if (litBySwarm) {
          lamp.lit = true;
          state.score += 150;
          playChime();
          events |= EVENT_LAMP;
        }
      }
      if (!lamp.lit) allLit = false;
    }

    if (allLit && !harmless) {
      state.score += Math.round(state.timer * 10);
      if (state.night < 7) {
        events |= EVENT_NIGHT;
        resetNight(state.night + 1);
      } else {
        events |= EVENT_WIN;
        state.screen = 'win';
      }
    }

    return events;
  }

  reset();
  return { state, reset, resetNight, step };
}
