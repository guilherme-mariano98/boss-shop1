// Auth JavaScript Functions

// API Base URL for Node.js backend (changed from Python backend)
const API_BASE_URL = 'http://localhost:8000/api';

// Switch between login and register forms
function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
}

function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.classList.remove('fa-eye');
        button.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        button.classList.remove('fa-eye-slash');
        button.classList.add('fa-eye');
    }
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = '';
    
    // Length check
    if (password.length >= 8) strength += 25;
    else feedback = 'Muito fraca - Use pelo menos 8 caracteres';
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Lowercase check
    if (/[a-z]/.test(password)) strength += 25;
    
    // Number check
    if (/[0-9]/.test(password)) strength += 25;
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    
    // Set feedback based on strength
    if (strength >= 80) feedback = 'Muito forte';
    else if (strength >= 60) feedback = 'Forte';
    else if (strength >= 40) feedback = 'Média';
    else if (strength >= 20) feedback = 'Fraca';
    else if (password.length > 0) feedback = 'Muito fraca';
    else feedback = 'Força da senha';
    
    return { strength: Math.min(strength, 100), feedback };
}

// Update password strength indicator
function updatePasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!passwordInput || !strengthBar || !strengthText) return;
    
    const password = passwordInput.value;
    const { strength, feedback } = checkPasswordStrength(password);
    
    strengthBar.style.width = strength + '%';
    strengthText.textContent = feedback;
    
    // Color coding
    if (strength >= 80) {
        strengthBar.style.backgroundColor = '#00aa00';
    } else if (strength >= 60) {
        strengthBar.style.backgroundColor = '#ffaa00';
    } else if (strength >= 40) {
        strengthBar.style.backgroundColor = '#ff6600';
    } else {
        strengthBar.style.backgroundColor = '#ff4444';
    }
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone formatting (Brazilian format)
function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        if (value.length < 14) {
            value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
    }
    
    input.value = value;
}

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const wrapper = input.parentElement;
        const errorMsg = wrapper.querySelector('.error-message') || createErrorMessage(wrapper);
        
        // Remove previous error states
        wrapper.classList.remove('error', 'success');
        errorMsg.classList.remove('show');
        
        // Validate based on input type
        let fieldValid = true;
        let errorText = '';
        
        if (!input.value.trim()) {
            fieldValid = false;
            errorText = 'Este campo é obrigatório';
        } else if (input.type === 'email' && !validateEmail(input.value)) {
            fieldValid = false;
            errorText = 'Digite um email válido';
        } else if (input.type === 'password' && input.value.length < 8) {
            fieldValid = false;
            errorText = 'A senha deve ter pelo menos 8 caracteres';
        } else if (input.id === 'confirmPassword') {
            const passwordInput = document.getElementById('registerPassword');
            if (input.value !== passwordInput.value) {
                fieldValid = false;
                errorText = 'As senhas não coincidem';
            }
        } else if ((input.id === 'firstName' || input.id === 'lastName') && input.value.length < 2) {
            fieldValid = false;
            errorText = 'Este campo deve ter pelo menos 2 caracteres';
        }
        
        if (!fieldValid) {
            wrapper.classList.add('error');
            errorMsg.textContent = errorText;
            errorMsg.classList.add('show');
            isValid = false;
        } else {
            wrapper.classList.add('success');
        }
    });
    
    return isValid;
}

// Create error message element
function createErrorMessage(wrapper) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    wrapper.appendChild(errorMsg);
    return errorMsg;
}

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Real login function that works with the backend API
async function handleLogin(formData) {
    try {
        // Get values from the form fields
        const email = formData.get('email') || document.getElementById('loginEmail').value;
        const password = formData.get('password') || document.getElementById('loginPassword').value;
        
        // Send login request to backend
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store token and user data in localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, message: 'Login realizado com sucesso!' };
        } else {
            return { success: false, message: data.error || 'Email ou senha inválidos' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Erro ao fazer login. Tente novamente.' };
    }
}

