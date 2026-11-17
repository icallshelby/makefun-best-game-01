import { spawn, execSync } from 'node:child_process';
import { renameSync, existsSync } from 'node:fs';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const server = spawn('node', ['serve.ts'], { stdio: 'ignore' });
  await sleep(1200);

  const shots = [
    { name: '1-start.jpg', query: '?shot=start&seed=1' },
    { name: '2-play.jpg', query: '?shot=play&seed=1' },
    { name: '3-beacon.jpg', query: '?shot=beacon&seed=1' },
    { name: '4-end.jpg', query: '?shot=end&seed=1' },
  ];

  for (const shot of shots) {
    const url = `http://localhost:8080/${shot.query}`;
    const cmd = `/opt/meta-chromium/chrome --headless --use-gl=swiftshader --no-sandbox --screenshot --window-size=1280,720 --virtual-time-budget=3000 "${url}"`;
    try {
      execSync(cmd, { stdio: 'inherit' });
      if (existsSync('screenshot.png')) {
        renameSync('screenshot.png', `screenshots/${shot.name}`);
        console.log(`Captured ${shot.name}`);
      } else {
        console.error(`Missing screenshot.png for ${shot.name}`);
      }
    } catch (err) {
      console.error(`Error capturing ${shot.name}:`, err.message);
    }
  }

  server.kill();
}

main().catch(console.error);
