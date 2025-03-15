class EnrollmentSystem {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.init();
    }

    init() {
        // Check if user is logged in
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            // Redirect to login with return URL
            window.location.href = `login.html?redirect=enrollment.html`;
            return;
        }

        this.setupEventListeners();
        this.updateProgressBar();
        this.loadUserData();
        this.showCurrentStep();

        // Debug log
        console.log('Enrollment system initialized');
    }

    setupEventListeners() {
        // Get buttons
        const nextBtn = document.querySelector('.next-step');
        const prevBtn = document.querySelector('.prev-step');
        const addMemberBtn = document.querySelector('.add-member');
        
        // Debug logs
        console.log('Next button:', nextBtn);
        console.log('Previous button:', prevBtn);
        console.log('Add member button:', addMemberBtn);

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Next button clicked');
                this.nextStep();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Previous button clicked');
                this.previousStep();
            });
        }

        if (addMemberBtn) {
            addMemberBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Add member button clicked');
                this.addFamilyMember();
            });
        }

        // Handle form submissions
        document.querySelectorAll('.enrollment-step form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveStepData(e.target);
            });
        });
    }

    async loadUserData() {
        // Get user data from auth system
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        
        // Pre-fill form fields
        const nameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        if (nameInput) nameInput.value = userData.name || '';
        if (emailInput) emailInput.value = userData.email || '';
    }

    updateProgressBar() {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((step, index) => {
            const stepNum = index + 1;
            if (stepNum < this.currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNum === this.currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('completed', 'active');
            }
        });
    }

    showCurrentStep() {
        document.querySelectorAll('.enrollment-step').forEach(step => {
            step.classList.add('hidden');
        });
        const currentStep = document.getElementById(`step${this.currentStep}`);
        if (currentStep) {
            currentStep.classList.remove('hidden');
        }

        // Update navigation buttons
        const prevBtn = document.querySelector('.prev-step');
        const nextBtn = document.querySelector('.next-step');
        
        if (prevBtn) {
            prevBtn.style.display = this.currentStep === 1 ? 'none' : 'block';
        }
        if (nextBtn) {
            nextBtn.textContent = this.currentStep === this.totalSteps ? 'Submit' : 'Next';
        }
    }

    validateCurrentStep() {
        const currentForm = document.querySelector(`#step${this.currentStep} form`);
        if (!currentForm) return true;

        const isValid = currentForm.checkValidity();
        if (!isValid) {
            currentForm.reportValidity();
        }
        return isValid;
    }

    saveStepData(form) {
        const formData = new FormData(form);
        this.formData[`step${this.currentStep}`] = Object.fromEntries(formData.entries());
    }

    nextStep() {
        if (!this.validateCurrentStep()) return;

        if (this.currentStep === this.totalSteps) {
            this.submitEnrollment();
        } else {
            this.currentStep++;
            this.updateProgressBar();
            this.showCurrentStep();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateProgressBar();
            this.showCurrentStep();
        }
    }

    addFamilyMember() {
        const familyMembers = document.querySelector('.family-members');
        const memberCount = familyMembers.querySelectorAll('.family-member').length + 1;
        
        const memberHTML = `
            <div class="family-member">
                <h4>Family Member ${memberCount}</h4>
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" name="familyMember${memberCount}Name" required>
                </div>
                <div class="form-group">
                    <label>Relationship</label>
                    <select name="familyMember${memberCount}Relationship" required>
                        <option value="">Select relationship</option>
                        <option value="spouse">Spouse</option>
                        <option value="child">Child</option>
                        <option value="parent">Parent</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Date of Birth</label>
                    <input type="date" name="familyMember${memberCount}DOB" required>
                </div>
                <button type="button" class="btn secondary remove-member" onclick="enrollmentSystem.removeFamilyMember(this)">
                    <i class="fas fa-times"></i> Remove
                </button>
            </div>
        `;

        familyMembers.insertAdjacentHTML('beforeend', memberHTML);
    }

    removeFamilyMember(button) {
        button.closest('.family-member').remove();
    }

    async submitEnrollment() {
        const notifications = new NotificationSystem();
        
        try {
            // Simulate API call
            await this.submitEnrollmentData(this.formData);
            
            notifications.push('Enrollment submitted successfully!', 'success');
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = 'claims-status.html';
            }, 1000);
        } catch (error) {
            notifications.push('Failed to submit enrollment. Please try again.', 'error');
        }
    }

    async submitEnrollmentData(data) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Enrollment data:', data);
                resolve({ success: true });
            }, 1500);
        });
    }
}

// Initialize Enrollment System
document.addEventListener('DOMContentLoaded', () => {
    window.enrollmentSystem = new EnrollmentSystem();
}); 
