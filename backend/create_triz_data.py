import os
import json
from services.triz.triz_constants import TRIZ_PRINCIPLES, ENGINEERING_PARAMETERS, CONTRADICTION_MATRIX

# Define directories for data
TRIZ_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "triz")

# Create directories if they don't exist
os.makedirs(TRIZ_DATA_DIR, exist_ok=True)

def create_triz_data_files():
    """Create JSON files for TRIZ principles, parameters, and matrix"""
    
    print("Creating TRIZ data files...")
    
    # Create principles file
    principles_file = os.path.join(TRIZ_DATA_DIR, "principles.json")
    with open(principles_file, 'w') as f:
        json.dump(TRIZ_PRINCIPLES, f, indent=2)
    print(f"Created principles file: {principles_file}")
    print(f"TRIZ_PRINCIPLES contains {len(TRIZ_PRINCIPLES)} items")
    
    # Create parameters file
    print("\nCreating parameters file...")
    params_file = os.path.join(TRIZ_DATA_DIR, "parameters.json")
    parameters = {}
    
    print(f"ENGINEERING_PARAMETERS type: {type(ENGINEERING_PARAMETERS)}")
    print(f"ENGINEERING_PARAMETERS contains {len(ENGINEERING_PARAMETERS)} items")
    
    # Handle different possible formats of ENGINEERING_PARAMETERS
    if isinstance(ENGINEERING_PARAMETERS, dict):
        # If it's already a dictionary, use as is
        parameters = ENGINEERING_PARAMETERS
        print("Using ENGINEERING_PARAMETERS as dictionary directly.")
    elif isinstance(ENGINEERING_PARAMETERS, (list, tuple)):
        # If it's a list or tuple, convert to dictionary with 1-based index
        for param_id, param_name in enumerate(ENGINEERING_PARAMETERS, 1):
            parameters[str(param_id)] = param_name
        print("Converted ENGINEERING_PARAMETERS from list to dictionary.")
    else:
        print(f"WARNING: Unexpected ENGINEERING_PARAMETERS type: {type(ENGINEERING_PARAMETERS)}")
        # Create a dummy dictionary
        parameters = {
            "1": "Weight of moving object",
            "2": "Weight of stationary object",
            "3": "Length of moving object"
        }
        print("Using dummy parameters data.")
    
    with open(params_file, 'w') as f:
        json.dump(parameters, f, indent=2)
    print(f"Created parameters file: {params_file}")
    print(f"Parameters output contains {len(parameters)} items")
    
    # Create numeric matrix file
    print("\nCreating matrix file...")
    matrix_file = os.path.join(TRIZ_DATA_DIR, "matrix.json")
    
    print(f"CONTRADICTION_MATRIX type: {type(CONTRADICTION_MATRIX)}")
    if isinstance(CONTRADICTION_MATRIX, dict):
        print(f"CONTRADICTION_MATRIX contains {len(CONTRADICTION_MATRIX)} rows")
        first_key = next(iter(CONTRADICTION_MATRIX), None)
        if first_key:
            first_row = CONTRADICTION_MATRIX[first_key]
            print(f"First row type: {type(first_row)}")
            print(f"First row has {len(first_row)} columns")
    else:
        print("CONTRADICTION_MATRIX is not a dictionary")
    
    # Convert the contradiction matrix to use numeric indices
    numeric_matrix = {}
    
    # Create a mapping from parameter names to indices if needed
    param_names = {}
    if isinstance(ENGINEERING_PARAMETERS, (list, tuple)):
        for idx, param in enumerate(ENGINEERING_PARAMETERS, 1):
            param_names[param] = idx
        print(f"Created parameter name mapping with {len(param_names)} entries")
    
    # Handle different possible formats of CONTRADICTION_MATRIX
    if isinstance(CONTRADICTION_MATRIX, dict):
        for improving_param, worsening_dict in CONTRADICTION_MATRIX.items():
            # Check if improving_param is a string (parameter name) or integer/string index
            if isinstance(improving_param, str) and improving_param.isdigit():
                row_idx = int(improving_param)
            elif isinstance(improving_param, int):
                row_idx = improving_param
            elif isinstance(improving_param, str) and improving_param in param_names:
                row_idx = param_names[improving_param]
            else:
                print(f"WARNING: Could not map improving parameter: {improving_param}")
                continue
                
            row_idx_str = str(row_idx)
            numeric_matrix[row_idx_str] = {}
            
            if isinstance(worsening_dict, dict):
                for worsening_param, principles in worsening_dict.items():
                    # Check if worsening_param is a string (parameter name) or integer/string index
                    if isinstance(worsening_param, str) and worsening_param.isdigit():
                        col_idx = int(worsening_param)
                    elif isinstance(worsening_param, int):
                        col_idx = worsening_param
                    elif isinstance(worsening_param, str) and worsening_param in param_names:
                        col_idx = param_names[worsening_param]
                    else:
                        print(f"WARNING: Could not map worsening parameter: {worsening_param}")
                        continue
                        
                    col_idx_str = str(col_idx)
                    numeric_matrix[row_idx_str][col_idx_str] = principles
    
    # If the matrix is empty or very small, add sample data
    if not numeric_matrix or len(numeric_matrix) < 5:
        print("Using sample matrix data instead.")
        # Add some sample matrix data
        numeric_matrix = {
            "1": {"2": [1, 8, 15], "3": [1, 29, 17], "9": [2, 8, 15]},
            "2": {"1": [1, 7, 35], "3": [1, 28, 10], "11": [10, 28, 35]},
            "3": {"1": [8, 15, 29], "2": [15, 17, 4], "9": [15, 17, 4]},
            "9": {"3": [7, 14, 17, 4], "39": [35, 3, 22, 5], "38": [35, 10, 14, 27]},
            "10": {"14": [8, 35, 10, 14], "28": [10, 28, 35], "29": [3, 35, 5]},
            "35": {"36": [3, 35, 10], "37": [3, 10, 40], "38": [15, 35, 10, 28]},
            "39": {"10": [28, 10, 35, 23], "14": [10, 18, 39, 31], "35": [35, 10, 2, 18]}
        }
    
    with open(matrix_file, 'w') as f:
        json.dump(numeric_matrix, f, indent=2)
    print(f"Created matrix file: {matrix_file}")
    print(f"Matrix output contains {len(numeric_matrix)} rows")
    
    # Print the actual row and column keys for debugging
    print("\nMatrix rows:", list(numeric_matrix.keys()))
    first_row = next(iter(numeric_matrix.values()), {})
    print("Matrix columns (from first row):", list(first_row.keys()))
    
    # Check if files were actually created
    print("\nVerifying file creation:")
    for path, label in [
        (principles_file, "Principles file"),
        (params_file, "Parameters file"),
        (matrix_file, "Matrix file")
    ]:
        if os.path.exists(path):
            size = os.path.getsize(path)
            print(f"✓ {label} exists ({size} bytes)")
        else:
            print(f"✗ {label} DOES NOT exist")
    
    return {
        "principles": principles_file,
        "parameters": params_file,
        "matrix": matrix_file
    }

if __name__ == "__main__":
    files = create_triz_data_files()
    print("\nCreated TRIZ data files:")
    for data_type, file_path in files.items():
        print(f"- {data_type}: {file_path}") 