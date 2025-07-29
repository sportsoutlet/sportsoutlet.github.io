import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import crypto from 'crypto';

function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}


const fetch = global.fetch;

// ✅ Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const projectRoot = path.resolve(__dirname, '..');
const dbPath = path.join(projectRoot, 'server', 'recaps.db');

// GitHub repo info
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'sportsoutlet';
const REPO_NAME = 'sportsoutlet.github.io';
const BRANCH = 'main';
const DEST_PATH = 'server/recaps.db';

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  'User-Agent': 'recaps-uploader',
  'Content-Type': 'application/json',
};

async function uploadFileToGitHub() {
  try {
    const content = fs.readFileSync(dbPath, { encoding: 'base64' });

    // Check if the file exists on GitHub (to get the SHA for updates)
    const getUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DEST_PATH}`;
    let sha = null;
    let remoteContent = null;

    try {
      const getRes = await fetch(getUrl, { headers });
      if (getRes.ok) {
        const getData = await getRes.json();
        sha = getData.sha;
        remoteContent = getData.content.replace(/\n/g, '').trim(); // ✅ remove all newlines
      }
    } catch (err) {
      console.log('🔍 Could not fetch existing file SHA:', err.message);
    }

    // Read and encode local content
    const localContent = fs.readFileSync(dbPath, { encoding: 'base64' });

    // ✅ Compare local and remote content
    console.log('Remote hash:', hash(remoteContent));
    console.log('Local hash: ', hash(localContent));

    if (remoteContent && localContent === remoteContent) {
      console.log('🟡 No changes detected, skipping upload.');
      return;
    }

    // Upload (create or update)
    const uploadRes = await fetch(getUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Auto-update ${DEST_PATH} on ${new Date().toISOString()}`,
        content,
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    });

    const result = await uploadRes.json();
    if (uploadRes.ok) {
      console.log('✅ Uploaded:', result.content.path);
    } else {
      console.error('❌ Upload failed:', result);
    }
  } catch (err) {
    console.error('💥 Upload error:', err.message);
  }
}

uploadFileToGitHub();