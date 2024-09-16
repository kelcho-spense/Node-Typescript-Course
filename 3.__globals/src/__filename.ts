import * as path from 'path';

// Example: __filename in action
console.log('Full file path:', __filename);

// Extract directory name from __filename
const currentDir = path.dirname(__filename);
console.log('Directory name:', currentDir);

// Extract base file name (e.g., 'index.js') from __filename
const baseFileName = path.basename(__filename);
console.log('Base file name:', baseFileName);

// Extract file extension (e.g., '.js')
const fileExtension = path.extname(__filename);
console.log('File extension:', fileExtension);

// Construct a path relative to this file
const relativePath = path.join(currentDir, 'config', 'settings.json');
console.log('Relative file path:', relativePath);

// Dynamic operations involving the file path of the current file, like logging its location, or performing actions based on the current file’s directory.