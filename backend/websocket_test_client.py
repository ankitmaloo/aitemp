#!/usr/bin/env python3
"""
Simple WebSocket test client for the persona simulator API
"""

import asyncio
import websockets
import json

async def test_websocket():
    uri = "ws://localhost:8000/ws"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected to WebSocket")
            
            # Test OpenAI chat
            test_message = {
                "type": "openai_chat",
                "data": {
                    "input_text": "Hello! Can you tell me a short joke?",
                    "model": "gpt-4o-mini",
                    "include_reasoning": False
                }
            }
            
            print("Sending test message...")
            await websocket.send(json.dumps(test_message))
            
            # Listen for responses
            while True:
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=30.0)
                    data = json.loads(response)
                    
                    print(f"Received: {data['type']} - {data.get('status', 'N/A')}")
                    
                    if data['type'] == 'chunk':
                        print(f"Chunk: {data['chunk']}", end='', flush=True)
                        if data.get('is_final'):
                            print("\n--- End of response ---")
                            break
                    elif data['type'] == 'response':
                        print(f"Final response: {data}")
                        break
                    elif data['type'] == 'error':
                        print(f"Error: {data['message']}")
                        break
                    else:
                        print(f"Status: {data.get('message', '')}")
                        
                except asyncio.TimeoutError:
                    print("Timeout waiting for response")
                    break
                    
    except Exception as e:
        print(f"Connection error: {e}")

async def test_persona_chat():
    uri = "ws://localhost:8000/ws"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected to WebSocket for persona chat test")
            
            # Test persona chat
            test_message = {
                "type": "chat",
                "data": {
                    "message": "What's your favorite programming language?",
                    "persona_id": "tech_enthusiast",
                    "api": "openai",
                    "temperature": 0.8
                }
            }
            
            print("Sending persona chat message...")
            await websocket.send(json.dumps(test_message))
            
            # Listen for responses
            while True:
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=30.0)
                    data = json.loads(response)
                    
                    print(f"Received: {data['type']} - {data.get('status', 'N/A')}")
                    
                    if data['type'] == 'chunk':
                        print(f"{data['chunk']}", end='', flush=True)
                        if data.get('is_final'):
                            print(f"\n--- End of {data.get('persona_id', 'unknown')} response ---")
                            break
                    elif data['type'] == 'response':
                        print(f"Final response: {data}")
                        break
                    elif data['type'] == 'error':
                        print(f"Error: {data['message']}")
                        break
                    else:
                        print(f"Status: {data.get('message', '')}")
                        
                except asyncio.TimeoutError:
                    print("Timeout waiting for response")
                    break
                    
    except Exception as e:
        print(f"Connection error: {e}")

if __name__ == "__main__":
    print("WebSocket Test Client")
    print("1. Testing OpenAI chat...")
    asyncio.run(test_websocket())
    
    print("\n" + "="*50)
    print("2. Testing persona chat...")
    asyncio.run(test_persona_chat())