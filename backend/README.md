# Persona Simulator Backend

FastAPI backend for the Persona Simulator application.

## Setup

1. Install uv if you haven't already:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. Copy environment variables:
```bash
cd backend
cp .env.example .env
```

3. Edit `.env` file with your API keys:
- `OPENAI_API_KEY` - Your OpenAI API key
- `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY` - For Claude via Bedrock
- `GOOGLE_API_KEY` - Your Google Gemini API key

4. Install dependencies:
```bash
uv sync
```

5. Run the development server:
```bash
uv run python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

## API Endpoints

### GET /
Health check endpoint

### POST /chat
Single persona chat with LLM integration
- Request: `{"message": "Hello", "persona_id": "optional", "api": "openai|claude|gemini", "model": "optional", "temperature": 0.7, "max_tokens": 1000}`
- Response: `{"response": "...", "persona_id": "..."}`

### POST /multi
Multi-persona chat with LLM integration
- Request: `{"message": "Hello", "persona_ids": ["persona1", "persona2"], "api": "openai|claude|gemini", "model": "optional", "temperature": 0.7, "max_tokens": 1000}`
- Response: `{"responses": [{"persona_id": "...", "response": "..."}]}`

### POST /simulation
Create a simulation between personas with LLM integration
- Request: `{"scenario": "...", "persona_ids": [...], "duration_minutes": 5, "api": "openai|claude|gemini", "model": "optional", "temperature": 0.7, "max_tokens": 1000}`
- Response: `{"simulation_id": "...", "status": "...", "messages": [...]}`

### POST /openai-chat
Universal OpenAI Responses API endpoint for back-and-forth conversations
- Request: `{"input_text": "Hello", "model": "gpt-4o-mini", "previous_response_id": "optional", "tools": [{"type": "web_search"}], "include_reasoning": false}`
- Response: `{"response_id": "...", "output_text": "...", "reasoning_summary": null, "tool_calls": [], "raw_output": [...]}`

### POST /openai-retrieve
Retrieve a previous OpenAI response by ID
- Request: `{"response_id": "resp_abc123"}`
- Response: `{"response_id": "...", "model": "...", "output_text": "...", "retrieved": true}`

## LLM Providers

- **OpenAI**: Uses latest Responses API with structured outputs (default: gpt-4o)
- **Claude**: Via Amazon Bedrock (default: claude-3-5-sonnet-20241022-v2:0)  
- **Gemini**: Google's Generative AI (default: gemini-2.0-flash-exp)

## OpenAI Responses API Features

Based on the latest OpenAI Responses API patterns:

- **Simple Subagent**: Basic task execution using `client.responses.create()`
- **Tool-Augmented Agent**: Function calling with hosted tools (web_search, file_search)
- **Reasoning Agent**: Access to o3/o4-mini reasoning models with optional reasoning summaries
- **Multi-turn Agent**: Stateful conversations using `previous_response_id` for context continuity

## Key Advantages

- **Single API Call**: Handle complex multi-step workflows in one request
- **Stateful Conversations**: OpenAI manages conversation state automatically
- **Hosted Tools**: Built-in web search, file search, code interpreter
- **Reasoning Models**: Access to advanced reasoning capabilities with o3/o4-mini
- **Multimodal Support**: Text, images, and audio in single requests

## Development

The API will be available at http://localhost:8001
API documentation at http://localhost:8001/docs