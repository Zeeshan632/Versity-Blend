import { Injectable } from "@nestjs/common";
import { WebSocket } from "ws";

@Injectable()
export class ConnectedClientsService {
    private clients = new Map<number, WebSocket>();

    addClient(userId: number, socket: WebSocket) {
        this.clients.set(userId, socket);
        // console.log(`Clients Connected: ${this.clients.size}`);
    }

    removeClient(userId: number) {
        this.clients.delete(userId);
        // console.log(`Clients connected: ${this.clients.size}`);
    }

    send(userId: number, event: string, data: object){
        const socket = this.clients.get(userId);
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

    isReady(userId: number){
        const socket = this.clients.get(userId)
        return socket !== undefined && socket.readyState === WebSocket.OPEN
    }
}