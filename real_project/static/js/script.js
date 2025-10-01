// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
});

function initializeForm() {
    // Set default values
    const stateSelect = document.getElementById('state');
    stateSelect.value = 'Gujarat';
    
    // Initialize user type change handler
    const userTypeInputs = document.querySelectorAll('input[name="userType"]');
    userTypeInputs.forEach(input => {
        input.addEventListener('change', handleUserTypeChange);
    });
    
    // Initialize password confirmation
    const confirmPasswordField = document.getElementById('confirmPassword');
    confirmPasswordField.addEventListener('input', validatePasswordMatch);
    
    // Initialize PIN code auto-formatting
    const pinCodeField = document.getElementById('pinCode');
    pinCodeField.addEventListener('input', formatPinCode);
    
    // Initialize contact number formatting
    const contactField = document.getElementById('contactNumber');
    contactField.addEventListener('input', formatContactNumber);
}

function setupEventListeners() {
    // Form validation on blur
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
    
    // Email validation
    const emailField = document.getElementById('email');
    emailField.addEventListener('blur', validateEmail);
    
    // Password strength validation
    const passwordField = document.getElementById('password');
    passwordField.addEventListener('input', validatePasswordStrength);
}

function handleUserTypeChange(event) {
    const userType = event.target.value;
    const workerFields = document.getElementById('workerFields');
    const expertiseField = document.getElementById('expertise');
    const experienceField = document.getElementById('experience');
    
    if (userType === 'worker') {
        workerFields.style.display = 'block';
        expertiseField.setAttribute('required', 'required');
        experienceField.setAttribute('required', 'required');
        
        // Animate the appearance
        setTimeout(() => {
            workerFields.style.opacity = '1';
            workerFields.style.transform = 'translateY(0)';
        }, 100);
    } else {
        workerFields.style.display = 'none';
        expertiseField.removeAttribute('required');
        experienceField.removeAttribute('required');
    }
}

function formatPinCode(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 6) {
        value = value.substring(0, 6);
    }
    event.target.value = value;
}

