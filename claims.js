document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Form submission handling
    const claimForm = document.getElementById('claimsForm');
    if (claimForm) {
        claimForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your form submission logic here
            alert('Claim submitted successfully!');
            claimForm.reset();
        });
    }
});

class ClaimsSystem {
    constructor() {
        this.setupEventListeners();
        this.claims = this.loadClaims();
        this.setupTabSwitching();
    }

    setupEventListeners() {
        const claimForm = document.getElementById('claimsForm');
        if (claimForm) {
            claimForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleClaimSubmission(e.target);
            });
        }
    }

    setupTabSwitching() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked button and corresponding content
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).classList.add('active');
            });
        });
    }

    loadClaims() {
        return JSON.parse(localStorage.getItem('claims') || '[]');
    }

    saveClaims() {
        localStorage.setItem('claims', JSON.stringify(this.claims));
    }

    async handleClaimSubmission(form) {
        const notifications = new NotificationSystem();
        
        try {
            const formData = new FormData(form);
            const claimData = {
                id: 'CLM' + Date.now(),
                date: formData.get('serviceDate'),
                type: formData.get('claimType'),
                provider: formData.get('provider'),
                amount: formData.get('amount'),
                description: formData.get('description'),
                status: 'pending',
                submittedAt: new Date().toISOString(),
                documents: [] // Store file names
            };

            // Get uploaded files
            const fileList = document.querySelector('.file-list');
            if (fileList) {
                const fileElements = fileList.querySelectorAll('.file-preview.uploaded');
                if (fileElements.length === 0) {
                    notifications.push('Please upload supporting documents', 'error');
                    return;
                }
                fileElements.forEach(el => {
                    const fileName = el.querySelector('.file-name').textContent;
                    claimData.documents.push(fileName);
                });
            }

            // Add to claims array
            this.claims.unshift(claimData);
            this.saveClaims();
            
            notifications.push('Claim submitted successfully!', 'success');
            
            // Reset form and file list
            form.reset();
            if (fileList) {
                fileList.innerHTML = '';
            }
            
            // Redirect to claims status page after 2 seconds
            setTimeout(() => {
                window.location.href = 'claims-status.html';
            }, 2000);
        } catch (error) {
            console.error('Error submitting claim:', error);
            notifications.push('Failed to submit claim. Please try again.', 'error');
        }
    }
}

// Initialize Claims System
document.addEventListener('DOMContentLoaded', () => {
    new ClaimsSystem();
}); 
