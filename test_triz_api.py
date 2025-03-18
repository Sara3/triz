import requests
import json
import time
import sys

# Define API base URL
BASE_URL = "http://localhost:5000/api"

def test_endpoint(endpoint, expected_status=200, timeout=5):
    """Test a specific API endpoint"""
    url = f"{BASE_URL}/{endpoint}"
    print(f"Testing {url}...")
    
    try:
        start_time = time.time()
        response = requests.get(url, timeout=timeout)
        elapsed = time.time() - start_time
        
        print(f"  Status: {response.status_code} ({elapsed:.2f}s)")
        
        if response.status_code == expected_status:
            print("  ✓ Status code OK")
            
            # Try to parse the JSON response
            try:
                data = response.json()
                print(f"  ✓ Valid JSON response")
                
                # Print some basic info about the response data
                if isinstance(data, dict):
                    print(f"  ✓ Response is a dictionary with {len(data)} keys")
                    if len(data) > 0:
                        print(f"  ✓ Sample keys: {list(data.keys())[:3]}")
                elif isinstance(data, list):
                    print(f"  ✓ Response is a list with {len(data)} items")
                
                return True, data
            except json.JSONDecodeError:
                print("  ✗ Invalid JSON response")
                print(f"  Response content: {response.text[:100]}...")
                return False, None
        else:
            print(f"  ✗ Unexpected status code: {response.status_code}")
            print(f"  Response content: {response.text[:100]}...")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"  ✗ Request failed: {str(e)}")
        return False, None
        
def test_post_endpoint(endpoint, payload, expected_status=200, timeout=5):
    """Test a POST API endpoint"""
    url = f"{BASE_URL}/{endpoint}"
    print(f"Testing POST {url}...")
    
    try:
        start_time = time.time()
        response = requests.post(url, json=payload, timeout=timeout)
        elapsed = time.time() - start_time
        
        print(f"  Status: {response.status_code} ({elapsed:.2f}s)")
        
        if response.status_code == expected_status:
            print("  ✓ Status code OK")
            
            # Try to parse the JSON response
            try:
                data = response.json()
                print(f"  ✓ Valid JSON response")
                return True, data
            except json.JSONDecodeError:
                print("  ✗ Invalid JSON response")
                print(f"  Response content: {response.text[:100]}...")
                return False, None
        else:
            print(f"  ✗ Unexpected status code: {response.status_code}")
            print(f"  Response content: {response.text[:100]}...")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"  ✗ Request failed: {str(e)}")
        return False, None
       
def check_health():
    """Check API health endpoint"""
    print("\n=== Checking API Health ===")
    success, data = test_endpoint("health")
    
    if success and data:
        if 'status' in data and data['status'] == 'ok':
            print("  ✓ Health status is 'ok'")
        else:
            print("  ✗ Health status is not 'ok'")
            
    return success
        
def check_triz_principles():
    """Check TRIZ principles endpoint"""
    print("\n=== Checking TRIZ Principles ===")
    success, data = test_endpoint("triz/principles")
    
    if success and data:
        # Verify the data has the expected structure
        has_valid_structure = all(
            isinstance(key, str) and key.isdigit() and 
            isinstance(value, dict) and "name" in value and "description" in value
            for key, value in data.items()
        )
        
        if has_valid_structure:
            print("  ✓ Data has the expected structure")
            # Print a sample principle
            sample_key = next(iter(data))
            print(f"  Sample principle {sample_key}: {data[sample_key]['name']}")
        else:
            print("  ✗ Data doesn't have the expected structure")
            
    return success
    
def check_engineering_parameters():
    """Check engineering parameters endpoint"""
    print("\n=== Checking Engineering Parameters ===")
    success, data = test_endpoint("triz/parameters")
    
    if success and data:
        # Verify the data has the expected structure
        has_valid_structure = all(
            isinstance(key, str) and key.isdigit() and 
            isinstance(value, str)
            for key, value in data.items()
        )
        
        if has_valid_structure:
            print("  ✓ Data has the expected structure")
            # Print sample parameters
            sample_keys = list(data.keys())[:3]
            for key in sample_keys:
                print(f"  Parameter {key}: {data[key]}")
        else:
            print("  ✗ Data doesn't have the expected structure")
            
    return success

