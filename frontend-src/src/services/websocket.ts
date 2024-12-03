class WebSocketService {
    private socket: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private listeners: { [key: string]: ((data: any) => void)[] } = {};

    constructor() {
        this.connect();
    }

    private connect() {
        try {
            this.socket = new WebSocket('ws://localhost:8000/ws');

            this.socket.onopen = () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
            };

            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type && this.listeners[data.type]) {
                    this.listeners[data.type].forEach(callback => callback(data.payload));
                }
            };

            this.socket.onclose = () => {
                console.log('WebSocket disconnected');
                this.handleReconnect();
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('WebSocket connection error:', error);
            this.handleReconnect();
        }
    }

    private handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => this.connect(), 5000);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    public subscribe(type: string, callback: (data: any) => void) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(callback);

        return () => {
            this.listeners[type] = this.listeners[type].filter(cb => cb !== callback);
        };
    }

    public send(type: string, payload: any) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type, payload }));
        } else {
            console.error('WebSocket is not connected');
        }
    }

    public disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

export const wsService = new WebSocketService();
export default wsService;
