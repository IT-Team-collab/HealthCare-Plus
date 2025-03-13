class ClaimsStatus {
    constructor() {
        this.claims = this.loadClaims();
        this.init();
    }

    init() {
        this.updateSummary();
        this.displayClaims();
        this.setupEventListeners();
    }

    loadClaims() {
        return JSON.parse(localStorage.getItem('claims') || '[]');
    }

    updateSummary() {
        const totalClaims = this.claims.length;
        const pendingClaims = this.claims.filter(claim => claim.status === 'pending').length;
        const approvedClaims = this.claims.filter(claim => claim.status === 'approved').length;
        const rejectedClaims = this.claims.filter(claim => claim.status === 'rejected').length;

        const summaryCards = document.querySelectorAll('.summary-card .count');
        if (summaryCards.length >= 4) {
            summaryCards[0].textContent = totalClaims;
            summaryCards[1].textContent = pendingClaims;
            summaryCards[2].textContent = approvedClaims;
            summaryCards[3].textContent = rejectedClaims;
        }
    }

    displayClaims() {
        const tableBody = document.getElementById('claimsTableBody');
        if (!tableBody) return;

        if (this.claims.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="no-claims">
                        <i class="fas fa-file-medical"></i>
                        <p>No claims found</p>
                        <a href="claims.html" class="btn primary">Submit a Claim</a>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = this.claims.map(claim => `
            <tr>
                <td>${claim.id}</td>
                <td>${new Date(claim.date).toLocaleDateString()}</td>
                <td>${this.formatClaimType(claim.type)}</td>
                <td>$${parseFloat(claim.amount).toFixed(2)}</td>
                <td>
                    <span class="status-badge ${claim.status}">
                        ${claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                </td>
                <td>
                    <button class="btn secondary view-details" data-claim-id="${claim.id}">
                        View Details
                    </button>
                </td>
            </tr>
        `).join('');

        // Add click handlers for view details buttons
        tableBody.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', () => this.showClaimDetails(btn.dataset.claimId));
        });
    }

    formatClaimType(type) {
        return type.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterClaims(e.target.value);
            });
        }

        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.filterClaims(document.querySelector('.search-bar input')?.value || '');
            });
        }
    }

    filterClaims(searchTerm = '') {
        const statusFilter = document.getElementById('statusFilter')?.value;
        const filteredClaims = this.claims.filter(claim => {
            const matchesSearch = !searchTerm || 
                claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                claim.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                claim.provider.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = !statusFilter || claim.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        const tableBody = document.getElementById('claimsTableBody');
        if (tableBody) {
            if (filteredClaims.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="no-claims">
                            <i class="fas fa-search"></i>
                            <p>No claims match your search</p>
                        </td>
                    </tr>
                `;
            } else {
                this.displayFilteredClaims(filteredClaims);
            }
        }
    }

    displayFilteredClaims(claims) {
        const tableBody = document.getElementById('claimsTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = claims.map(claim => `
            <tr>
                <td>${claim.id}</td>
                <td>${new Date(claim.date).toLocaleDateString()}</td>
                <td>${this.formatClaimType(claim.type)}</td>
                <td>$${parseFloat(claim.amount).toFixed(2)}</td>
                <td>
                    <span class="status-badge ${claim.status}">
                        ${claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                </td>
                <td>
                    <button class="btn secondary view-details" data-claim-id="${claim.id}">
                        View Details
                    </button>
                </td>
            </tr>
        `).join('');

        // Reattach event listeners
        tableBody.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', () => this.showClaimDetails(btn.dataset.claimId));
        });
    }

    showClaimDetails(claimId) {
        const claim = this.claims.find(c => c.id === claimId);
        if (!claim) return;

        const modal = document.getElementById('claimDetailsModal');
        if (!modal) return;

        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="claim-detail-grid">
                <div class="detail-item">
                    <h4>Claim ID</h4>
                    <p>${claim.id}</p>
                </div>
                <div class="detail-item">
                    <h4>Service Date</h4>
                    <p>${new Date(claim.date).toLocaleDateString()}</p>
                </div>
                <div class="detail-item">
                    <h4>Type</h4>
                    <p>${this.formatClaimType(claim.type)}</p>
                </div>
                <div class="detail-item">
                    <h4>Provider</h4>
                    <p>${claim.provider}</p>
                </div>
                <div class="detail-item">
                    <h4>Amount</h4>
                    <p>$${parseFloat(claim.amount).toFixed(2)}</p>
                </div>
                <div class="detail-item">
                    <h4>Status</h4>
                    <p class="status-badge ${claim.status}">
                        ${claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </p>
                </div>
                <div class="detail-item full-width">
                    <h4>Description</h4>
                    <p>${claim.description || 'No description provided'}</p>
                </div>
                ${claim.documents.length ? `
                    <div class="detail-item full-width">
                        <h4>Supporting Documents</h4>
                        <ul class="document-list">
                            ${claim.documents.map(doc => `
                                <li><i class="fas fa-file"></i> ${doc}</li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;

        modal.classList.add('active');

        // Close modal functionality
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.onclick = () => modal.classList.remove('active');
        }
    }
}

// Initialize Claims Status
document.addEventListener('DOMContentLoaded', () => {
    new ClaimsStatus();
}); 
