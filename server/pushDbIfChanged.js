import { execSync } from 'child_process';

const remoteUrl = `https://${process.env.GITHUB_TOKEN}@github.com/sportsoutlet/sportsoutlet.github.io.git`;

try {
  // Step 1: Initialize repo if not already a Git repo
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
  } catch {
    console.log('🧱 Not a Git repo. Initializing...');
    execSync('git init');
    execSync('git branch -m main');
  }

  // Step 2: Check if 'origin' exists. If not, add it.
  const remotes = execSync('git remote').toString();
  if (!remotes.includes('origin')) {
    console.log('🔗 Adding origin remote...');
    execSync(`git remote add origin ${remoteUrl}`);
  }

  // Step 3: Check for changes to recaps.db
  const output = execSync('git status --porcelain').toString();
  const dbChanged = output.split('\n').some(line => line.includes('recaps.db'));

  if (dbChanged) {
    console.log('📦 Changes detected in recaps.db. Committing and pushing...');
    execSync('git add recaps.db');
    execSync(`git commit -m "Auto-update recaps.db on ${new Date().toISOString()}"`);
    execSync('git push origin main');
  } else {
    console.log('✅ No changes to recaps.db. Skipping push.');
  }
} catch (err) {
  console.error('💥 Git error:', err.message);
}