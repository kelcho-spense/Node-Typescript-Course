import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';

// Define the path to the data directory
const dataDir = path.join(__dirname, 'data');

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Data directory created.');
}

// Define SSL certificates
const options = {
  key: fs.readFileSync(path.join(__dirname, '..', 'server-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '..', 'server-cert.pem'))
};

// Utility function to parse JSON body
const parseRequestBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
  });
};

// Create HTTPS server
const server = https.createServer(options, async (req: IncomingMessage, res: ServerResponse) => {
  const parsedUrl = new URL(req.url || '', `https://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Set CORS headers (optional, for API usage)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Route: /file?name=filename.txt
  const fileName = parsedUrl.searchParams.get('name');
  if (!fileName) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    console.log('File name is required as a query parameter (e.g., ?name=filename.txt)')
    res.end(JSON.stringify({ error: 'File name is required as a query parameter (e.g., ?name=filename.txt)' }));
    return;
  }

  const filePath = path.join(dataDir, fileName);

  // Routing based on method
  switch (method) {
    case 'GET':
      // Read File
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'File not found.' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ content: data }));
        }
      });
      break;

    case 'POST':
      // Create File
      try {
        const body = await parseRequestBody(req);
        fs.writeFile(filePath, body.content, (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to write data.' }));
          } else {
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Data saved successfully.' }));
          }
        });
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON data.' }));
      }
      break;

    case 'PUT':
      // Update File by Appending
      try {
        const body = await parseRequestBody(req);
        fs.appendFile(filePath, body.content, (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to update data.' }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Data updated successfully.' }));
          }
        });
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON data.' }));
      }
      break;

    case 'DELETE':
      // Delete File
      fs.unlink(filePath, (err) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'File not found.' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'File deleted successfully.' }));
        }
      });
      break;

    default:
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed.' }));
      break;
  }
});

// Listen on port 8443 (using a non-privileged port for development)
const PORT = process.env.PORT || 8443;
server.listen(PORT, () => {
  console.log(`HTTPS server is running on https://localhost:${PORT}`);
});