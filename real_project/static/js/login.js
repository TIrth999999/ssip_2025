// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginForm();
    setupEventListeners();
    loadRememberedCredentials();
});

function initializeLoginForm() {
    // Set up user type change handler
    const userTypeInputs = document.querySelectorAll('input[name="userType"]');
    userTypeInputs.forEach(input => {
        input.addEventListener('change', handleUserTypeChange);
    });
    
    // Initialize form animations
    animatePageLoad();
}

function setupEventListeners() {
    // Form validation
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    
    emailField.addEventListener('blur', validateEmail);
    passwordField.addEventListener('blur', validatePassword);
    
    // Clear errors on input
    emailField.addEventListener('input', () => clearFieldError(emailField));
    passwordField.addEventListener('input', () => clearFieldError(passwordField));
    
    // Enter key submission
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const form = document.querySelector('.login-form');
            if (document.activeElement.closest('.login-form')) {
                handleLogin(e);
            }
        }
    });
}

function handleUserTypeChange(event) {
    const userType = event.target.value;
    const card = event.target.closest('.user-type-card');
    
    // Remove active class from all cards
    document.querySelectorAll('.user-type-card').forEach(c => {
        c.classList.remove('active');
    });
    
    // Add active class to selected card
    card.classList.add('active');
    
    // Update form styling based on user type
    updateFormTheme(userType);
}

function updateFormTheme(userType) {
    const loginContainer = document.querySelector('.login-container');
    
    // Remove existing theme classes
    loginContainer.classList.remove('consumer-theme', 'admin-theme', 'worker-theme');
    
    // Add theme class based on user type
    loginContainer.classList.add(`${userType}-theme`);
}

