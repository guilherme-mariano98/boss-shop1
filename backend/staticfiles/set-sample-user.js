// This script is for testing purposes only
(function() {
    // Set sample auth token
    localStorage.setItem('authToken', 'sample-token-123');
    
    // Set sample user data
    const sampleUser = {
        id: 1,
        username: 'joaosilva',
        email: 'joao.silva@email.com',
        first_name: 'João',
        last_name: 'Silva',
        date_joined: '2023-03-15T10:30:00Z'
    };
    
    localStorage.setItem('user', JSON.stringify(sampleUser));
    
    console.log('Sample user data set in localStorage');
    console.log('authToken:', localStorage.getItem('authToken'));
    console.log('user:', localStorage.getItem('user'));
})();