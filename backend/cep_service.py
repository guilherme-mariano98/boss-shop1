"""
CEP Service for BOSS SHOPP
This service connects directly to Correios services to fetch address information
with fallback to multiple public APIs for better reliability.
"""

import requests
import xml.etree.ElementTree as ET
from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import time
from functools import wraps

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Correios SOAP service URL
CORREIOS_URL = "https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente"

# Timeout for requests (in seconds)
REQUEST_TIMEOUT = 10

# Retry configuration
MAX_RETRIES = 3
RETRY_DELAY = 1

# Retry decorator for requests
def retry_request(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        for attempt in range(MAX_RETRIES):
            try:
                return func(*args, **kwargs)
            except requests.exceptions.RequestException as e:
                if attempt < MAX_RETRIES - 1:
                    logger.warning(f"Request failed (attempt {attempt + 1}): {str(e)}. Retrying in {RETRY_DELAY * (2 ** attempt)} seconds...")
                    time.sleep(RETRY_DELAY * (2 ** attempt))
                else:
                    logger.error(f"Request failed after {MAX_RETRIES} attempts: {str(e)}")
                    raise
        return None
    return wrapper
@retry_request
def consultar_cep_correios(cep):
    """
    Consulta CEP diretamente nos serviços dos Correios
    """
    logger.info(f"Consultando CEP {cep} nos Correios")
    
    # SOAP envelope for Correios CEP service
    soap_body = f"""<?xml version="1.0" encoding="UTF-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
            <ns2:consultaCEP xmlns:ns2="http://cliente.bean.master.sigep.bsb.correios.com.br/">
                <cep>{cep}</cep>
            </ns2:consultaCEP>
        </soap:Body>
    </soap:Envelope>"""
    
    headers = {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'consultaCEP'
    }
    
    try:
        response = requests.post(
            CORREIOS_URL,
            data=soap_body,
            headers=headers,
            timeout=REQUEST_TIMEOUT
        )
        
        logger.info(f"Resposta dos Correios: {response.status_code}")
        
        if response.status_code == 200:
            # Parse XML response
            root = ET.fromstring(response.content)
            
            # Extract data from XML
            namespace = {'soap': 'http://schemas.xmlsoap.org/soap/envelope/',
                        'ns2': 'http://cliente.bean.master.sigep.bsb.correios.com.br/'}
            
            # Find the return element
            return_element = root.find('.//ns2:return', namespace)
            
            if return_element is not None:
                endereco = {}
                for child in return_element:
                    tag = child.tag.split('}')[1] if '}' in child.tag else child.tag
                    endereco[tag] = child.text
                
                # Validate required fields
                if not endereco.get('end') and not endereco.get('bairro') and not endereco.get('cidade'):
                    logger.warning("CEP encontrado mas dados incompletos nos Correios")
                    return {'success': False, 'error': 'Dados do CEP incompletos'}
                
                result = {
                    'success': True,
                    'data': {
                        'street': endereco.get('end', ''),
                        'neighborhood': endereco.get('bairro', ''),
                        'city': endereco.get('cidade', ''),
                        'state': endereco.get('uf', ''),
                        'cep': endereco.get('cep', cep)
                    }
                }
                logger.info(f"CEP encontrado: {result}")
                return result
            else:
                logger.warning("CEP não encontrado nos Correios")
                return {'success': False, 'error': 'CEP não encontrado'}
        elif response.status_code == 404:
            logger.warning(f"CEP {cep} não encontrado (404) nos Correios")
            return {'success': False, 'error': 'CEP não encontrado'}
        elif response.status_code == 500:
            logger.error(f"Erro interno do servidor dos Correios para CEP {cep}")
            return {'success': False, 'error': 'Erro interno do servidor dos Correios'}
        else:
            logger.error(f"Erro na requisição aos Correios: {response.status_code}")
            return {'success': False, 'error': f'Erro na requisição: {response.status_code}'}
            
    except requests.exceptions.Timeout:
        logger.error(f"Timeout ao consultar Correios para CEP {cep}")
        return {'success': False, 'error': 'Timeout ao consultar Correios'}
    except requests.exceptions.ConnectionError:
        logger.error(f"Erro de conexão ao consultar Correios para CEP {cep}")
        return {'success': False, 'error': 'Erro de conexão com os Correios'}
    except Exception as e:
        logger.error(f"Erro ao consultar Correios: {str(e)}")
        return {'success': False, 'error': f'Erro ao consultar Correios: {str(e)}'}

@app.route('/api/cep/<cep>', methods=['GET'])
def get_cep(cep):
    """
    API endpoint to get CEP information
    """
    logger.info(f"Recebida requisição para CEP: {cep}")
    
    # Remove any non-digit characters
    clean_cep = ''.join(filter(str.isdigit, cep))
    
    if len(clean_cep) != 8:
        logger.warning(f"CEP inválido: {cep}")
        return jsonify({'success': False, 'error': 'CEP inválido'}), 400
    
    # List of fallback APIs to try
    fallback_apis = [
        {
            'name': 'ViaCEP',
            'url': f'https://viacep.com.br/ws/{clean_cep}/json/',
            'transform': lambda data: {
                'street': data.get('logradouro', ''),
                'neighborhood': data.get('bairro', ''),
                'city': data.get('localidade', ''),
                'state': data.get('uf', ''),
                'cep': data.get('cep', clean_cep)
            },
            'validate': lambda data: 'erro' not in data and data.get('cep')
        },
        {
            'name': 'BrasilAPI',
            'url': f'https://brasilapi.com.br/api/cep/v1/{clean_cep}',
            'transform': lambda data: {
                'street': data.get('street', ''),
                'neighborhood': data.get('neighborhood', ''),
                'city': data.get('city', ''),
                'state': data.get('state', ''),
                'cep': data.get('cep', clean_cep)
            },
            'validate': lambda data: 'errors' not in data and data.get('cep')
        },
        {
            'name': 'Postmon',
            'url': f'https://api.postmon.com.br/v1/cep/{clean_cep}',
            'transform': lambda data: {
                'street': data.get('logradouro', ''),
                'neighborhood': data.get('bairro', ''),
                'city': data.get('cidade', ''),
                'state': data.get('estado', ''),
                'cep': data.get('cep', clean_cep)
            },
            'validate': lambda data: data.get('cep')
        }
    ]
    
    # Try Correios service first
    result = consultar_cep_correios(clean_cep)
    
    if result['success']:
        return jsonify(result)
    else:
        logger.info("Tentando fallback APIs")
        
        # Try each fallback API
        for api in fallback_apis:
            try:
                logger.info(f"Tentando API: {api['name']}")
                response = requests.get(api['url'], timeout=5)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Validate the response
                    if api['validate'](data):
                        result = {
                            'success': True,
                            'data': api['transform'](data)
                        }
                        logger.info(f"CEP encontrado via {api['name']}: {result}")
                        return jsonify(result)
                    else:
                        logger.warning(f"Dados inválidos da API {api['name']}")
                else:
                    logger.warning(f"API {api['name']} retornou status {response.status_code}")
                    
            except Exception as e:
                logger.error(f"Erro ao consultar {api['name']}: {str(e)}")
                continue
        
        # If all fails, return the Correios error
        logger.error("Todas as tentativas falharam")
        return jsonify(result), 404

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    logger.info("Health check requested")
    return jsonify({'status': 'ok', 'service': 'CEP Service'})

@app.route('/api/cep/test/<cep>', methods=['GET'])
def test_cep(cep):
    """
    Test endpoint that returns detailed information about the CEP lookup process
    """
    logger.info(f"Test CEP lookup requested for: {cep}")
    
    # Remove any non-digit characters
    clean_cep = ''.join(filter(str.isdigit, cep))
    
    if len(clean_cep) != 8:
        logger.warning(f"Invalid CEP: {cep}")
        return jsonify({'success': False, 'error': 'CEP inválido', 'cep': cep}), 400
    
    # Try Correios service first
    result = consultar_cep_correios(clean_cep)
    
    # If Correios fails, try fallback APIs
    if not result['success']:
        logger.info("Trying fallback APIs")
        
        fallback_apis = [
            {
                'name': 'ViaCEP',
                'url': f'https://viacep.com.br/ws/{clean_cep}/json/',
                'transform': lambda data: {
                    'street': data.get('logradouro', ''),
                    'neighborhood': data.get('bairro', ''),
                    'city': data.get('localidade', ''),
                    'state': data.get('uf', ''),
                    'cep': data.get('cep', clean_cep)
                },
                'validate': lambda data: 'erro' not in data and data.get('cep')
            },
            {
                'name': 'BrasilAPI',
                'url': f'https://brasilapi.com.br/api/cep/v1/{clean_cep}',
                'transform': lambda data: {
                    'street': data.get('street', ''),
                    'neighborhood': data.get('neighborhood', ''),
                    'city': data.get('city', ''),
                    'state': data.get('state', ''),
                    'cep': data.get('cep', clean_cep)
                },
                'validate': lambda data: 'errors' not in data and data.get('cep')
            }
        ]
        
        for api in fallback_apis:
            try:
                logger.info(f"Trying API: {api['name']}")
                response = requests.get(api['url'], timeout=5)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    if api['validate'](data):
                        result = {
                            'success': True,
                            'data': api['transform'](data),
                            'source': api['name']
                        }
                        logger.info(f"CEP found via {api['name']}")
                        break
                    else:
                        logger.warning(f"Invalid data from {api['name']}")
                else:
                    logger.warning(f"{api['name']} returned status {response.status_code}")
                    
            except Exception as e:
                logger.error(f"Error querying {api['name']}: {str(e)}")
                continue
    
    # Add source information
    if result['success'] and 'source' not in result:
        result['source'] = 'Correios'
    
    return jsonify(result)

@app.route('/api/brasilia/streets', methods=['GET'])
def get_brasilia_streets():
    """
    Endpoint that returns all streets in Brasília (DF)
    """
    logger.info("Request for all streets in Brasília (DF)")
    
    # Sample data for streets in Brasília
    # In a real implementation, this would come from a database
    brasilia_streets = [
        "SIA - Setor de Indústria e Abastecimento",
        "SBN - Setor Bancário Norte",
        "SBS - Setor Bancário Sul",
        "CLS - Centro Linguístico Sul",
        "CLN - Centro Linguístico Norte",
        "SHIN - Setor Hípico Norte",
        "SHIS - Setor Hípico Sul",
        "SHCN - Setor Hospitalar Central Norte",
        "SHCS - Setor Hospitalar Central Sul",
        "SHLN - Setor Hospitalar Local Norte",
        "SHLS - Setor Hospitalar Local Sul",
        "SIG - Setor de Indústria Gráfica",
        "SLN - Setor de Lodas Norte",
        "SLS - Setor de Lodas Sul",
        "SMAS - Setor Médico Administrativo Sul",
        "SMAN - Setor Médico Administrativo Norte",
        "SQN - Setor Quadra Norte",
        "SQS - Setor Quadra Sul",
        "Vila Planalto",
        "Vila Telebrasília",
        "Asa Norte",
        "Asa Sul",
        "Lago Norte",
        "Lago Sul",
        "Park Way",
        "Guará",
        "Taguatinga",
        "Ceilândia",
        "Samambaia",
        "Plano Piloto",
        "Sudoeste",
        "Noroeste",
        "Jardim Botânico",
        "Itapoã",
        "São Sebastião",
        "Gama",
        "Aguas Claras",
        "Recanto das Emas",
        "Sol Nascente",
        "Planaltina",
        "Sobradinho",
        "Estrutural",
        "Santa Maria",
        "São Francisco",
        "Riacho Fundo",
        "Cruzeiro",
        "Paranoá",
        "Luziânia",
        "Cidade Ocidental",
        "Valparaíso de Goiás",
        "Novo Gama",
        "Núcleo Bandeirante"
    ]
    
    # Sort streets alphabetically
    brasilia_streets.sort()
    
    return jsonify({
        'success': True,
        'city': 'Brasília',
        'state': 'DF',
        'total_streets': len(brasilia_streets),
        'streets': brasilia_streets
    })

if __name__ == '__main__':
    logger.info("Iniciando CEP Service na porta 5001")
    app.run(host='0.0.0.0', port=5001, debug=True)