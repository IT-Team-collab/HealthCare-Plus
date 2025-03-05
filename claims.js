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
        this.form = document.getElementById('claimsForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        const notifications = new NotificationSystem();

        // Get form data
        const formData = new FormData(e.target);
        const claimData = Object.fromEntries(formData.entries());

        // Get uploaded files
        const fileList = document.querySelector('.file-list');
        const uploadedFiles = Array.from(fileList.children)
            .filter(preview => preview.classList.contains('uploaded'))
            .map(preview => ({
                name: preview.querySelector('.file-name').textContent,
                status: 'uploaded'
            }));

        if (uploadedFiles.length === 0) {
            notifications.push('Please upload supporting documents', 'error');
            return;
        }

        // Simulate API call
        try {
            await this.submitClaim({
                ...claimData,
                files: uploadedFiles
            });

            notifications.push('Claim submitted successfully!', 'success');
            this.form.reset();
            document.querySelector('.file-list').innerHTML = '';
            
            // Redirect to claims status page after 2 seconds
            setTimeout(() => {
                window.location.href = 'claims-status.html';
            }, 2000);
        } catch (error) {
            notifications.push('Failed to submit claim. Please try again.', 'error');
        }
    }

    async submitClaim(data) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Claim submitted:', data);
                resolve({ success: true });
            }, 1500);
        });
    }
}

// Initialize Claims System
document.addEventListener('DOMContentLoaded', () => {
    new ClaimsSystem();
}); 