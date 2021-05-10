import io from 'socket.io-client';

class Socket {
    constructor() {
        this.socket = io();
    }
}

export default Socket;