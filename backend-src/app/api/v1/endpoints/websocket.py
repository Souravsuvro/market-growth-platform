from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
from app.core.config import settings
import asyncio
import json

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        if client_id not in self.active_connections:
            self.active_connections[client_id] = []
        self.active_connections[client_id].append(websocket)

    def disconnect(self, websocket: WebSocket, client_id: str):
        if client_id in self.active_connections:
            self.active_connections[client_id].remove(websocket)
            if not self.active_connections[client_id]:
                del self.active_connections[client_id]

    async def broadcast_to_client(self, message: dict, client_id: str):
        if client_id in self.active_connections:
            for connection in self.active_connections[client_id]:
                try:
                    await connection.send_json(message)
                except WebSocketDisconnect:
                    await self.disconnect(connection, client_id)

manager = ConnectionManager()

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                subscription_type = message.get("type")
                
                # Handle different subscription types
                if subscription_type == "customer-segments":
                    # Simulate sending customer segment updates
                    await manager.broadcast_to_client(
                        {
                            "type": "customer-segments",
                            "data": {
                                "segments": [
                                    {"id": 1, "name": "High Value", "count": 150},
                                    {"id": 2, "name": "Medium Value", "count": 300},
                                    {"id": 3, "name": "Low Value", "count": 550}
                                ]
                            }
                        },
                        client_id
                    )
                elif subscription_type == "customer-behaviors":
                    # Simulate sending customer behavior updates
                    await manager.broadcast_to_client(
                        {
                            "type": "customer-behaviors",
                            "data": {
                                "behaviors": [
                                    {"type": "purchase", "frequency": "high"},
                                    {"type": "browsing", "frequency": "medium"},
                                    {"type": "support", "frequency": "low"}
                                ]
                            }
                        },
                        client_id
                    )
                elif subscription_type == "customer-metrics":
                    # Simulate sending customer metrics updates
                    await manager.broadcast_to_client(
                        {
                            "type": "customer-metrics",
                            "data": {
                                "metrics": {
                                    "total_customers": 1000,
                                    "active_customers": 750,
                                    "churn_rate": 0.05,
                                    "average_lifetime_value": 1200
                                }
                            }
                        },
                        client_id
                    )
            except json.JSONDecodeError:
                await websocket.send_json({"error": "Invalid JSON format"})
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, client_id)
