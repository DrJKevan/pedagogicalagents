import json
import requests
import os
from flask import Flask, request, jsonify, render_template
import openai
from config import OPENAI_API_KEY

app = Flask(__name__)

openai.api_key = OPENAI_API_KEY

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def get_chat_response():
    prompt = request.json.get('prompt')
    if not prompt:
        return jsonify({"error": "Missing prompt"}), 400

    try:
        response = openai_api_call(prompt)
        print(f"API Response: {response}")  # Add this line
        chat_response = response['choices'][0]['message']['content']
    except Exception as e:
        print(f"Error: {e}")  # Add this line
        return jsonify({"error": "Error processing the API response"}), 500

    return jsonify({"response": chat_response})

def openai_api_call(prompt):
    model = "gpt-3.5-turbo"
    
    data = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 150,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
    }
    
    response = openai.ChatCompletion.create(**data)
    return response

@app.route('/api/dalle', methods=['POST'])
def get_dalle_response():
    prompt = request.json.get('prompt')
    if not prompt:
        return jsonify({"error": "Missing prompt"}), 400

    try:
        response = openai.Image.create(
            prompt=prompt,
            n=4,
            size="512x512"
        )
        print(f"DALL-E API Response: {response}")  # Add this line for debugging
        image_urls = [data['url'] for data in response['data']]
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error processing the API response"}), 500

    return jsonify({"image_urls": image_urls})

if __name__ == '__main__':
    app.run(debug=True)