// lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket;

export const initiateSocket = () => {
    if (!socket) {
        socket = io({
            path: '/api/socket', // this matches backend
        }); // auto-connects to same-origin /api/socket
        console.log("Socket connected");
    }
};

export const getSocket = () => {
    return socket;
};
