// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    animatePageLoad();
});

function initializeForm() {
    // Character counter
    const descriptionField = document.getElementById('description');
    const charCountElement = document.getElementById('charCount');
    
    descriptionField.addEventListener('input', function() {
        const currentLength = this.value.length;
        const maxLength = 2000;
        
        charCountElement.textContent = currentLength;
        
        const counterContainer = charCountElement.parentElement;
        if (currentLength > maxLength * 0.8) {
            counterContainer.classList.add('warning');
        } else {
            counterContainer.classList.remove('warning');
        }
    });
    
    // Complaint type change handler
    document.getElementById('complaintType').addEventListener('change', updateDescriptionPlaceholder);
    
    // Form validation
    const form = document.querySelector('.complaint-form');
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
}

function updateDescriptionPlaceholder() {
    const complaintType = document.getElementById('complaintType').value;
    const descriptionField = document.getElementById('description');
    
    const placeholders = {
        'power-outage': 'Please specify the affected area, duration of outage, number of households affected, and any suspected causes...',
        'voltage-fluctuation': 'Describe the voltage issues, frequency of occurrence, affected appliances, and time of occurrence...',
        'billing-issue': 'Explain the billing problem, mention billing period, disputed amount, and previous bill details...',
        'meter-problem': 'Describe the meter issue, current readings, error messages, and when the problem started...',
        'line-damage': 'Provide exact location of damaged lines, extent of damage, safety concerns, and cause if known...',
        'street-light': 'Specify the location and number of non-functional street lights, area affected, and duration...',
        'new-connection': 'Provide details about the new connection requirement, load needed, and property details...',
        'other': 'Please describe your technical issue in detail with relevant information...'
    };
    
    descriptionField.placeholder = placeholders[complaintType] || 'Please describe your issue in detail...';
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    clearFieldError(field);
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Specific validations
    switch(field.type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;
        case 'tel':
            if (value && !isValidPhone(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
            break;
    }
    
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = 'var(--danger-color)';
    field.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.1)';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: var(--danger-color);
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    `;
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    field.parentElement.appendChild(errorElement);
}

function clearFieldError(field) {
    if (typeof field === 'object') {
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function submitComplaint(event) {
    event.preventDefault();
    
    // Validate all required fields
    const form = event.target;
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please correct the errors in the form before submitting.', 'error');
        return;
    }
    
    // Get form data
    const formData = {
        complaintType: document.getElementById('complaintType').value,
        priority: document.getElementById('priority').value,
        description: document.getElementById('description').value,
        address: document.getElementById('address').value,
        contactNumber: document.getElementById('contactNumber').value,
        email: document.getElementById('email').value
    };
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-primary');
    showLoadingState(submitBtn, 'SUBMITTING...');
    
    // Simulate submission
    setTimeout(() => {
        processComplaintSubmission(formData, submitBtn);
    }, 2500);
}

function processComplaintSubmission(formData, submitBtn) {
    // Generate complaint details
    const complaintId = 'CM' + Date.now().toString().slice(-6);
    const submissionTime = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Estimated resolution time based on priority
    const resolutionTimes = {
        high: '4-8 hours',
        medium: '24-48 hours',
        low: '48-72 hours'
    };
    
    const resolutionTime = resolutionTimes[formData.priority];
    
    // Show success notification
    const successMessage = `
        <div style="text-align: left;">
            <strong style="color: var(--success-color); font-size: 1.1em;">
                <i class="fas fa-check-circle"></i> Complaint Registered Successfully!
            </strong>
            <div style="margin-top: 1rem; padding: 1rem; background: #f0fff4; border-radius: 0.5rem; border-left: 4px solid var(--success-color);">
                <div style="margin-bottom: 0.5rem;"><strong>Complaint ID:</strong> <code style="background: #e2e8f0; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: bold;">${complaintId}</code></div>
                <div style="margin-bottom: 0.5rem;"><strong>Registration Time:</strong> ${submissionTime}</div>
                <div style="margin-bottom: 0.5rem;"><strong>Priority Level:</strong> ${formData.priority.toUpperCase()}</div>
                <div style="margin-bottom: 0.5rem;"><strong>Expected Resolution:</strong> ${resolutionTime}</div>
                <div style="margin-top: 1rem; padding: 0.75rem; background: white; border-radius: 0.25rem; font-size: 0.9em;">
                    <strong>Next Steps:</strong><br>
                    • You will receive SMS and email updates<br>
                    • Technical team will be assigned shortly<br>
                    • Track progress using Complaint ID
                </div>
            </div>
        </div>
    `;
    
    showNotification(successMessage, 'success', 12000);
    
    // Reset form
    resetForm();
    
    // Reset submit button
    resetButton(submitBtn);
    
    // Update page state
    updatePageAfterSubmission(complaintId);
}

function resetForm() {
    const form = document.querySelector('.complaint-form');
    
    // Reset all form fields
    document.getElementById('complaintType').selectedIndex = 0;
    document.getElementById('priority').selectedIndex = 0;
    document.getElementById('description').value = '';
    document.getElementById('description').placeholder = 'Please describe your issue in detail...';
    
    // Don't reset pre-filled fields (address, contact, email)
    
    // Reset character counter
    document.getElementById('charCount').textContent = '0';
    document.querySelector('.char-counter').classList.remove('warning');
    
    // Clear any field errors
    const errorElements = form.querySelectorAll('.field-error');
    errorElements.forEach(error => error.remove());
    
    // Reset field styles
    const fields = form.querySelectorAll('.form-control');
    fields.forEach(field => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    });
}

function updatePageAfterSubmission(complaintId) {
    // Could update UI to show recent submission
    // Add to a "recent complaints" section, etc.
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

function showNotification(message, type = 'info', duration = 8000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
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
        animation: slideIn 0.4s ease; max-height: 80vh; overflow-y: auto;
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
    // Animate panels
    const panels = document.querySelectorAll('.panel');
    panels.forEach((panel, index) => {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            panel.style.transition = 'all 0.6s ease';
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Animate quick actions
    setTimeout(() => {
        const quickActions = document.querySelectorAll('.quick-action-item');
        quickActions.forEach((item, index) => {
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
