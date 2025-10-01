// Character counter functionality
document.getElementById('description').addEventListener('input', function() {
    const maxLength = 2000;
    const currentLength = this.value.length;
    const charCountElement = document.getElementById('charCount');
    const counterElement = charCountElement.parentElement;
    
    charCountElement.textContent = currentLength;
    
    // Change color when approaching limit
    if (currentLength > maxLength * 0.8) {
        counterElement.classList.add('warning');
    } else {
        counterElement.classList.remove('warning');
    }
});

function submitComplaint(event) {
    event.preventDefault();
    
    const complaintType = document.getElementById('complaintType').value;
    const description = document.getElementById('description').value;
    const address = document.getElementById('address').value;
    
    // Validate form
    if (!complaintType || complaintType === 'select' || !description.trim() || !address.trim()) {
        alert('Please fill in all required fields.');
        return;
    }
    
    const submitBtn = event.target.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate submission
    setTimeout(() => {
        // Generate complaint ID
        const complaintId = 'CM' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.style.display = 'block';
        successMessage.innerHTML = `
            <strong>Complaint Submitted Successfully!</strong><br>
            Your Complaint ID: <strong>${complaintId}</strong><br>
            You will receive SMS and email updates about your complaint status.
        `;
        
        document.querySelector('.complaint-form-container').appendChild(successMessage);
        
        // Reset form
        document.getElementById('complaintType').selectedIndex = 0;
        document.getElementById('description').value = '';
        document.getElementById('address').value = '';
        document.getElementById('charCount').textContent = '0';
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth' });
        
        // Remove success message after 10 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 10000);
        
    }, 2000);
}

// Add animations on load
document.addEventListener('DOMContentLoaded', function() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            group.style.transition = 'all 0.5s ease';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Add focus animations
    const inputs = document.querySelectorAll('.form-select, .form-input, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});

// Add complaint type change handler for dynamic validation
document.getElementById('complaintType').addEventListener('change', function() {
    const description = document.getElementById('description');
    const complaintType = this.value;
    
    // Set appropriate placeholder based on complaint type
    let placeholder = 'Please describe your issue in detail...';
    
    switch(complaintType) {
        case 'power-outage':
            placeholder = 'Please specify the affected area, duration of outage, and any additional details...';
            break;
        case 'voltage-fluctuation':
            placeholder = 'Describe the voltage issues, frequency of occurrence, and affected appliances...';
            break;
        case 'billing-issue':
            placeholder = 'Explain the billing problem, mention your consumer ID and billing period...';
            break;
        case 'meter-problem':
            placeholder = 'Describe the meter issue, readings, and any error messages displayed...';
            break;
        case 'line-damage':
            placeholder = 'Provide location details of damaged lines and describe the extent of damage...';
            break;
        case 'street-light':
            placeholder = 'Specify the location and number of non-functional street lights...';
            break;
    }
    
    description.placeholder = placeholder;
});
