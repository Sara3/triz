from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv
from api.routes import register_routes

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app)
    
    # Register API routes
    register_routes(app)
    
    return app

if __name__ == "__main__":
    app = create_app()
    # Get port from environment or default to 5000
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)