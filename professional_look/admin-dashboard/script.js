// Worker data by category
const workerData = {
    electrician: [
        { id: 'EMP001', name: 'Amit Kumar Sharma', license: 'EL-2024-001', experience: '8 years' },
        { id: 'EMP005', name: 'Rajesh Patel', license: 'EL-2024-005', experience: '12 years' },
        { id: 'EMP009', name: 'Sunil Singh', license: 'EL-2024-009', experience: '6 years' }
    ],
    lineman: [
        { id: 'EMP002', name: 'Priya Mehta', license: 'LT-2024-002', experience: '10 years' },
        { id: 'EMP006', name: 'Deepak Joshi', license: 'LT-2024-006', experience: '7 years' },
        { id: 'EMP010', name: 'Kiran Dave', license: 'LT-2024-010', experience: '9 years' }
    ],
    supervisor: [
        { id: 'EMP003', name: 'Sunil Kumar', license: 'TS-2024-003', experience: '15 years' },
        { id: 'EMP007', name: 'Manish Shah', license: 'TS-2024-007', experience: '13 years' },
        { id: 'EMP011', name: 'Vikram Patel', license: 'TS-2024-011', experience: '11 years' }
    ],
    engineer: [
        { id: 'EMP004', name: 'Ravi Singh', license: 'FE-2024-004', experience: '18 years' },
        { id: 'EMP008', name: 'Neha Gupta', license: 'FE-2024-008', experience: '14 years' },
        { id: 'EMP012', name: 'Arjun Mehta', license: 'FE-2024-012', experience: '16 years' }
    ]
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    animatePageLoad();
});

function initializeEventListeners() {
    // Worker type change handler
    document.getElementById('workerType').addEventListener('change', updateWorkerList);
    
    // Form validation
    const form = document.querySelector('.assignment-form');
    const inputs = form.querySelectorAll('select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('change', validateForm);
    });
}

function updateWorkerList() {
    const workerType = document.getElementById('workerType').value;
    const workerSelect = document.getElementById('workerName');
    
    // Clear existing options
    workerSelect.innerHTML = '<option value="" disabled selected>-- Select Worker --</option>';
    
    if (workerType && workerData[workerType]) {
        workerData[workerType].forEach(worker => {
            const option = document.createElement('option');
            option.value = worker.id;
            option.textContent = `${worker.name} (${worker.id}) - ${worker.experience}`;
            option.dataset.license = worker.license;
            workerSelect.appendChild(option);
        });
        
        // Enable worker selection
        workerSelect.disabled = false;
    } else {
        workerSelect.disabled = true;
    }
}

function validateForm() {
    const workerType = document.getElementById('workerType').value;
    const workerName = document.getElementById('workerName').value;
    const submitBtn = document.querySelector('.btn-primary');
    
    if (workerType && workerName) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    } else {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
    }
}

function assignTask(event) {
    event.preventDefault();
    
    const workerType = document.getElementById('workerType').value;
    const workerId = document.getElementById('workerName').value;
    const priority = document.getElementById('priority').value;
    
    if (!workerType || !workerId) {
        showNotification('Please select both worker type and worker before assigning the task.', 'error');
        return;
    }
    
    // Get worker details
    const worker = findWorkerById(workerId);
    if (!worker) {
        showNotification('Worker not found. Please refresh and try again.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('.btn-primary');
    showLoadingState(submitBtn);
    
    // Simulate API call
    setTimeout(() => {
        completeAssignment(worker, priority, submitBtn);
    }, 2000);
}

function findWorkerById(workerId) {
    for (const category in workerData) {
        const worker = workerData[category].find(w => w.id === workerId);
        if (worker) return worker;
    }
    return null;
}

function showLoadingState(button) {
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PROCESSING...';
    button.disabled = true;
    button.dataset.originalContent = originalContent;
    
    // Add loading animation to form
    document.querySelector('.assignment-panel').classList.add('loading');
}

function completeAssignment(worker, priority, button) {
    // Generate assignment details
    const assignmentId = 'ASN' + Date.now().toString().slice(-6);
    const currentTime = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Show success notification
    const message = `
        <strong>Task Successfully Assigned!</strong><br>
        <div style="margin-top: 10px; font-size: 0.9em;">
        Assignment ID: <strong>${assignmentId}</strong><br>
        Worker: <strong>${worker.name} (${worker.id})</strong><br>
        License: <strong>${worker.license}</strong><br>
        Priority: <strong>${priority.toUpperCase()}</strong><br>
        Assigned at: <strong>${currentTime}</strong>
        </div>
    `;
    
    showNotification(message, 'success');
    
    // Reset form and button
    resetForm(button);
    
    // Update status indicator
    updateStatusIndicator('assigned');
    
    // Remove loading animation
    document.querySelector('.assignment-panel').classList.remove('loading');
}

function resetForm(button) {
    // Reset button
    button.innerHTML = button.dataset.originalContent;
    button.disabled = true;
    button.style.opacity = '0.6';
    
    // Reset form fields
    document.getElementById('workerType').selectedIndex = 0;
    document.getElementById('workerName').innerHTML = '<option value="" disabled selected>-- Select Worker --</option>';
    document.getElementById('workerName').disabled = true;
    document.getElementById('priority').selectedIndex = 0;
}

function scheduleTask() {
    showNotification('Scheduling feature will open task calendar for future assignment.', 'info');
}

function updateStatusIndicator(status) {
    const indicator = document.querySelector('.status-indicator');
    
    switch(status) {
        case 'assigned':
            indicator.textContent = 'Task Assigned';
            indicator.className = 'status-indicator assigned';
            indicator.style.backgroundColor = 'var(--success-color)';
            break;
        default:
            indicator.textContent = 'Awaiting Assignment';
            indicator.className = 'status-indicator pending';
    }
}

function showNotification(message, type = 'info') {
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
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        border-left: 4px solid ${getNotificationColor(type)};
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 8 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 8000);
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
    
    // Animate summary items
    setTimeout(() => {
        const summaryItems = document.querySelectorAll('.summary-item');
        summaryItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-10px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }, 400);
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
        display: flex;
        align-items: flex-start;
        padding: 1rem;
        gap: 0.75rem;
    }
    
    .notification-content i:first-child {
        font-size: 1.25rem;
        margin-top: 0.125rem;
    }
    
    .notification-message {
        flex: 1;
        line-height: 1.5;
    }
    
    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        transition: all 0.2s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
        background: rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(style);
