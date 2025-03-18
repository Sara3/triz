#!/usr/bin/env python3
"""
Test script to verify that the TRIZ API endpoints are working correctly.
This script will make direct calls to the service functions without going through
the Flask routes.
"""

import os
import json
import sys
from services.triz.triz_service import (
    get_triz_principles,
    get_engineering_parameters,
    get_triz_matrix
)

def test_triz_principles():
    """Test the TRIZ principles endpoint"""
    print("Testing TRIZ principles endpoint...")
    try:
        principles = get_triz_principles()
        print(f"Found {len(principles)} principles")
        print(f"First principle: {list(principles.items())[0]}")
        return True
    except Exception as e:
        print(f"Error testing TRIZ principles: {str(e)}")
        return False

def test_engineering_parameters():
    """Test the engineering parameters endpoint"""
    print("Testing engineering parameters endpoint...")
    try:
        parameters = get_engineering_parameters()
        print(f"Found {len(parameters)} parameters")
        print(f"First parameter: {list(parameters.items())[0]}")
        return True
    except Exception as e:
        print(f"Error testing engineering parameters: {str(e)}")
        return False

def test_triz_matrix():
    """Test the TRIZ matrix endpoint"""
    print("Testing TRIZ matrix endpoint...")
    try:
        matrix = get_triz_matrix()
        rows = len(matrix)
        cells = sum(len(row) for row in matrix.values())
        print(f"Matrix has {rows} rows and {cells} cells with principles")
        row_key = list(matrix.keys())[0]
        print(f"Sample row ({row_key}): {list(matrix[row_key].items())[:2]}")
        return True
    except Exception as e:
        print(f"Error testing TRIZ matrix: {str(e)}")
        return False

def run_tests():
    """Run all tests"""
    print("Running TRIZ endpoint tests...")
    
    # Run the individual tests
    principles_ok = test_triz_principles()
    parameters_ok = test_engineering_parameters()
    matrix_ok = test_triz_matrix()
    
    # Print summary
    print("\nTest Summary:")
    print(f"TRIZ Principles: {'✓ OK' if principles_ok else '✗ FAILED'}")
    print(f"Engineering Parameters: {'✓ OK' if parameters_ok else '✗ FAILED'}")
    print(f"TRIZ Matrix: {'✓ OK' if matrix_ok else '✗ FAILED'}")
    
    # Generate data if any test failed
    if not (principles_ok and parameters_ok and matrix_ok):
        print("\nGenerating mock data to fix issues...")
        
        # Run the fix scripts
        try:
            sys.path.append(os.path.dirname(os.path.abspath(__file__)))
            from services.triz.matrix_fix import BASE_DIR as m_base
            print(f"Generated matrix data in {m_base}")
            from services.triz.principles_fix import BASE_DIR as p_base
            print(f"Generated principles data in {p_base}")
            print("\nData generation complete. Please restart the server.")
        except Exception as e:
            print(f"Error generating mock data: {str(e)}")
    
    return principles_ok and parameters_ok and matrix_ok

if __name__ == "__main__":
    run_tests() 