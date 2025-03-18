from flask import Flask, jsonify
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)

# Directory containing TRIZ data
TRIZ_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "triz")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Test TRIZ API is running'
    })

@app.route('/api/triz/principles', methods=['GET'])
def get_triz_principles():
    """Get all TRIZ principles"""
    try:
        principles_file = os.path.join(TRIZ_DATA_DIR, "principles.json")
        if os.path.exists(principles_file):
            with open(principles_file, 'r') as f:
                principles = json.load(f)
                return jsonify(principles)
        else:
            return jsonify({"error": "Principles file not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/triz/parameters', methods=['GET'])
def get_engineering_parameters():
    """Get all engineering parameters"""
    try:
        params_file = os.path.join(TRIZ_DATA_DIR, "parameters.json")
        if os.path.exists(params_file):
            with open(params_file, 'r') as f:
                parameters = json.load(f)
                return jsonify(parameters)
        else:
            return jsonify({"error": "Parameters file not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/triz/matrix', methods=['GET'])
def get_triz_matrix():
    """Get the TRIZ contradiction matrix"""
    try:
        matrix_file = os.path.join(TRIZ_DATA_DIR, "matrix.json")
        if os.path.exists(matrix_file):
            with open(matrix_file, 'r') as f:
                matrix = json.load(f)
                return jsonify(matrix)
        else:
            return jsonify({"error": "Matrix file not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Ensure data directory exists
    os.makedirs(TRIZ_DATA_DIR, exist_ok=True)
    
    # Check if data files exist
    for file_path, file_name in [
        (os.path.join(TRIZ_DATA_DIR, "principles.json"), "Principles"),
        (os.path.join(TRIZ_DATA_DIR, "parameters.json"), "Parameters"),
        (os.path.join(TRIZ_DATA_DIR, "matrix.json"), "Matrix")
    ]:
        if os.path.exists(file_path):
            size = os.path.getsize(file_path)
            print(f"✓ {file_name} file exists ({size} bytes)")
        else:
            print(f"✗ {file_name} file DOES NOT exist")
            
    # Run the server
    print("\nStarting test server on port 5000...")
    app.run(debug=True, host="127.0.0.1", port=5000) 