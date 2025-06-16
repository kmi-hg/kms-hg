import requests

# Ollama server URL
url = "http://localhost:11434/models"

# Send a GET request to the server to get the list of available models
response = requests.get(url)

# Check if the request was successful (status code 200)
if response.status_code == 200:
    # Parse the response as JSON and extract the list of models
    models = response.json().get("models", [])
    
    # Check if the 'deepseek-r1:7b' model is in the list of models
    if "deepseek-r1:7b" in models:
        print("Model 'deepseek-r1:7b' is available!")
    else:
        print("Model 'deepseek-r1:7b' is not available.")
else:
    print("Failed to fetch models from Ollama server.")