def check_triz_matrix():
    """Check TRIZ matrix endpoint"""
    print("\n=== Checking TRIZ Matrix ===")
    success, data = test_endpoint("triz/matrix")
    
    if success and data:
        # Verify the data has the expected structure
        row_keys = list(data.keys())
        has_valid_structure = len(row_keys) > 0
        
        for row_key in row_keys:
            if not (isinstance(row_key, str) and row_key.isdigit()):
                has_valid_structure = False
                break
                
            row_data = data[row_key]
            if not isinstance(row_data, dict):
                has_valid_structure = False
                break
                
            for col_key, principles in row_data.items():
                if not (isinstance(col_key, str) and col_key.isdigit()):
                    has_valid_structure = False
                    break
                    
                if not isinstance(principles, list):
                    has_valid_structure = False
                    break
        
        if has_valid_structure:
            print("  ✓ Data has the expected structure")
            # Print sample matrix data
            sample_row = row_keys[0]
            sample_cols = list(data[sample_row].keys())
            if sample_cols:
                sample_col = sample_cols[0]
                print(f"  Matrix[{sample_row}][{sample_col}] = {data[sample_row][sample_col]}")
        else:
            print("  ✗ Data doesn't have the expected structure")
            
    return success

def check_patents_endpoint():
    """Check patents endpoint"""
    print("\n=== Checking Patents Endpoint ===")
    success, data = test_endpoint("patents")
    
    if success and data:
        if 'patents' in data and isinstance(data['patents'], list):
            print(f"  ✓ Found {len(data['patents'])} patents")
            if data['patents']:
                sample_patent = data['patents'][0]
                print(f"  Sample patent: {sample_patent.get('title', 'No title')}")
        else:
            print("  ✗ Expected 'patents' key with list value")
            
    return success

def check_analyses_endpoint():
    """Check analyses endpoint"""
    print("\n=== Checking Analyses Endpoint ===")
    success, data = test_endpoint("analyses")
    
    if success:
        if isinstance(data, list):
            print(f"  ✓ Found {len(data)} analyses")
            if data:
                print(f"  Sample analysis ID: {data[0].get('id', 'No ID')}")
        else:
            print("  ✗ Expected list of analyses")
            
    return success

def main():
    """Run all checks"""
    print("=== Patent Analytics Hub API Tests ===")
    print(f"Testing API at {BASE_URL}\n")
    
    # Test health endpoint
    health_ok = check_health()
    
    if not health_ok:
        print("\n❌ API health check failed. Make sure the backend server is running.")
        sys.exit(1)
    
    # Test TRIZ endpoints
    principles_ok = check_triz_principles()
    parameters_ok = check_engineering_parameters()
    matrix_ok = check_triz_matrix()
    
    # Test other endpoints
    patents_ok = check_patents_endpoint()
    analyses_ok = check_analyses_endpoint()
    
    # Summary
    print("\n=== Test Summary ===")
    print(f"Health check:      {'✓ OK' if health_ok else '✗ Failed'}")
    print(f"TRIZ Principles:   {'✓ OK' if principles_ok else '✗ Failed'}")
    print(f"Eng. Parameters:   {'✓ OK' if parameters_ok else '✗ Failed'}")
    print(f"TRIZ Matrix:       {'✓ OK' if matrix_ok else '✗ Failed'}")
    print(f"Patents endpoint:  {'✓ OK' if patents_ok else '✗ Failed'}")
    print(f"Analyses endpoint: {'✓ OK' if analyses_ok else '✗ Failed'}")
    
    all_ok = health_ok and principles_ok and parameters_ok and matrix_ok and patents_ok and analyses_ok
    
    print(f"\n{'✅ All tests passed!' if all_ok else '❌ Some tests failed!'}")
    
    if not all_ok:
        sys.exit(1)

if __name__ == "__main__":
    main() 