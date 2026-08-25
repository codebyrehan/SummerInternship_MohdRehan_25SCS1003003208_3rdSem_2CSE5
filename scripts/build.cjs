const { execSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const serverDir = path.join(__dirname, '..', 'server');

// During build phase: NODE_ENV must NOT be production so devDeps (vite) get installed
const buildEnv = Object.assign({}, process.env, {
  NODE_ENV: 'development',
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'true',
  PUPPETEER_SKIP_DOWNLOAD: 'true'
});

// For server install: production is fine (no devDeps needed)
const serverEnv = Object.assign({}, process.env, {
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'true',
  PUPPETEER_SKIP_DOWNLOAD: 'true'
});

console.log('🚀 Starting Render Full-Stack Build...');

try {
  console.log('📦 Step 1: Installing root dependencies (including devDeps for vite)...');
  execSync('npm install --include=dev', { cwd: root, stdio: 'inherit', env: buildEnv });

  console.log('📦 Step 2: Building Frontend Assets (Vite)...');
  execSync('npm run build', { cwd: root, stdio: 'inherit', env: buildEnv });

  console.log('📦 Step 3: Installing Server dependencies...');
  execSync('npm install', { cwd: serverDir, stdio: 'inherit', env: serverEnv });

  console.log('✅ Render Full-Stack Build Completed Successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
