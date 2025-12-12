# CEP API Documentation

## Overview
The CEP API provides postal code (CEP) lookup services for Brazilian addresses. It connects directly to Correios services and includes fallback mechanisms to ensure high availability.

## Base URL
```
http://localhost:5001/api/cep
```

## Endpoints

### 1. Get CEP Information
```
GET /api/cep/{cep}
```

**Description**: Retrieves address information for a given CEP.

**Parameters**:
- `cep` (string, required): The 8-digit postal code

**Response**:
```json
{
  "success": true,
  "data": {
    "street": "Praça da Sé",
    "neighborhood": "Sé",
    "city": "São Paulo",
    "state": "SP",
    "cep": "01001000"
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "CEP não encontrado"
}
```

### 2. Health Check
```
GET /health
```

**Description**: Checks if the service is running.

**Response**:
```json
{
  "status": "ok",
  "service": "CEP Service"
}
```

### 3. Test CEP Lookup (Detailed)
```
GET /api/cep/test/{cep}
```

**Description**: Retrieves detailed information about the CEP lookup process, including which service was used.

**Response**:
```json
{
  "success": true,
  "data": {
    "street": "Praça da Sé",
    "neighborhood": "Sé",
    "city": "São Paulo",
    "state": "SP",
    "cep": "01001000"
  },
  "source": "Correios"
}
```

### 4. Get All Streets in Brasília (DF)
```
GET /api/brasilia/streets
```

**Description**: Retrieves a list of all streets and sectors in Brasília, Distrito Federal.

**Response**:
```json
{
  "success": true,
  "city": "Brasília",
  "state": "DF",
  "total_streets": 50,
  "streets": [
    "Asa Norte",
    "Asa Sul",
    "SBN - Setor Bancário Norte",
    "SBS - Setor Bancário Sul",
    // ... more streets
  ]
}
```

## Usage Examples

### JavaScript (Frontend)
```javascript
async function searchCEP(cep) {
  try {
    const response = await fetch(`http://localhost:5001/api/cep/${cep}`);
    const data = await response.json();
    
    if (data.success) {
      console.log('Address:', data.data);
      // Fill form fields
      document.getElementById('street').value = data.data.street;
      document.getElementById('neighborhood').value = data.data.neighborhood;
      document.getElementById('city').value = data.data.city;
      document.getElementById('state').value = data.data.state;
    } else {
      console.error('CEP not found:', data.error);
    }
  } catch (error) {
    console.error('Error fetching CEP:', error);
  }
}

// Get all streets in Brasília
async function getBrasiliaStreets() {
  try {
    const response = await fetch('http://localhost:5001/api/brasilia/streets');
    const data = await response.json();
    
    if (data.success) {
      console.log(`Found ${data.total_streets} streets in ${data.city}-${data.state}`);
      return data.streets;
    } else {
      console.error('Error:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching streets:', error);
    return [];
  }
}

// Usage
searchCEP('01001000');
getBrasiliaStreets().then(streets => {
  console.log('Brasília streets:', streets);
});
```

### Python
```python
import requests

def get_address_by_cep(cep):
    response = requests.get(f'http://localhost:5001/api/cep/{cep}')
    if response.status_code == 200:
        data = response.json()
        if data['success']:
            return data['data']
        else:
            raise Exception(data['error'])
    else:
        raise Exception(f"HTTP {response.status_code}")

# Get all streets in Brasília
def get_brasilia_streets():
    response = requests.get('http://localhost:5001/api/brasilia/streets')
    if response.status_code == 200:
        data = response.json()
        if data['success']:
            return data['streets']
        else:
            raise Exception(data['error'])
    else:
        raise Exception(f"HTTP {response.status_code}")

# Usage
try:
    address = get_address_by_cep('01001000')
    print(address)
    
    streets = get_brasilia_streets()
    print(f"Found {len(streets)} streets in Brasília")
    print("First 5 streets:", streets[:5])
except Exception as e:
    print(f"Error: {e}")
```

## Fallback Services
If the Correios service is unavailable, the API will automatically try the following services:
1. ViaCEP
2. BrasilAPI

## Error Handling
The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Invalid CEP format
- `404`: CEP not found
- `500`: Internal server error

## Running the Service
To start the CEP service:
```bash
cd backend
python cep_service.py
```

Or use the batch file:
```bash
cd backend
start_cep_service.bat
```

## Testing
To test the service:
```bash
cd backend
python test_cep_service.py
```