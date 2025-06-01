const fs = require('fs');
const path = require('path');

// Command-line argument: 'work' or 'home'
const mode = process.argv[2]; // e.g. node replaceLocalWithGitHub.js work

if(!mode || !['work', 'home'].includes(mode)) {
      console.error("❌ Please specify 'work' or 'home' as an argument.");
      process.exit(1);
}

// File paths
const inputFile = 'LocalIncludes.txt';
const outputFile = 'TamperStart.js';

const baseGitHubUrl = 'https://github.com/Monshi10x/TamperScript/raw/main/';
const baseLocalPath_Work = 'file://C:\\Users\\Tristan PC\\Documents\\TamperScript\\';
const baseLocalPath_Home = 'file://C:\\Users\\monsh\\Documents\\TamperScript\\';

const baseLocalPath = mode === 'work' ? baseLocalPath_Work : baseLocalPath_Home;

// Read the input
const content = fs.readFileSync(inputFile, 'utf8');

// Replace local paths with GitHub URLs, and convert backslashes to forward slashes
const replaced = content.replace(
      new RegExp(baseLocalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      baseGitHubUrl
).replace(/\\/g, '/');

// Save output
fs.writeFileSync(outputFile, replaced, 'utf8');

console.log(`✅ Local paths for ${mode.toUpperCase()} converted to GitHub URLs. Output saved to: ${outputFile}`);