// Registration function that works with the backend API
async function handleRegister(formData) {
    try {
        const userData = {
            name: formData.get('firstName') + ' ' + formData.get('lastName'),
            email: formData.get('email'),
            password: formData.get('password'),
            phone: formData.get('phone') || '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Brasil',
            dateOfBirth: ''
        };
        
        // Send registration request to backend
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store token and user data in localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, message: 'Conta criada e login realizado com sucesso!' };
        } else {
            return { success: false, message: data.error || 'Erro ao criar conta. Tente novamente.' };
        }
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'Erro ao criar conta. Tente novamente.' };
    }
}

// Set button loading state
function setButtonLoading(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        // Restore original icon
        if (button.id === 'loginFormSubmit') {
            button.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar';
        } else {
            button.innerHTML = '<i class="fas fa-user-plus"></i> Criar Conta';
        }
    }
}

// Social login handlers
function handleGoogleLogin() {
    showToast('Redirecionando para o Google...', 'success');
    // Here you would integrate with Google OAuth
    setTimeout(() => {
        showToast('Login com Google não implementado ainda', 'error');
    }, 1500);
}

function handleFacebookLogin() {
    showToast('Redirecionando para o Facebook...', 'success');
    // Here you would integrate with Facebook OAuth
    setTimeout(() => {
        showToast('Login com Facebook não implementado ainda', 'error');
    }, 1500);
}

// Update user icon based on login status
function updateUserIcon() {
    const userIcon = document.getElementById('userIcon');
    const userText = document.getElementById('userText');
    
    if (!userIcon || !userText) return;
    
    const user = localStorage.getItem('user');
    
    if (user) {
        const userData = JSON.parse(user);
        const name = userData.name || userData.username || 'Perfil';
        userIcon.href = 'profile.html';
        userIcon.innerHTML = `
            <i class="fas fa-user"></i>
            <span id="userText">${name}</span>
        `;
    } else {
        userIcon.href = 'login.html';
        userIcon.innerHTML = `
            <i class="fas fa-user"></i>
            <span id="userText">Entrar</span>
        `;
    }
}

// Initialize auth page
document.addEventListener('DOMContentLoaded', function() {
    // Update user icon
    updateUserIcon();
    
    // Password strength checker
    const registerPassword = document.getElementById('registerPassword');
    if (registerPassword) {
        registerPassword.addEventListener('input', updatePasswordStrength);
    }
    
    // Phone formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => formatPhone(e.target));
    }
    
    // Confirm password validation
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            const passwordInput = document.getElementById('registerPassword');
            const wrapper = this.parentElement;
            
            if (this.value && passwordInput.value && this.value !== passwordInput.value) {
                wrapper.classList.add('error');
                wrapper.classList.remove('success');
            } else if (this.value && this.value === passwordInput.value) {
                wrapper.classList.remove('error');
                wrapper.classList.add('success');
            }
        });
    }
    
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm('loginForm')) return;
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const formData = new FormData(this);
            
            setButtonLoading(submitBtn, true);
            
            try {
                const result = await handleLogin(formData);
                
                if (result.success) {
                    // Update user icon after successful login
                    updateUserIcon();
                    showToast(result.message, 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showToast('Erro de conexão. Tente novamente.', 'error');
            } finally {
                setButtonLoading(submitBtn, false);
            }
        });
    }
    
    // Registration form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm('registerForm')) return;
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const formData = new FormData(this);
            
            setButtonLoading(submitBtn, true);
            
            try {
                const result = await handleRegister(formData);
                
                if (result.success) {
                    showToast(result.message, 'success');
                    // Switch to login form after successful registration
                    setTimeout(() => {
                        showLogin();
                        // Clear registration form
                        registerForm.reset();
                        // Reset password strength indicator
                        const strengthBar = document.querySelector('.strength-fill');
                        const strengthText = document.querySelector('.strength-text');
                        if (strengthBar) strengthBar.style.width = '0%';
                        if (strengthText) strengthText.textContent = 'Força da senha';
                    }, 2000);
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showToast('Erro de conexão. Tente novamente.', 'error');
            } finally {
                setButtonLoading(submitBtn, false);
            }
        });
    }
});