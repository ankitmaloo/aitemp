"""
OpenAI Responses API Reference Examples
Based on official OpenAI documentation and examples
"""

# BASIC USAGE
"""
from openai import OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

response = client.responses.create(
    model="gpt-4o-mini",
    input="tell me a joke",
)

print(response.output[0].content[0].text)
"""

# STATEFUL CONVERSATIONS - RETRIEVE
"""
fetched_response = client.responses.retrieve(response_id=response.id)
print(fetched_response.output[0].content[0].text)
"""

# STATEFUL CONVERSATIONS - CONTINUE
"""
response_two = client.responses.create(
    model="gpt-4o-mini",
    input="tell me another",
    previous_response_id=response.id
)
print(response_two.output[0].content[0].text)
"""

# FORKING CONVERSATIONS
"""
response_two_forked = client.responses.create(
    model="gpt-4o-mini",
    input="I didn't like that joke, tell me another and tell me the difference between the two jokes",
    previous_response_id=response.id  # Forking from first response
)
"""

# HOSTED TOOLS - WEB SEARCH
"""
response = client.responses.create(
    model="gpt-4o",
    input="What's the latest news about AI?",
    tools=[{"type": "web_search"}]
)
"""

# MULTIMODAL WITH TOOLS
"""
response_multimodal = client.responses.create(
    model="gpt-4o",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "Come up with keywords related to the image, and search on the web using the search tool for any news related to the keywords, summarize the findings and cite the sources."},
                {"type": "input_image", "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/2880px-Cat_August_2010-4.jpg"}
            ]
        }
    ],
    tools=[{"type": "web_search"}]
)
"""

# REASONING MODELS
"""
response = client.responses.create(
    model="o4-mini",
    input="tell me a joke",
)
# Access reasoning items via response.output[0] (reasoning item with ID)
"""

# REASONING WITH SUMMARIES
"""
response = client.responses.create(
    model="o3",
    input="What are the main differences between photosynthesis and cellular respiration?",
    reasoning={"summary": "auto"},
)
# Access summary via response.output[0].summary[0].text
"""

# FUNCTION CALLING WITH REASONING CONTEXT
"""
# First call with tools
response = client.responses.create(
    model="o4-mini",
    input=context,
    tools=tools,
)

# Add response to context (including reasoning items)
context += response.output

# Add function call output
context.append({
    "type": "function_call_output",
    "call_id": tool_call.call_id,
    "output": str(result)
})

# Continue with reasoning context
response_2 = client.responses.create(
    model="o4-mini",
    input=context,
    tools=tools,
)
"""

# ENCRYPTED REASONING ITEMS (for ZDR)
"""
response = client.responses.create(
    model="o3",
    input=context,
    tools=tools,
    store=False,
    include=["reasoning.encrypted_content"]
)
# Access encrypted content via response.output[0].encrypted_content
"""

# CUSTOM FUNCTION TOOLS
"""
tools = [{
    "type": "function",
    "name": "get_weather",
    "description": "Get current temperature for provided coordinates in celsius.",
    "parameters": {
        "type": "object",
        "properties": {
            "latitude": {"type": "number"},
            "longitude": {"type": "number"}
        },
        "required": ["latitude", "longitude"],
        "additionalProperties": False
    },
    "strict": True
}]
"""

# PARALLEL TOOL CALLS
"""
response = client.responses.create(
    model="gpt-4o",
    input=[
        {"role": "system", "content": "When prompted with a question, select the right tool to use based on the question."},
        {"role": "user", "content": item["query"]}
    ],
    tools=tools,
    parallel_tool_calls=True
)
"""

# RESPONSE STRUCTURE
"""
response.id                    # Response ID for stateful conversations
response.model                 # Model used
response.output                # List of output items
response.output[0].type        # "message", "reasoning", "web_search_call", "function_call"
response.output[0].content[0].text  # For message type
response.output[0].summary[0].text  # For reasoning summaries
response.output[0].call_id     # For function calls
response.output[0].arguments   # For function calls
"""