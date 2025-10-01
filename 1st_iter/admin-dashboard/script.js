function assignTask() {
    const workerType = document.getElementById('workerType').value;
    const workerName = document.getElementById('workerName').value;
    
    if (workerType === 'SELECT' || workerName === 'SELECT') {
        alert('Please select both worker type and worker name before assigning the task.');
        return;
    }
    
    // Add loading animation
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Assigning...';
    btn.disabled = true;
    
    setTimeout(() => {
        alert(`Task successfully assigned to ${workerName}! The worker has been notified via SMS and email.`);
        btn.textContent = originalText;
        btn.disabled = false;
        
        // Reset form
        document.getElementById('workerType').selectedIndex = 0;
        document.getElementById('workerName').selectedIndex = 0;
    }, 2000);
}

// Update worker names based on worker type
document.getElementById('workerType').addEventListener('change', function() {
    const workerType = this.value;
    const workerNameSelect = document.getElementById('workerName');
    
    // Clear previous options
    workerNameSelect.innerHTML = '<option disabled selected>SELECT</option>';
    
    let workers = [];
    
    switch(workerType) {
        case 'electrician':
            workers = [
                'Amit Sharma (ID: EMP001)',
                'Rajesh Kumar (ID: EMP005)',
                'Sunil Singh (ID: EMP009)'
            ];
            break;
        case 'lineman':
            workers = [
                'Priya Patel (ID: EMP002)',
                'Deepak Joshi (ID: EMP006)',
                'Kiran Dave (ID: EMP010)'
            ];
            break;
        case 'technician':
            workers = [
                'Sunil Kumar (ID: EMP003)',
                'Manish Shah (ID: EMP007)',
                'Vikram Patel (ID: EMP011)'
            ];
            break;
        case 'engineer':
            workers = [
                'Ravi Singh (ID: EMP004)',
                'Neha Gupta (ID: EMP008)',
                'Arjun Mehta (ID: EMP012)'
            ];
            break;
    }
    
    workers.forEach((worker, index) => {
        const option = document.createElement('option');
        option.value = `worker${index + 1}`;
        option.textContent = worker;
        workerNameSelect.appendChild(option);
    });
});

// Add animations on load
document.addEventListener('DOMContentLoaded', function() {
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
});
