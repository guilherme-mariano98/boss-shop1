#!/usr/bin/env python3
"""
Test script for Brasília Streets API
"""

import requests
import json

def test_brasilia_streets_api():
    """Test the Brasília streets API endpoint"""
    
    print("Testing Brasília Streets API")
    print("=" * 40)
    
    try:
        # Test the Brasília streets endpoint
        response = requests.get("http://localhost:5001/api/brasilia/streets", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data['success']}")
            print(f"City: {data['city']}")
            print(f"State: {data['state']}")
            print(f"Total Streets: {data['total_streets']}")
            
            print("\nFirst 10 streets:")
            for i, street in enumerate(data['streets'][:10]):
                print(f"  {i+1}. {street}")
            
            if data['total_streets'] > 10:
                print(f"  ... and {data['total_streets'] - 10} more streets")
                
        else:
            print(f"Error: HTTP {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to CEP service. Make sure it's running on port 5001.")
        print("Start the service with: python cep_service.py")
    except Exception as e:
        print(f"Error: {str(e)}")

def test_health_check():
    """Test the health check endpoint"""
    
    print("\nTesting Health Check")
    print("=" * 40)
    
    try:
        response = requests.get("http://localhost:5001/health", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Status: {data['status']}")
            print(f"Service: {data['service']}")
        else:
            print(f"Error: HTTP {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to CEP service.")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_health_check()
    print()
    test_brasilia_streets_api()