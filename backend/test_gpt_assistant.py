#!/usr/bin/env python3
"""
Test script for gpt_assistant.py
"""

import os
from gpt_assistant import stream_assistant_response, get_non_streaming_response

def test_non_streaming():
    print("Testing non-streaming response...")
    response = get_non_streaming_response("Say hello in a friendly way")
    print(f"Response: {response}")
    print()

def test_streaming():
    print("Testing streaming response...")
    print("Response: ", end="", flush=True)
    
    for chunk in stream_assistant_response("Tell me a short joke"):
        if chunk.startswith("__PRID:") and chunk.endswith("_PRID__"):
            response_id = chunk[7:-7]
            print(f"\n[Response ID: {response_id}]")
            continue
        elif chunk.startswith("__ERROR:"):
            print(f"\n[Error: {chunk}]")
            break
        else:
            print(chunk, end="", flush=True)
    
    print("\n")

if __name__ == "__main__":
    print("GPT Assistant Test")
    print("=" * 30)
    
    # Check if API key is set
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Warning: OPENAI_API_KEY not found in environment variables")
        print("Please set your OpenAI API key to test the assistant")
        exit(1)
    
    test_non_streaming()
    test_streaming()
    
    print("Test completed!")