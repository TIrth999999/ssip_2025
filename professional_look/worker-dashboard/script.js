// Task status management
let currentTaskStatus = 'assigned';
let taskStartTime = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    animatePageLoad();
});

function initializePage() {
    updateTimestamps();
    updateProgressIndicator();
}

function updateTimestamps() {
    const now = new Date();
    const currentTime = now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function startTask() {
    if (currentTaskStatus !== 'assigned') {
        showNotification('Task has already been started.', 'warning');
        return;
    }
    
    const startBtn = event.target;
    showLoadingState(startBtn, 'STARTING...');
    
    setTimeout(() => {
        currentTaskStatus = 'started';
        taskStartTime = new Date();
        
        updateTaskStatus();
        updateProgressTimeline();
        resetButton(startBtn, 'TASK STARTED', 'btn-success');
        
        showNotification(
            'Task started successfully! Please proceed to the service location and update your progress.',
            'success'
        );
        
        enableLocationActions();
        
    }, 2000);
}

function updateTaskStatus() {
    const statusBadge = document.querySelector('.status-badge');
    const completionIndicator = document.querySelector('.completion-indicator');
    
    switch(currentTaskStatus) {
        case 'started':
            statusBadge.textContent = 'IN PROGRESS';
            statusBadge.className = 'status-badge in-progress';
            statusBadge.style.backgroundColor = 'var(--info-color)';
            completionIndicator.textContent = '20% Complete';
            break;
        case 'on-location':
            completionIndicator.textContent = '40% Complete';
            break;
        case 'working':
            completionIndicator.textContent = '70% Complete';
            break;
        case 'completed':
            statusBadge.textContent = 'COMPLETED';
            statusBadge.className = 'status-badge completed';
            statusBadge.style.backgroundColor = 'var(--success-color)';
            completionIndicator.textContent = '100% Complete';
            completionIndicator.style.backgroundColor = 'var(--success-color)';
            break;
    }
}

function updateProgressTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const currentTime = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    switch(currentTaskStatus) {
        case 'started':
            timelineItems[1].classList.add('completed');
            timelineItems[1].classList.remove('pending');
            timelineItems[1].querySelector('.timeline-time').textContent = currentTime;
            break;
    }
}

function showScheduleModal() {
    showNotification('Schedule feature: You can set a specific time to start this task later.', 'info');
}

function getDirections() {
    const address = "123, Satellite Road, Ahmedabad, Gujarat - 380015";
    showNotification(`Opening directions to: ${address}`, 'info');
    // In real app, would integrate with Google Maps or similar
    setTimeout(() => {
        window.open(`https://www.google.com/maps/search/${encodeURIComponent(address)}`, '_blank');
    }, 1000);
}

function contactConsumer() {
    showNotification('Contact feature: Calling consumer at registered mobile number...', 'info');
    // In real app, would initiate call or show contact details
}

function enableLocationActions() {
    // Enable additional functionality after task starts
    const additionalBtns = document.querySelectorAll('.additional-actions .btn');
    additionalBtns.forEach(btn => {
        btn.style.opacity = '1';
        btn.disabled = false;
    });
}

function showLoadingState(button, text = 'Loading...') {
    const originalContent = button.innerHTML;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    button.disabled = true;
    button.dataset.originalContent = originalContent;
}

function resetButton(button, newText, newClass) {
    button.innerHTML = button.dataset.originalContent;
    if (newText) {
        button.innerHTML = button.innerHTML.replace(/START TASK/, newText);
    }
    if (newClass) {
        button.className = `btn ${newClass}`;
    }
    button.disabled = false;
}

function updateProgressIndicator() {
    const indicator = document.querySelector('.completion-indicator');
    if (indicator) {
        indicator.textContent = '0% Complete';
    }
}

function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
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
    
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; max-width: 400px;
        background: white; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        border-left: 4px solid ${getNotificationColor(type)}; z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 6000);
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
        display: flex; align-items: flex-start; padding: 1rem; gap: 0.75rem;
    }
    
    .notification-content i:first-child {
        font-size: 1.25rem; margin-top: 0.125rem;
    }
    
    .notification-message { flex: 1; line-height: 1.5; }
    
    .notification-close {
        background: none; border: none; cursor: pointer; padding: 0.25rem;
        border-radius: 50%; width: 24px; height: 24px; display: flex;
        align-items: center; justify-content: center; opacity: 0.7;
        transition: all 0.2s ease;
    }
    
    .notification-close:hover { opacity: 1; background: rgba(0,0,0,0.1); }
`;
document.head.appendChild(style);
