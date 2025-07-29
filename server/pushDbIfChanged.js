import { fileURLToPath } from 'url';
import path from 'path';
import { execSync } from 'child_process';
import process from 'process';

// ✅ ES module replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// move one level up from /server to root
const projectRoot = path.resolve(__dirname, '..');
const dbPath = 'server/recaps.db';

const remoteUrl = `https://${process.env.GITHUB_TOKEN}@github.com/sportsoutlet/sportsoutlet.github.io.git`;

try {
  process.chdir(projectRoot); // ✅ change to root dir with .git

  // Check if repo is initialized
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
  } catch {
    console.log('🧱 Not a Git repo. Initializing...');
    execSync('git init');
    execSync('git branch -m main');
  }

  // Check or add remote
  const remotes = execSync('git remote').toString();
  if (!remotes.includes('origin')) {
    console.log('🔗 Adding origin remote...');
    execSync(`git remote add origin ${remoteUrl}`);
  }

  // Check if recaps.db changed
  const statusOutput = execSync('git status --porcelain').toString();
  const dbChanged = statusOutput.split('\n').some(line => line.includes(dbPath));

  if (dbChanged) {
    console.log('📦 Changes detected in recaps.db. Committing and pushing...');
    execSync(`git add ${dbPath}`);
    execSync(`git commit -m "Auto-update ${dbPath} on ${new Date().toISOString()}"`);
    execSync('git push origin main');
  } else {
    console.log('✅ No changes to recaps.db. Skipping push.');
  }
} catch (err) {
  console.error('💥 Git error:', err.message);
}