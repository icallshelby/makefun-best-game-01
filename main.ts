/**
 * Emberflock Game Dossier Builder Entrypoint
 * Authored by Gemini CLI agent (November 2026 session).
 * 
 * Handles copying static game files and verified screenshots, validating
 * requirements, invoking buildDossier, and reporting summary metrics.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier, readGameTree } from './vendor/makefun-game.ts';

const baseDir = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

console.log(`[Emberflock Build] Target output directory: ${outputDir}`);

// Prepare output directory structure
mkdirSync(outputDir, { recursive: true });

// Copy game assets
const sourceGamePath = join(baseDir, 'game');
const targetGamePath = join(outputDir, 'game');
cpSync(sourceGamePath, targetGamePath, { recursive: true });

// Prepare and validate screenshots directory
const sourceScreenshotsPath = join(baseDir, 'screenshots');
const targetScreenshotsPath = join(outputDir, 'screenshots');
mkdirSync(targetScreenshotsPath, { recursive: true });

let validScreenshotCount = 0;
if (existsSync(sourceScreenshotsPath)) {
  cpSync(sourceScreenshotsPath, targetScreenshotsPath, { recursive: true });
  const jpgFiles = readdirSync(sourceScreenshotsPath).filter((filename) => {
    const fullPath = join(sourceScreenshotsPath, filename);
    return filename.toLowerCase().endsWith('.jpg') && statSync(fullPath).isFile();
  });
  validScreenshotCount = jpgFiles.length;
  if (validScreenshotCount < 1 || validScreenshotCount > 4) {
    throw new Error(`Validation Error: screenshots/ must contain between 1 and 4 .jpg files (found ${validScreenshotCount}).`);
  }
} else {
  throw new Error('Validation Error: screenshots/ directory is missing.');
}

// Define dossier constraints
const dossierCaps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

// Inspect game tree for metrics
const gameTreeStats = readGameTree(targetGamePath, dossierCaps);

// Generate dossier bytes and write output
const dossierContent = buildDossier(outputDir, dossierCaps);
const dossierDestination = join(outputDir, 'dossier.json');
writeFileSync(dossierDestination, dossierContent);

const finalDossierSize = statSync(dossierDestination).size;

// Print execution summary to stdout
console.log('========================================');
console.log(' EMBERFLOCK DOSSIER BUILD SUMMARY:');
console.log(` - Game Files Count : ${gameTreeStats.files.length} source/assets`);
console.log(` - Total Tree Entries: ${gameTreeStats.count}`);
console.log(` - Verified Screenshots: ${validScreenshotCount} (.jpg)`);
console.log(` - Dossier File Size: ${finalDossierSize} bytes (~${(finalDossierSize / 1024).toFixed(1)} KB)`);
console.log(` - Dossier Path     : ${dossierDestination}`);
console.log('========================================');
