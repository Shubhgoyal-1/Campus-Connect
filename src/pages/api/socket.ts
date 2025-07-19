import { Server as IOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Socket as NetSocket } from 'net';

type NextApiResponseWithSocket = NextApiResponse & {
    socket: NetSocket & {
        server: HTTPServer & {
            io?: IOServer;
        };
    };
};

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
    if (res.socket.server.io) {
        console.log('🔁 Socket server already running');
        res.status(200).json({ message: 'Socket already initialized' });
        return;
    }

    console.log('🚀 Starting new Socket.IO server...');
    const io = new IOServer(res.socket.server, {
        path: '/api/socket',
        addTrailingSlash: false,
        cors: {
            origin: '*', // Replace with your frontend domain in production
            methods: ['GET', 'POST'],
        },
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
        console.log(`✅ New client connected: ${socket.id}`);

        socket.on('send-message', (messageData) => {
            console.log('📨 Message received:', messageData);
            socket.broadcast.emit('receive-message', messageData); // Send to other clients
        });

        socket.on('disconnect', () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });

    res.status(200).json({ message: 'Socket initialized' });
}
