const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let users = {}; // To keep track of connected users and their WebSocket connections

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('A user connected');

  // Listen for incoming messages from the client
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    // Handle setting the username
    if (data.type === 'setUsername') {
      users[data.username] = ws; // Store the WebSocket connection with the username
      console.log(`${data.username} has connected`);
    }

    // Handle sending chat messages
    if (data.type === 'message') {
      console.log(`${data.username}: ${data.text}`);

      // Broadcast the message to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'message',
            username: data.username,
            text: data.text
          }));
        }
      });
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('A user disconnected');
    // Remove the disconnected user from the users object
    for (let username in users) {
      if (users[username] === ws) {
        delete users[username];
        break;
      }
    }
  });
});

// Start the server on port 8080
server.listen(8080, () => {
  console.log('Server is listening on http://localhost:8080');
});
