import { Injectable } from "@nestjs/common";
import { WebSocket } from "ws";

@Injectable()
export class ConnectedClientsService {
    private clients = new Map<number, WebSocket>();

    addClient(userId: number, socket: WebSocket) {
        this.clients.set(userId, socket);
        console.log(`Clients Connected: ${this.clients.size}, socket: ${this.clients.get(userId)}`);
    }

    removeClient(userId: number) {
        this.clients.delete(userId);
        console.log(`Clients Disconnected: ${this.clients.size}, socket: ${this.clients.get(userId)}`);
    }

    send(userId: number, event: string, data: object){
        const socket = this.clients.get(userId);
        console.log("This is triggering:   ", `userId: ${userId},  socket's ready state:  ${socket?.readyState},    socket: ${socket},     ${WebSocket.OPEN}`)
        if(socket && socket.readyState === WebSocket.OPEN){
            socket.send(JSON.stringify({ event, data }));
        }
    }

    broadcast(event: string, data: object){
        this.clients.forEach(socket => {
            if(socket.readyState === WebSocket.OPEN){
                socket.send(JSON.stringify({ event, data }));
            }
        })
    }
}