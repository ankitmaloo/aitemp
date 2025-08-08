import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Initialize OpenAI client
API_KEY = os.getenv("OPENAI_API_KEY")
if not API_KEY:
    print("Warning: OPENAI_API_KEY not found in environment variables")
    API_KEY = "your-api-key-here"  # Fallback for testing

print("API key loaded:", API_KEY[:10] + "..." if API_KEY and len(API_KEY) > 10 else "Not found")
client = OpenAI(api_key=API_KEY)

# Input array could be an array or text, does not matter.
def get_ai_resp(input_arr, stream=True, pr_id=None):
    out = client.responses.create(
        model="gpt-4o",
        input=input_arr,
        previous_response_id=pr_id,
        stream=stream,
        #store=False
    )
    return out

def stream_assistant_response(query=None, prev_resp_id=None):
    ai_r = get_ai_resp(query, stream=True, pr_id=prev_resp_id)
    resp_id = ""
    final_tool_calls = {}
    
    for event in ai_r:
        event_type = event.type
        
        if event_type == "response.created":
            # Print the response id for production logging.
            response = getattr(event, "response", {})
            resp_id = getattr(response, "id", "unknown")
            yield f"__PRID:{resp_id}_PRID__"  # changing threadid to resp id to accommodate response api
            # Continue to next event; do not yield anything to UI.
            continue
            
        if event_type == "response.output_item.added":
            # Extract the item from the event
            item = event.item
            # Compare the inner item's type
            if hasattr(item, "type") and item.type == "function_call":
                final_tool_calls[event.output_index] = item
            else:
                # Process non-function_call items if needed
                print("Received non-function_call item:", item)
            continue
            
        if (event_type == "response.output_text.delta"):
            text_delta = getattr(event, "delta", "")
            yield text_delta
            continue
            
        if (event_type == "response.completed"):
            break
            
        # Process additional function call argument delta events
        if event_type == "response.function_call_arguments.delta":
            index = event.output_index
            if index in final_tool_calls:
                final_tool_calls[index].arguments += event.delta
                
        if event_type == "error":
            error_message = f"Error: {getattr(event, 'message', 'Unknown error')}"
            error_code = getattr(event, 'code', 'Unknown code')
            yield f"__ERROR:{error_code}__ {error_message}"
            continue

def get_non_streaming_response(query, prev_resp_id=None):
    """Non-streaming version for simple responses"""
    try:
        response = get_ai_resp(query, stream=False, pr_id=prev_resp_id)
        if response.output and len(response.output) > 0:
            return response.output_text
        return "No response generated"
    except Exception as e:
        return f"Error: {str(e)}"