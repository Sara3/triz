"""
Utility script to create a mock TRIZ matrix data file
for quick testing the frontend.
"""

import json
import random
import os

# Define the base directory for data
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TRIZ_DATA_DIR = os.path.join(BASE_DIR, "data", "triz")
os.makedirs(TRIZ_DATA_DIR, exist_ok=True)

# Create mock engineering parameters
parameters = {str(i): f"Parameter {i}" for i in range(1, 40)}

# Define the real names for parameters
real_names = [
    "Weight of moving object",
    "Weight of stationary object",
    "Length or angle of moving object",
    "Length or angle of stationary object",
    "Area of moving object",
    "Area of stationary object",
    "Volume of moving object",
    "Volume of stationary object",
    "Speed",
    "Force (Intensity)",
    "Stress or pressure",
    "Shape",
    "Stability of the object's composition",
    "Strength",
    "Duration of action of moving object",
    "Duration of action of stationary object",
    "Temperature",
    "Illumination intensity",
    "Use of energy by moving object",
    "Use of energy by stationary object",
    "Power",
    "Loss of Energy",
    "Loss of substance",
    "Loss of Information",
    "Loss of Time",
    "Quantity of substance/the matter",
    "Reliability",
    "Measurement accuracy",
    "Manufacturing precision",
    "External harm affects the object",
    "Object-generated harmful factors",
    "Manufacturability",
    "Convenience of use",
    "Repairability",
    "Adaptability or versatility",
    "Device complexity",
    "Difficulty of detecting and measuring",
    "Extent of automation",
    "Productivity",
]

# Update parameters with real names
for i, name in enumerate(real_names[:39], 1):
    parameters[str(i)] = name

# Create a mock TRIZ matrix
matrix = {}
for i in range(1, 40):
    row = {}
    for j in range(1, 40):
        # Skip diagonal cells
        if i == j:
            continue

        # Add random principles for each cell (between 0-4 principles)
        if random.random() < 0.7:  # 70% chance of having principles
            num_principles = random.randint(1, 4)
            principles = random.sample(range(1, 41), num_principles)
            row[str(j)] = principles

    if row:  # Only add non-empty rows
        matrix[str(i)] = row

# Save the matrix to a JSON file
matrix_file = os.path.join(TRIZ_DATA_DIR, "matrix.json")
with open(matrix_file, "w") as f:
    json.dump(matrix, f, indent=2)

# Save the parameters to a JSON file
params_file = os.path.join(TRIZ_DATA_DIR, "parameters.json")
with open(params_file, "w") as f:
    json.dump(parameters, f, indent=2)

print(f"Mock data created:\n- Matrix: {matrix_file}\n- Parameters: {params_file}")
print(f"Matrix has {sum(len(row) for row in matrix.values())} cells with principles")
