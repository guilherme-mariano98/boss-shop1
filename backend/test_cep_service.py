#!/usr/bin/env python3
"""
Test script for CEP Service
"""

import requests
import json

def test_cep_service():
    """Test the CEP service with a known CEP"""
    # Test CEP (01001-000 is a valid CEP for São Paulo)
    cep = "01001000"
    
    print(f"Testing CEP service with CEP: {cep}")
    
    try:
        # Test the main endpoint
        response = requests.get(f"http://localhost:5001/api/cep/{cep}", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        # Test the test endpoint
        print(f"\nTesting detailed endpoint:")
        response = requests.get(f"http://localhost:5001/api/cep/test/{cep}", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to CEP service. Make sure it's running on port 5001.")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_cep_service()