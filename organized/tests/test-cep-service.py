"""
Test script for CEP service
"""
import requests
import time

def test_cep_service():
    print("Testing CEP Service...")
    
    # Test CEP
    cep = "01001000"  # São Paulo CEP
    
    try:
        # Test local CEP service
        print(f"Testing local CEP service with CEP: {cep}")
        response = requests.get(f"http://localhost:5001/api/cep/{cep}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("Response from local service:")
            print(f"  Success: {data.get('success')}")
            if data.get('success'):
                address_data = data.get('data', {})
                print(f"  Street: {address_data.get('street')}")
                print(f"  Neighborhood: {address_data.get('neighborhood')}")
                print(f"  City: {address_data.get('city')}")
                print(f"  State: {address_data.get('state')}")
            else:
                print(f"  Error: {data.get('error')}")
        else:
            print(f"  HTTP Error: {response.status_code}")
            
    except Exception as e:
        print(f"Error connecting to local CEP service: {e}")
        
    # Test ViaCEP as fallback
    try:
        print(f"\nTesting ViaCEP API directly with CEP: {cep}")
        response = requests.get(f"https://viacep.com.br/ws/{cep}/json/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("Response from ViaCEP:")
            if 'erro' not in data:
                print(f"  Street: {data.get('logradouro')}")
                print(f"  Neighborhood: {data.get('bairro')}")
                print(f"  City: {data.get('localidade')}")
                print(f"  State: {data.get('uf')}")
            else:
                print("  CEP not found")
        else:
            print(f"  HTTP Error: {response.status_code}")
            
    except Exception as e:
        print(f"Error connecting to ViaCEP: {e}")

if __name__ == "__main__":
    test_cep_service()