class ClaimsStatus {
    constructor() {
        this.claims = [];
        this.init();
    }

    init() {
        this.fetchClaims();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const searchInput = document.querySelector('.search-bar input');
        const statusFilter = document.getElementById('statusFilter');
        const dateFilter = document.getElementById('dateFilter');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterClaims());
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterClaims());
        }
        if (dateFilter) {
            dateFilter.addEventListener('change', () => this.filterClaims());
        }

        // Modal close button
        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }
    }

    async fetchClaims() {
        // Simulate API call
        const mockClaims = [
            {
                id: 'CLM001',
                date: '2024-03-15',
                type: 'Medical Visit',
                amount: 150.00,
                status: 'pending',
                provider: 'Dr. Smith Clinic',
                description: 'Regular checkup',
                documents: ['receipt.pdf', 'medical_report.pdf']
            },
            // Add more mock claims...
        ];

        this.claims = mockClaims;
        this.renderClaims(this.claims);
    }

    renderClaims(claims) {
        const tbody = document.getElementById('claimsTableBody');
        if (!tbody) return;

        tbody.innerHTML = claims.map(claim => `
            <tr>
                <td>${claim.id}</td>
                <td>${new Date(claim.date).toLocaleDateString()}</td>
                <td>${claim.type}</td>
                <td>$${claim.amount.toFixed(2)}</td>
                <td>
                    <span class="status-badge status-${claim.status}">
                        ${claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                </td>
                <td>
                    <button class="btn secondary" onclick="claimsStatus.viewDetails('${claim.id}')">
                        View Details
                    </button>
                </td>
            </tr>
        `).join('');
    }

    filterClaims() {
        const searchQuery = document.querySelector('.search-bar input').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const dateFilter = parseInt(document.getElementById('dateFilter').value);

        let filtered = this.claims.filter(claim => {
            const matchesSearch = claim.id.toLowerCase().includes(searchQuery) ||
                                claim.type.toLowerCase().includes(searchQuery);
            
            const matchesStatus = !statusFilter || claim.status === statusFilter;
            
            const matchesDate = !dateFilter || 
                              (new Date(claim.date) >= new Date(Date.now() - dateFilter * 24 * 60 * 60 * 1000));

            return matchesSearch && matchesStatus && matchesDate;
        });

        this.renderClaims(filtered);
    }

    viewDetails(claimId) {
        const claim = this.claims.find(c => c.id === claimId);
        if (!claim) return;

        const modal = document.getElementById('claimDetailsModal');
        const modalBody = modal.querySelector('.modal-body');

        modalBody.innerHTML = `
            <div class="claim-details">
                <div class="detail-row">
                    <strong>Claim ID:</strong>
                    <span>${claim.id}</span>
                </div>
                <div class="detail-row">
                    <strong>Date:</strong>
                    <span>${new Date(claim.date).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                    <strong>Type:</strong>
                    <span>${claim.type}</span>
                </div>
                <div class="detail-row">
                    <strong>Provider:</strong>
                    <span>${claim.provider}</span>
                </div>
                <div class="detail-row">
                    <strong>Amount:</strong>
                    <span>$${claim.amount.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                    <strong>Status:</strong>
                    <span class="status-badge status-${claim.status}">
                        ${claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                </div>
                <div class="detail-row">
                    <strong>Description:</strong>
                    <p>${claim.description}</p>
                </div>
                <div class="detail-row">
                    <strong>Documents:</strong>
                    <ul class="document-list">
                        ${claim.documents.map(doc => `
                            <li>
                                <i class="fas fa-file-pdf"></i>
                                <span>${doc}</span>
                                <button class="btn secondary">Download</button>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('claimDetailsModal');
        modal.classList.remove('active');
    }
}

// Initialize Claims Status
const claimsStatus = new ClaimsStatus(); 