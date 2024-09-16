import * as https from 'https';
import * as fs from 'fs';

// Load SSL certificates
const options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem')
};

// Create a basic HTTPS server
const server = https.createServer(options, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Respond to requests based on URL
  if (req.url === '/') {
    res.end('Welcome to the secure homepage!');
  } else if (req.url === '/about') {
    res.end('About us page (secure)');
  } else {
    res.end('404 - Secure page not found');
  }
});

// Listen on port 443 (default for HTTPS)
server.listen(443, () => {
  console.log('HTTPS server is running on https://localhost:443');
});