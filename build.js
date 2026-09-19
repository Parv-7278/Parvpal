import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Building POLARIS Frontend for Vercel...');

// 1. Install & build frontend
const frontendDir = path.join(__dirname, 'frontend');
console.log('📦 Installing frontend dependencies...');
execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });

console.log('⚙️ Compiling frontend Vite bundle...');
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

// 2. Mirror frontend/dist to root dist and ensure both exist
const srcDist = path.join(frontendDir, 'dist');
const rootDist = path.join(__dirname, 'dist');

if (fs.existsSync(srcDist)) {
  fs.cpSync(srcDist, rootDist, { recursive: true, force: true });
  console.log('✅ Mirrored frontend/dist -> ./dist');
}

console.log('🎉 Build complete! Ready for Vercel deployment.');
