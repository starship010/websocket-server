const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Store the queue globally
let videoQueue = [];

io.on('connection', (socket) => {
    console.log(`Device connected: ${socket.id}`);

    // Handle playQueue command
    socket.on('playQueue', (data) => {
        console.log('Received playQueue:', data);
        videoQueue = data.videoQueue; // Update the global queue
        io.emit('playQueue', data); // Broadcast the queue to all connected clients
    });

    // Handle stop command
    socket.on('stop', () => {
        console.log('Received stop command');
        io.emit('stop'); // Broadcast stop command to all clients
    });

    socket.on('disconnect', () => {
        console.log(`Device disconnected: ${socket.id}`);
    });
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`WebSocket server is running on http://localhost:${PORT}`);
});
