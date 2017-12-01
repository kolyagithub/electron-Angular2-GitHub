import {Injectable} from "@angular/core";
import * as io from "socket.io-client";

@Injectable()
export class SocketIOService {
    private socket: any = io('http://localhost:3310');

    constructor() {
        this.socket.connect();
        this.socket.on("connect", () => this.connected());
        this.socket.on("disconnect", () => this.disconnected());
        this.socket.on("error", (error: string) => {
            console.log(`ERROR: "${error}"`);
        });
    }

    disconnect() {
        console.log('Disconnecting');
        this.socket.disconnect();
    }

    getSocketInstance() {
        return this.socket;
    }

    emit(chanel: string, message: any) {
        if (message) this.socket.emit(chanel, message);
        else this.socket.emit(chanel);
    }

    connected() {
        console.log('Connected');
    }

    disconnected() {
        console.log('Disconnected');
    }
}