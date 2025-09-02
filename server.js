// Install dependencies before running: 
// npm install express ws body-parser multer

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files (client HTML/JS)
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket server logic
wss.on('connection', (ws) => {
    console.log('✅ New client connected');

    ws.on('message', (rawMessage) => {
        let message;

        try {
            message = JSON.parse(rawMessage);
        } catch (err) {
            console.error('❌ Invalid JSON received:', rawMessage);
            return;
        }

        console.log('📩 Received:', message);

        // Broadcast to all other clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    });

    ws.on('close', () => {
        console.log('👋 Client disconnected');
    });
});

server.listen(3000, '0.0.0.0', () => {
    console.log('🚀 Server running at http://localhost:3000');
});
