import * as http2 from 'http2';
import * as fs from 'fs';

// Load SSL certificates for secure connection
const options = {
  key: fs.readFileSync('server-key.pem'),   //
  cert: fs.readFileSync('server-cert.pem')
};

// Create an HTTP/2 server
const server = http2.createSecureServer(options);

server.on('stream', (stream, headers) => {
  // Respond to HTTP/2 requests
  const path = headers[':path'];

  if (path === '/') {
    stream.respond({
      'content-type': 'text/html',
      ':status': 200
    });
    stream.end('<h1>Welcome to the HTTP/2 Server</h1>');
  } else if (path === '/about') {
    stream.respond({
      'content-type': 'text/html',
      ':status': 200
    });
    stream.end('<h1>About Us</h1>');
  } else {
    stream.respond({
      ':status': 404
    });
    stream.end('404 - Not Found');
  }
});

// Listen on port 8443
server.listen(8443, () => {
  console.log('HTTP/2 server is running on https://localhost:8443');
});