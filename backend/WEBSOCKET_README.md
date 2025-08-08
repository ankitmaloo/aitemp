# WebSocket API Documentation

## Overview

The WebSocket endpoint provides real-time streaming communication with OpenAI APIs and persona chat functionality. It allows for:

- Real-time status updates during API calls
- Streaming responses as they're generated
- Stateful conversations with context preservation
- Multi-persona chat streaming

## Endpoint

```
ws://localhost:8000/ws
```

## Message Format

All messages sent to and from the WebSocket follow this JSON format:

### Client to Server
```json
{
  "type": "message_type",
  "data": {
    // Message-specific data
  }
}
```

### Server to Client
```json
{
  "type": "response_type",
  "status": "status_value",
  "message": "status_message",
  // Additional fields based on response type
}
```

## Supported Message Types

### 1. OpenAI Chat (`openai_chat`)

Stream OpenAI Responses API calls with real-time updates.

**Request:**
```json
{
  "type": "openai_chat",
  "data": {
    "input_text": "Your message here",
    "model": "gpt-4o-mini",
    "previous_response_id": "optional_response_id",
    "tools": [{"type": "web_search"}],
    "include_reasoning": false
  }
}
```

**Response Flow:**
1. `{"type": "status", "status": "starting", "message": "Initializing..."}`
2. `{"type": "status", "status": "processing", "message": "Sending request..."}`
3. `{"type": "chunk", "chunk": "partial text", "is_final": false}`
4. `{"type": "response", "status": "completed", "data": {...}}`

### 2. Persona Chat (`chat`)

Stream single persona responses with character-based replies.

**Request:**
```json
{
  "type": "chat",
  "data": {
    "message": "What's your favorite programming language?",
    "persona_id": "tech_enthusiast",
    "api": "openai",
    "model": "gpt-4o-mini",
    "temperature": 0.7,
    "max_tokens": 1000
  }
}
```

**Response Flow:**
1. Status updates
2. Chunked response streaming
3. Final response with persona context

### 3. Multi-Persona Chat (`multi_chat`)

Stream responses from multiple personas simultaneously.

**Request:**
```json
{
  "type": "multi_chat",
  "data": {
    "message": "What do you think about AI?",
    "persona_ids": ["tech_enthusiast", "creative_writer", "data_scientist"],
    "api": "openai",
    "model": "gpt-4o-mini",
    "temperature": 0.7,
    "max_tokens": 1000
  }
}
```

**Response Flow:**
1. Status updates for each persona
2. `{"type": "persona_response", "persona_id": "...", "response": "...", "index": 0}`
3. Final combined response

## Response Types

### Status Updates
- `type: "status"` - Processing status updates
- `status: "starting|processing|streaming|completed"`
- `message: "Human-readable status message"`

### Streaming Content
- `type: "chunk"` - Partial response content
- `chunk: "text content"`
- `is_final: boolean` - Whether this is the last chunk

### Final Responses
- `type: "response"` - Complete response data
- `status: "completed"`
- `data: {...}` - Full response object

### Errors
- `type: "error"`
- `status: "error"`
- `message: "Error description"`

## Testing

### 1. Python Test Client
```bash
cd backend
python websocket_test_client.py
```

### 2. HTML Test Page
Open `backend/websocket_test.html` in your browser and:
1. Click "Connect" to establish WebSocket connection
2. Select message type and enter your message
3. Click "Send Message" to test streaming

### 3. JavaScript Example
```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onopen = function(event) {
    console.log('Connected to WebSocket');
    
    // Send a test message
    ws.send(JSON.stringify({
        type: 'openai_chat',
        data: {
            input_text: 'Hello, world!',
            model: 'gpt-4o-mini'
        }
    }));
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('Received:', data);
    
    if (data.type === 'chunk') {
        process.stdout.write(data.chunk);
    }
};
```

## Installation

1. Install WebSocket dependency:
```bash
pip install websockets==12.0
```

2. Start the server:
```bash
cd backend
python main.py
```

## Integration with Frontend

The WebSocket can be easily integrated with React, Vue, or any JavaScript frontend:

```javascript
// React hook example
const useWebSocket = (url) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
        const ws = new WebSocket(url);
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages(prev => [...prev, data]);
        };
        setSocket(ws);
        
        return () => ws.close();
    }, [url]);
    
    return { socket, messages };
};
```

## Error Handling

The WebSocket implementation includes comprehensive error handling:

- Connection errors are reported via status messages
- API errors are streamed back to the client
- Malformed messages receive error responses
- Disconnections are handled gracefully

## Performance Considerations

- Responses are chunked for smooth streaming (50 characters per chunk for OpenAI, 30 for personas)
- Small delays (0.1s) between chunks provide natural streaming effect
- Connection manager handles multiple concurrent connections
- Memory-efficient message handling