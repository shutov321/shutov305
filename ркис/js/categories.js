// Categories page functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to current button and content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Handle URL hash for direct navigation to tabs
    const hash = window.location.hash;
    if (hash) {
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${hash.substring(1)}"]`);
        if (tabBtn) {
            tabBtn.click();
        }
    }
});