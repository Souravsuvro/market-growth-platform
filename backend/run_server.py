import os
import subprocess

# Set the HuggingFace API key
os.environ['HUGGINGFACE_API_KEY'] = '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'

# Run the server
subprocess.run(['python', '-m', 'uvicorn', 'app.main:app', '--reload', '--host', '0.0.0.0', '--port', '8000'])
