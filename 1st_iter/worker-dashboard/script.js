function goNow() {
    // Add loading animation
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Starting...';
    btn.disabled = true;
    
    setTimeout(() => {
        alert('Task started! You will be notified when to proceed to the location.');
        btn.textContent = originalText;
        btn.disabled = false;
    }, 2000);
}

function openScheduleModal() {
    alert('Please select a date and time from the schedule section on the right.');
}

// Add some interactive animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate info items on load
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});
