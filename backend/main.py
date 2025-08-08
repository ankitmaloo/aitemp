from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import json
import asyncio
from gpt_assistant import stream_assistant_response, get_non_streaming_response
import time

app = FastAPI(title="Persona Simulator API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    persona_id: str = "default"
    model: Optional[str] = "gpt-4o-mini"

class ChatResponse(BaseModel):
    response: str
    persona_id: str

class MultiChatMessage(BaseModel):
    message: str
    persona_ids: List[str]
    model: Optional[str] = "gpt-4o-mini"

class MultiChatResponse(BaseModel):
    responses: List[Dict[str, str]]

class OpenAIChatRequest(BaseModel):
    input_text: str
    model: Optional[str] = "gpt-4o-mini"
    json_schema: Optional[Dict[str, Any]] = None

class WebSocketMessage(BaseModel):
    type: str
    data: Dict[str, Any]



@app.get("/")
async def root():
    return {"message": "Persona Simulator API is running"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_message: ChatMessage):
    """Single persona chat endpoint"""
    try:
        persona_id = chat_message.persona_id
        prompt = f"You are {persona_id}, a unique persona with distinct characteristics. Respond in character to this message: {chat_message.message}"
        
        response_text = get_non_streaming_response(prompt)
        
        return ChatResponse(
            response=response_text,
            persona_id=persona_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/multi", response_model=MultiChatResponse)
async def multi_chat_endpoint(multi_message: MultiChatMessage):
    """Multi-persona chat endpoint"""
    try:
        responses = []
        
        for persona_id in multi_message.persona_ids:
            prompt = f"You are {persona_id}, a unique persona with distinct characteristics. Respond in character to this message: {multi_message.message}"
            response_text = get_non_streaming_response(prompt)
            
            responses.append({
                "persona_id": persona_id,
                "response": response_text
            })
        
        return MultiChatResponse(responses=responses)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/openai-chat")
async def openai_chat_endpoint(request: OpenAIChatRequest):
    """Direct OpenAI chat endpoint"""
    try:
        response_text = get_non_streaming_response(request.input_text)
        
        return {
            "response": response_text,
            "model": request.model or "gpt-4o"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_message(self, websocket: WebSocket, message: dict):
        await websocket.send_text(json.dumps(message))

manager = ConnectionManager()

async def stream_openai_response(websocket: WebSocket, request_data: dict):
    """Stream OpenAI API response with status updates"""
    try:
        await manager.send_message(websocket, {
            "type": "status",
            "status": "starting",
            "message": "Initializing OpenAI request..."
        })
        
        input_text = request_data.get("input_text", "")
        prev_resp_id = request_data.get("previous_response_id")
        
        await manager.send_message(websocket, {
            "type": "status", 
            "status": "processing",
            "message": "Sending request to OpenAI (gpt-4o)..."
        })
        
        await manager.send_message(websocket, {
            "type": "status",
            "status": "streaming", 
            "message": "Receiving response from OpenAI..."
        })
        
        # Stream the response - simple approach with manual yielding
        full_response = ""
        response_id = ""
        
        for chunk in stream_assistant_response(input_text, prev_resp_id):
            if chunk.startswith("__PRID:") and chunk.endswith("_PRID__"):
                # Extract response ID
                response_id = chunk[7:-7]  # Remove __PRID: and _PRID__
                continue
            elif chunk.startswith("__ERROR:"):
                await manager.send_message(websocket, {
                    "type": "error",
                    "status": "error",
                    "message": chunk
                })
                return
            else:
                # Regular text chunk
                full_response += chunk
                
                # Send the chunk immediately
                await manager.send_message(websocket, {
                    "type": "chunk",
                    "chunk": chunk,
                    "is_final": False
                })
                
                # Force flush and yield control to event loop
                await asyncio.sleep(0) 
        
        # Send final message
        await manager.send_message(websocket, {
            "type": "chunk",
            "chunk": "",
            "is_final": True
        })
        
        await manager.send_message(websocket, {
            "type": "response",
            "status": "completed",
            "data": {
                "response": full_response, 
                "model": "gpt-4o",
                "response_id": response_id
            }
        })
        
    except Exception as e:
        await manager.send_message(websocket, {
            "type": "error",
            "status": "error",
            "message": str(e)
        })

async def stream_chat_response(websocket: WebSocket, request_data: dict):
    """Stream persona chat response"""
    try:
        await manager.send_message(websocket, {
            "type": "status",
            "status": "starting",
            "message": "Preparing persona response..."
        })
        
        message = request_data.get("message", "")
        persona_id = request_data.get("persona_id", "default")
        prev_resp_id = request_data.get("previous_response_id")
        
        prompt = f"You are {persona_id}, a unique persona with distinct characteristics. Respond in character to this message: {message}"
        
        await manager.send_message(websocket, {
            "type": "status",
            "status": "processing",
            "message": f"Getting response from {persona_id}..."
        })
        
        # Stream the response using the new streaming function
        full_response = ""
        response_id = ""
        
        for chunk in stream_assistant_response(prompt, prev_resp_id):
            if chunk.startswith("__PRID:") and chunk.endswith("_PRID__"):
                # Extract response ID
                response_id = chunk[7:-7]  # Remove __PRID: and _PRID__
                continue
            elif chunk.startswith("__ERROR:"):
                await manager.send_message(websocket, {
                    "type": "error",
                    "status": "error",
                    "message": chunk
                })
                return
            else:
                # Regular text chunk - break into individual characters for smooth streaming
                full_response += chunk
                
                # Send each character individually for smooth streaming effect
                for char in chunk:
                    await manager.send_message(websocket, {
                        "type": "chunk",
                        "chunk": char,
                        "persona_id": persona_id,
                        "is_final": False
                    })
                    # Small delay between characters for smooth effect (optional)
                    await asyncio.sleep(0.02)  # 20ms delay between characters
        
        # Send final message
        await manager.send_message(websocket, {
            "type": "chunk",
            "chunk": "",
            "persona_id": persona_id,
            "is_final": True
        })
        
        await manager.send_message(websocket, {
            "type": "response",
            "status": "completed",
            "data": {
                "response": full_response, 
                "persona_id": persona_id,
                "response_id": response_id
            }
        })
        
    except Exception as e:
        await manager.send_message(websocket, {
            "type": "error",
            "status": "error", 
            "message": str(e)
        })

async def stream_multi_chat_response(websocket: WebSocket, request_data: dict):
    """Stream multi-persona chat responses"""
    try:
        await manager.send_message(websocket, {
            "type": "status",
            "status": "starting",
            "message": "Preparing multi-persona responses..."
        })
        
        message = request_data.get("message", "")
        persona_ids = request_data.get("persona_ids", [])
        
        responses = []
        
        for i, persona_id in enumerate(persona_ids):
            await manager.send_message(websocket, {
                "type": "status",
                "status": "processing",
                "message": f"Getting response from {persona_id} ({i+1}/{len(persona_ids)})..."
            })
            
            prompt = f"You are {persona_id}, a unique persona with distinct characteristics. Respond in character to this message: {message}"
            
            # Stream each persona response
            full_response = ""
            response_id = ""
            
            for chunk in stream_assistant_response(prompt):
                if chunk.startswith("__PRID:") and chunk.endswith("_PRID__"):
                    response_id = chunk[7:-7]
                    continue
                elif chunk.startswith("__ERROR:"):
                    await manager.send_message(websocket, {
                        "type": "error",
                        "status": "error",
                        "message": f"{persona_id}: {chunk}"
                    })
                    continue
                else:
                    full_response += chunk
            
            await manager.send_message(websocket, {
                "type": "persona_response",
                "persona_id": persona_id,
                "response": full_response,
                "response_id": response_id,
                "index": i
            })
            
            responses.append({
                "persona_id": persona_id,
                "response": full_response,
                "response_id": response_id
            })
        
        await manager.send_message(websocket, {
            "type": "response",
            "status": "completed",
            "data": {"responses": responses}
        })
        
    except Exception as e:
        await manager.send_message(websocket, {
            "type": "error",
            "status": "error",
            "message": str(e)
        })

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time communication"""
    await manager.connect(websocket)
    
    try:
        # Don't send initial message - let the connection stabilize first
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            message_type = message.get("type")
            request_data = message.get("data", {})
            
            if message_type == "openai_chat":
                await stream_openai_response(websocket, request_data)
            elif message_type == "chat":
                await stream_chat_response(websocket, request_data)
            elif message_type == "multi_chat":
                await stream_multi_chat_response(websocket, request_data)
            else:
                await manager.send_message(websocket, {
                    "type": "error",
                    "status": "error",
                    "message": f"Unsupported message type: {message_type}"
                })
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        await manager.send_message(websocket, {
            "type": "error", 
            "status": "error",
            "message": f"WebSocket error: {str(e)}"
        })
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)