function validateEmail(event) {
    const email = event.target.value.trim();
    
    if (!email) {
        showFieldError(event.target, 'Email address is required');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showFieldError(event.target, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(event.target);
    return true;
}

function validatePassword(event) {
    const password = event.target.value;
    
    if (!password) {
        showFieldError(event.target, 'Password is required');
        return false;
    }
    
    if (password.length < 6) {
        showFieldError(event.target, 'Password must be at least 6 characters');
        return false;
    }
    
    clearFieldError(event.target);
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = 'var(--danger-color)';
    field.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.1)';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorElement.style.cssText = `
        color: var(--danger-color);
        font-size: 0.8rem;
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    `;
    
    field.parentElement.appendChild(errorElement);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = field.nextElementSibling;
    const icon = toggle.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        field.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    // Get selected user type
    const selectedUserType = document.querySelector('input[name="userType"]:checked');
    if (!selectedUserType) {
        showNotification('Please select your account type', 'warning');
        return;
    }
    
    // Validate form fields
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    
    const isEmailValid = validateEmail({ target: emailField });
    const isPasswordValid = validatePassword({ target: passwordField });
    
    if (!isEmailValid || !isPasswordValid) {
        showNotification('Please correct the errors in the form', 'error');
        return;
    }
    
    // Collect login data
    const loginData = {
        userType: selectedUserType.value,
        email: emailField.value.trim(),
        password: passwordField.value,
        rememberMe: document.getElementById('rememberMe').checked
    };
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-primary');
    showLoadingState(submitBtn, 'SIGNING IN...');
    
    try {
        // Simulate API call
        const response = await simulateLoginAPI(loginData);
        
        // Handle remember me
        if (loginData.rememberMe) {
            saveCredentials(loginData.email, loginData.userType);
        } else {
            clearSavedCredentials();
        }
        
        // Success - redirect to appropriate dashboard
        showNotification(
            `Welcome back! Redirecting to your ${loginData.userType} dashboard...`,
            'success'
        );
        
        setTimeout(() => {
            redirectToDashboard(loginData.userType);
        }, 2000);
        
    } catch (error) {
        showNotification(
            'Invalid credentials. Please check your email and password.',
            'error'
        );
        console.error('Login error:', error);
    } finally {
        resetButton(submitBtn);
    }
}

async function simulateLoginAPI(loginData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Demo credentials for different user types
    const demoCredentials = {
        consumer: { email: 'consumer@demo.com', password: 'consumer123' },
        admin: { email: 'admin@demo.com', password: 'admin123' },
        worker: { email: 'worker@demo.com', password: 'worker123' }
    };
    
    const validCredentials = demoCredentials[loginData.userType];
    
    // Check credentials
    if (loginData.email === validCredentials.email && 
        loginData.password === validCredentials.password) {
        return { 
            success: true, 
            token: 'demo-jwt-token',
            user: {
                id: 'USR' + Date.now(),
                email: loginData.email,
                type: loginData.userType
            }
        };
    } else {
        throw new Error('Invalid credentials');
    }
    
    // TODO: Replace with actual FastAPI call
    /*
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
    });
    
    if (!response.ok) {
        throw new Error('Login failed');
    }
    
    return await response.json();
    */
}

function redirectToDashboard(userType) {
    const dashboardUrls = {
        consumer: '../professional_look/consumer-dashboard/index.html',
        admin: '../professional_look/admin-dashboard/index.html',
        worker: '../professional_look/worker-dashboard/index.html'
    };
    
    window.location.href = dashboardUrls[userType] || '../professional_look/consumer-dashboard/index.html';
}

function saveCredentials(email, userType) {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedUserType', userType);
    }
}

function loadRememberedCredentials() {
    if (typeof(Storage) !== "undefined") {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        const rememberedUserType = localStorage.getItem('rememberedUserType');
        
        if (rememberedEmail) {
            document.getElementById('email').value = rememberedEmail;
            document.getElementById('rememberMe').checked = true;
        }
        
        if (rememberedUserType) {
            const userTypeRadio = document.querySelector(`input[name="userType"][value="${rememberedUserType}"]`);
            if (userTypeRadio) {
                userTypeRadio.checked = true;
                handleUserTypeChange({ target: userTypeRadio });
            }
        }
    }
}

function clearSavedCredentials() {
    if (typeof(Storage) !== "undefined") {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedUserType');
    }
}

function guestAccess() {
    showNotification('Guest access allows you to track complaints and view basic information without logging in.', 'info');
    
    setTimeout(() => {
        // Redirect to guest interface
        window.location.href = '../professional_look/consumer-dashboard/index.html?guest=true';
    }, 2000);
}

function trackComplaint() {
    const complaintId = prompt('Enter your Complaint ID (e.g., CM001234):');
    
    if (complaintId) {
        if (complaintId.match(/^CM\d{6}$/)) {
            showNotification(`Tracking complaint ${complaintId}...`, 'info');
            setTimeout(() => {
                // Redirect to tracking page with complaint ID
                window.location.href = `../professional_look/consumer-dashboard/index.html?track=${complaintId}`;
            }, 1500);
        } else {
            showNotification('Please enter a valid Complaint ID format (CM followed by 6 digits)', 'warning');
        }
    }
}

function showForgotPassword() {
    const email = document.getElementById('email').value;
    const userType = document.querySelector('input[name="userType"]:checked');
    
    if (!email) {
        showNotification('Please enter your email address first', 'warning');
        document.getElementById('email').focus();
        return;
    }
    
    if (!userType) {
        showNotification('Please select your account type first', 'warning');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate password reset
    showNotification(
        `Password reset link has been sent to ${email}. Please check your inbox and follow the instructions.`,
        'success',
        8000
    );
}

function showLoadingState(button, text = 'Loading...') {
    const originalContent = button.innerHTML;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    button.disabled = true;
    button.dataset.originalContent = originalContent;
}

function resetButton(button) {
    button.innerHTML = button.dataset.originalContent || button.innerHTML;
    button.disabled = false;
}

function showNotification(message, type = 'info', duration = 6000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <div class="notification-message">${message}</div>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Apply styles
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; max-width: 400px; width: 90%;
        background: white; border-radius: 0.75rem; box-shadow: var(--shadow-lg);
        border-left: 5px solid ${getNotificationColor(type)}; z-index: 1000;
        animation: slideIn 0.4s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }
    }, duration);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-triangle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#38a169',
        error: '#e53e3e',
        info: '#3182ce',
        warning: '#d69e2e'
    };
    return colors[type] || colors.info;
}

function animatePageLoad() {
    // Animate login container
    const loginContainer = document.querySelector('.login-container');
    const infoPanel = document.querySelector('.info-panel');
    
    loginContainer.style.opacity = '0';
    loginContainer.style.transform = 'translateY(20px)';
    infoPanel.style.opacity = '0';
    infoPanel.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        loginContainer.style.transition = 'all 0.6s ease';
        loginContainer.style.opacity = '1';
        loginContainer.style.transform = 'translateY(0)';
    }, 200);
    
    setTimeout(() => {
        infoPanel.style.transition = 'all 0.6s ease';
        infoPanel.style.opacity = '1';
        infoPanel.style.transform = 'translateY(0)';
    }, 400);
    
    // Animate info items
    setTimeout(() => {
        const infoItems = document.querySelectorAll('.info-item');
        infoItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 150);
        });
    }, 800);
}

// Add notification CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-content {
        display: flex; align-items: flex-start; padding: 1.5rem; gap: 1rem;
    }
    
    .notification-content i:first-child {
        font-size: 1.25rem; margin-top: 0.125rem; flex-shrink: 0;
        color: ${getNotificationColor('info')};
    }
    
    .notification-message { flex: 1; line-height: 1.5; }
    
    .notification-close {
        background: none; border: none; cursor: pointer; padding: 0.25rem;
        border-radius: 50%; width: 28px; height: 28px; display: flex;
        align-items: center; justify-content: center; opacity: 0.7;
        transition: all 0.2s ease; flex-shrink: 0;
    }
    
    .notification-close:hover { opacity: 1; background: rgba(0,0,0,0.1); }
    
    .user-type-card.active {
        border-color: var(--accent-color) !important;
        background: linear-gradient(135deg, rgba(49, 130, 206, 0.1) 0%, rgba(44, 82, 130, 0.1) 100%) !important;
        transform: translateY(-2px);
        box-shadow: var(--shadow);
    }
`;
document.head.appendChild(style);
