"""
Utility script to create mock TRIZ principles data
for quick testing the frontend.
"""

import json
import os

# Define the base directory for data
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TRIZ_DATA_DIR = os.path.join(BASE_DIR, "data", "triz")
os.makedirs(TRIZ_DATA_DIR, exist_ok=True)

# Create mock TRIZ principles
principles = {
    "1": {
        "name": "Segmentation",
        "description": "Divide an object into independent parts",
        "examples": [
            "Sectional furniture",
            "Modular computer components",
            "Sectional sofa"
        ]
    },
    "2": {
        "name": "Taking out",
        "description": "Extract the disturbing part or property from an object",
        "examples": [
            "Noise absorption in a quiet room",
            "Use of a sound-absorbing ceiling",
            "Removing seeds from fruits"
        ]
    },
    "3": {
        "name": "Local quality",
        "description": "Change an object's structure or environment from uniform to non-uniform",
        "examples": [
            "Gradient temperature tools",
            "Composite materials",
            "Pencil with eraser"
        ]
    },
    "4": {
        "name": "Asymmetry",
        "description": "Change the shape from symmetrical to asymmetrical",
        "examples": [
            "Asymmetric mixing vessels",
            "Ergonomic handles",
            "Asymmetric tire tread for better traction"
        ]
    },
    "5": {
        "name": "Merging",
        "description": "Bring closer together identical or similar objects",
        "examples": [
            "Personal computer with multiple functions",
            "Multi-function printer/scanner/copier",
            "Swiss Army knife"
        ]
    }
}

# Add remaining principles with simplified data
for i in range(6, 41):
    principles[str(i)] = {
        "name": f"Principle {i}",
        "description": f"Description for TRIZ principle {i}",
        "examples": [f"Example 1 for principle {i}", f"Example 2 for principle {i}"]
    }

# Save the principles to a JSON file
principles_file = os.path.join(TRIZ_DATA_DIR, "principles.json")
with open(principles_file, 'w') as f:
    json.dump(principles, f, indent=2)

print(f"Mock principles data created: {principles_file}")
print(f"Created {len(principles)} TRIZ principles") 