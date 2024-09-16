import http from 'http';

const hostname = 'localhost';
const port = 8000;

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  // Set the response header and status code
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Send a response based on the URL
  if (req.url === '/') {
    res.end('Welcome to the homepage!');
  } else if (req.url === '/about') {
    res.end('About us page');
  } else {
    res.end('404 - Page not found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});