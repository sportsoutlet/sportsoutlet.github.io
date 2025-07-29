import { execSync } from 'child_process';
import path from 'path';
import process from 'process';

// Go to root where .git is
const projectRoot = path.resolve(__dirname, '..'); // parent of /server
const dbPath = 'server/recaps.db'; // ✅ relative path from root

const remoteUrl = `https://${process.env.GITHUB_TOKEN}@github.com/sportsoutlet/sportsoutlet.github.io.git`;

try {
  process.chdir(projectRoot); // move to project root

  // Ensure we’re in a Git repo
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
  } catch {
    console.log('🧱 Not a Git repo. Initializing...');
    execSync('git init');
    execSync('git branch -m main');
  }

  // Ensure 'origin' exists
  const remotes = execSync('git remote').toString();
  if (!remotes.includes('origin')) {
    console.log('🔗 Adding origin remote...');
    execSync(`git remote add origin ${remoteUrl}`);
  }

  // Check if recaps.db has changed
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