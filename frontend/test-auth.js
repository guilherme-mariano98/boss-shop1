async function testAuth() {
  try {
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;
    
    // Test registration
    console.log('Testing registration...');
    const registerResponse = await fetch('http://10.160.216.59:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Registration response:', registerData);
    
    if (registerResponse.ok) {
      console.log('Registration successful!');
      
      // Test login
      console.log('\nTesting login...');
      const loginResponse = await fetch('http://10.160.216.59:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);
      
      if (loginResponse.ok) {
        console.log('Login successful!');
        console.log('Token:', loginData.token);
      } else {
        console.log('Login failed:', loginData.error);
      }
    } else {
      console.log('Registration failed:', registerData.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testAuth();