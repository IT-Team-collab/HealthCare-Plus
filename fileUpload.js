class FileUploadSystem {
    constructor() {
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        this.init();
    }

    init() {
        this.setupDropZones();
        this.setupFileInputs();
    }

    setupDropZones() {
        const dropZones = document.querySelectorAll('.file-drop-zone');
        
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => this.handleDragOver(e));
            zone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            zone.addEventListener('drop', (e) => this.handleDrop(e));
            
            // Click to upload
            zone.addEventListener('click', () => {
                const input = zone.querySelector('input[type="file"]');
                if (input) input.click();
            });
        });
    }

    setupFileInputs() {
        const fileInputs = document.querySelectorAll('.file-input');
        
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => this.handleFileSelect(e));
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const zone = e.currentTarget;
        zone.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        this.processFiles(files, zone);
    }

    handleFileSelect(e) {
        const files = e.target.files;
        const zone = e.target.closest('.file-drop-zone');
        this.processFiles(files, zone);
    }

    async processFiles(files, zone) {
        const notifications = new NotificationSystem();
        const fileList = zone.querySelector('.file-list');
        
        for (let file of files) {
            // Validate file
            if (!this.validateFile(file)) {
                continue;
            }

            // Create preview
            const preview = this.createFilePreview(file);
            fileList.appendChild(preview);

            try {
                // Simulate file upload
                await this.uploadFile(file, preview);
                
                preview.querySelector('.progress-bar').style.width = '100%';
                preview.querySelector('.status').textContent = 'Uploaded';
                preview.classList.add('uploaded');
            } catch (error) {
                preview.classList.add('error');
                preview.querySelector('.status').textContent = 'Error';
                notifications.push(`Failed to upload ${file.name}`, 'error');
            }
        }
    }

    validateFile(file) {
        const notifications = new NotificationSystem();

        if (!this.allowedTypes.includes(file.type)) {
            notifications.push('Invalid file type. Please upload PDF, Word, or image files.', 'error');
            return false;
        }

        if (file.size > this.maxFileSize) {
            notifications.push('File too large. Maximum size is 10MB.', 'error');
            return false;
        }

        return true;
    }

    createFilePreview(file) {
        const preview = document.createElement('div');
        preview.className = 'file-preview';
        
        const icon = this.getFileIcon(file.type);
        
        preview.innerHTML = `
            <div class="file-info">
                <i class="fas ${icon}"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">${this.formatFileSize(file.size)}</span>
            </div>
            <div class="file-status">
                <div class="progress">
                    <div class="progress-bar"></div>
                </div>
                <span class="status">Uploading...</span>
                <button class="remove-file">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        preview.querySelector('.remove-file').addEventListener('click', () => {
            preview.remove();
        });

        return preview;
    }

    getFileIcon(type) {
        if (type.includes('pdf')) return 'fa-file-pdf';
        if (type.includes('word')) return 'fa-file-word';
        if (type.includes('image')) return 'fa-file-image';
        return 'fa-file';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async uploadFile(file, preview) {
        // Simulate file upload with progress
        const progress = preview.querySelector('.progress-bar');
        
        return new Promise((resolve) => {
            let percent = 0;
            const interval = setInterval(() => {
                percent += 5;
                progress.style.width = `${percent}%`;
                
                if (percent >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }
}

// Initialize File Upload System
document.addEventListener('DOMContentLoaded', () => {
    new FileUploadSystem();
}); 