function formatContactNumber(event) {
    let value = event.target.value.replace(/\D/g, '');
    
    // Add +91 prefix if not present
    if (value.length > 0 && !value.startsWith('91')) {
        if (value.length === 10) {
            value = '91' + value;
        }
    }
    
    // Format as +91 XXXXX XXXXX
    if (value.length >= 2) {
        if (value.length <= 7) {
            value = '+91 ' + value.substring(2);
        } else {
            value = '+91 ' + value.substring(2, 7) + ' ' + value.substring(7, 12);
        }
    }
    
    event.target.value = value;
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    clearFieldError(field);
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Specific field validations
    switch(field.id) {
        case 'firstName':
        case 'lastName':
            if (value && value.length < 2) {
                showFieldError(field, 'Name must be at least 2 characters long');
                return false;
            }
            break;
        case 'pinCode':
            if (value && value.length !== 6) {
                showFieldError(field, 'PIN code must be 6 digits');
                return false;
            }
            break;
        case 'contactNumber':
            if (value && !isValidPhoneNumber(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
            break;
    }
    
    return true;
}

function validateEmail(event) {
    const email = event.target.value.trim();
    if (email && !isValidEmail(email)) {
        showFieldError(event.target, 'Please enter a valid email address');
        return false;
    }
    return true;
}

function validatePasswordStrength(event) {
    const password = event.target.value;
    const requirements = document.querySelector('.password-requirements small');
    
    if (password.length === 0) {
        requirements.textContent = 'Password must be at least 8 characters long';
        requirements.style.color = 'var(--text-secondary)';
        return;
    }
    
    if (password.length < 8) {
        requirements.textContent = 'Password is too short (minimum 8 characters)';
        requirements.style.color = 'var(--danger-color)';
        return;
    }
    
    let strength = 0;
    let feedback = [];
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength < 3) {
        requirements.textContent = 'Weak password. Consider adding uppercase, numbers, or symbols';
        requirements.style.color = 'var(--warning-color)';
    } else if (strength < 4) {
        requirements.textContent = 'Good password strength';
        requirements.style.color = 'var(--info-color)';
    } else {
        requirements.textContent = 'Strong password';
        requirements.style.color = 'var(--success-color)';
    }
}

function validatePasswordMatch(event) {
    const password = document.getElementById('password').value;
    const confirmPassword = event.target.value;
    
    if (confirmPassword && password !== confirmPassword) {
        showFieldError(event.target, 'Passwords do not match');
        return false;
    }
    
    clearFieldError(event.target);
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    // Should be 12 digits (91 + 10 digit number) or 10 digits
    return cleanPhone.length === 12 || cleanPhone.length === 10;
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
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    `;
    
    field.parentElement.appendChild(errorElement);
}

function clearFieldError(field) {
    const target = typeof field === 'object' ? field : field.target;
    
    target.style.borderColor = '';
    target.style.boxShadow = '';
    
    const existingError = target.parentElement.querySelector('.field-error');
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

async function handleSignup(event) {
    event.preventDefault();
    
    // Validate entire form
    const form = event.target;
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    // Additional validations
    if (!validateEmail({ target: document.getElementById('email') })) isValid = false;
    if (!validatePasswordMatch({ target: document.getElementById('confirmPassword') })) isValid = false;
    
    if (!isValid) {
        showNotification('Please correct the errors in the form before submitting.', 'error');
        return;
    }
    
    // Collect form data
    const formData = collectFormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-primary');
    showLoadingState(submitBtn, 'CREATING ACCOUNT...');
    
    try {
        // Simulate API call (replace with actual FastAPI endpoint)
        await simulateSignupAPI(formData);
        
        // Success
        showNotification(
            `Account created successfully! Welcome ${formData.firstName} ${formData.lastName}. Please check your email for verification.`,
            'success',
            8000
        );
        
        // Reset form after successful submission
        setTimeout(() => {
            form.reset();
            document.getElementById('workerFields').style.display = 'none';
        }, 2000);
        
    } catch (error) {
        showNotification(
            'Failed to create account. Please try again or contact support.',
            'error'
        );
        console.error('Signup error:', error);
    } finally {
        resetButton(submitBtn);
    }
}

function collectFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    // Basic form data
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Additional structured data
    data.fullName = {
        first: document.getElementById('firstName').value,
        middle: document.getElementById('middleName').value,
        last: document.getElementById('lastName').value
    };
    
    data.address = {
        homeNumber: document.getElementById('homeNumber').value,
        addressLine1: document.getElementById('addressLine1').value,
        addressLine2: document.getElementById('addressLine2').value,
        pinCode: document.getElementById('pinCode').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value
    };
    
    // Worker specific data
    if (data.userType === 'worker') {
        data.professional = {
            expertise: document.getElementById('expertise').value,
            experience: document.getElementById('experience').value
        };
    }
    
    // Remove password confirmation from data
    delete data.confirmPassword;
    
    return data;
}

async function simulateSignupAPI(userData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate random success/failure for demo
    if (Math.random() > 0.1) { // 90% success rate
        return { success: true, userId: 'USR' + Date.now() };
    } else {
        throw new Error('Simulation: API Error');
    }
    
    // TODO: Replace with actual FastAPI call
    /*
    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
        throw new Error('Signup failed');
    }
    
    return await response.json();
    */
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
        position: fixed; top: 20px; right: 20px; max-width: 450px; width: 90%;
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
    }
    
    .notification-message { flex: 1; line-height: 1.5; }
    
    .notification-close {
        background: none; border: none; cursor: pointer; padding: 0.25rem;
        border-radius: 50%; width: 28px; height: 28px; display: flex;
        align-items: center; justify-content: center; opacity: 0.7;
        transition: all 0.2s ease; flex-shrink: 0;
    }
    
    .notification-close:hover { opacity: 1; background: rgba(0,0,0,0.1); }
`;
document.head.appendChild(style);
