// Leave Management Dashboard - Complete Functionality
class LeaveManagementDashboard {
    constructor() {
        this.leavePlans = [
            { id: 1, name: 'Maternity', duration: 60, recall: 'No', autorenew: 'No' },
            { id: 2, name: 'Sick', duration: 14, recall: 'No', autorenew: 'Yes' },
            { id: 3, name: 'Compassionate', duration: 30, recall: 'No', autorenew: 'No' },
            { id: 4, name: 'Exam', duration: 20, recall: 'No', autorenew: 'No' },
            { id: 5, name: 'Paternity', duration: 60, recall: 'No', autorenew: 'No' },
            { id: 6, name: 'Casual', duration: 10, recall: 'Yes', autorenew: 'No' },
            { id: 7, name: 'Exam', duration: 20, recall: 'No', autorenew: 'No' }
        ];
        
        this.contacts = [
            { id: 1, name: 'John Smith', email: 'john.smith@company.com', department: 'HR', avatar: 'JS' },
            { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@company.com', department: 'Finance', avatar: 'SJ' },
            { id: 3, name: 'Mike Wilson', email: 'mike.wilson@company.com', department: 'IT', avatar: 'MW' },
            { id: 4, name: 'Emily Davis', email: 'emily.davis@company.com', department: 'Marketing', avatar: 'ED' },
            { id: 5, name: 'David Brown', email: 'david.brown@company.com', department: 'Operations', avatar: 'DB' }
        ];
        
        // Load messages from localStorage or use default sample data
        this.messages = this.loadMessagesFromStorage();
        
        this.currentTab = 'leave-settings';
        this.currentInterface = 'leave-management';
        
        // EmailJS Configuration - Hardcoded for immediate use
        this.emailConfig = {
            serviceId: 'service_6p2uybl', // Your Gmail service ID
            templateId: 'template_wzrgz7o', // Your Welcome template ID
            userId: '4V-eBMvtg9VxMcGg3' // Your EmailJS Public Key (must start with 'user_')
        };
        
        this.init();
    }

    // Local Storage Methods for Messages
    loadMessagesFromStorage() {
        try {
            const savedMessages = localStorage.getItem('dashboardMessages');
            if (savedMessages) {
                const messages = JSON.parse(savedMessages);
                // Convert timestamp strings back to Date objects
                return messages.map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
            }
        } catch (error) {
            console.error('Error loading messages from storage:', error);
        }
        
        // Return default sample messages if no storage data
        return [
            { id: 1, from: 'john.smith@company.com', to: 'chandra.sekhar@company.com', subject: 'Leave Request Approval', content: 'Your leave request has been approved for the dates requested.', timestamp: new Date('2024-01-15T10:30:00'), read: true },
            { id: 2, from: 'sarah.johnson@company.com', to: 'chandra.sekhar@company.com', subject: 'Payroll Update', content: 'Please review the updated payroll information for this month.', timestamp: new Date('2024-01-14T14:20:00'), read: false },
            { id: 3, from: 'chandra.sekhar@company.com', to: 'mike.wilson@company.com', subject: 'System Access Request', content: 'I need access to the new HR system for leave management.', timestamp: new Date('2024-01-13T09:15:00'), read: true }
        ];
    }

    saveMessagesToStorage() {
        try {
            localStorage.setItem('dashboardMessages', JSON.stringify(this.messages));
            console.log('Messages saved to localStorage:', this.messages.length, 'messages');
        } catch (error) {
            console.error('Error saving messages to storage:', error);
        }
    }

    markMessageAsRead(messageId) {
        const message = this.messages.find(msg => msg.id === messageId);
        if (message) {
            message.read = true;
            this.saveMessagesToStorage();
        }
    }

    deleteMessage(messageId) {
        this.messages = this.messages.filter(msg => msg.id !== messageId);
        this.saveMessagesToStorage();
        this.showNotification('Message deleted successfully!', 'success');
        // Refresh the messages interface to show updated count
        this.renderMessagesInterface();
    }

    processFileAttachments(files) {
        if (!files || files.length === 0) return [];
        
        const attachments = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            attachments.push({
                name: file.name,
                size: this.formatFileSize(file.size),
                type: file.type,
                lastModified: new Date(file.lastModified)
            });
        }
        return attachments;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    initializeFileUpload() {
        const fileInput = document.getElementById('documentUpload');
        const fileInfo = document.getElementById('fileInfo');
        const filePreview = document.getElementById('filePreview');

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const files = e.target.files;
                this.updateFilePreview(files, fileInfo, filePreview);
            });
        }
    }

    updateFilePreview(files, fileInfo, filePreview) {
        if (!files || files.length === 0) {
            fileInfo.innerHTML = '';
            filePreview.innerHTML = '';
            return;
        }

        // Show file info
        const fileList = Array.from(files).map(file => 
            `<div class="file-item">
                <i class="bi bi-file-earmark"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">(${this.formatFileSize(file.size)})</span>
                <button type="button" class="btn btn-sm btn-outline-danger remove-file" data-file-name="${file.name}">
                    <i class="bi bi-x"></i>
                </button>
            </div>`
        ).join('');
        
        fileInfo.innerHTML = fileList;

        // Show file previews for images
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (imageFiles.length > 0) {
            const previewList = imageFiles.map(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'file-preview-img';
                    img.alt = file.name;
                    filePreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        }

        // Add remove file functionality
        this.addRemoveFileListeners();
    }

    addRemoveFileListeners() {
        const removeButtons = document.querySelectorAll('.remove-file');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const fileName = e.target.closest('.remove-file').dataset.fileName;
                this.removeFile(fileName);
            });
        });
    }

    removeFile(fileName) {
        const fileInput = document.getElementById('documentUpload');
        const dt = new DataTransfer();
        
        Array.from(fileInput.files).forEach(file => {
            if (file.name !== fileName) {
                dt.items.add(file);
            }
        });
        
        fileInput.files = dt.files;
        
        // Trigger change event to update preview
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
    }

    initializeMessageInteractions() {
        // Handle delete buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.delete-message-btn')) {
                const messageItem = e.target.closest('.message-item');
                const messageId = parseInt(messageItem.dataset.messageId);
                
                if (confirm('Are you sure you want to delete this message?')) {
                    this.deleteMessage(messageId);
                }
            }
        });

        // Handle message clicks to mark as read
        document.addEventListener('click', (e) => {
            if (e.target.closest('.message-item')) {
                const messageItem = e.target.closest('.message-item');
                const messageId = parseInt(messageItem.dataset.messageId);
                
                // Mark as read if it's unread
                const message = this.messages.find(msg => msg.id === messageId);
                if (message && !message.read) {
                    this.markMessageAsRead(messageId);
                    messageItem.classList.remove('unread');
                }
            }
        });
    }

    init() {
        this.initializeSidebar();
        this.initializeTabs();
        this.initializeForm();
        this.initializeTable();
        this.initializeSearch();
        this.initializeNotifications();
        this.loadLeavePlans();
    }

    // Sidebar functionality
    initializeSidebar() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const header = document.querySelector('.header');
        const mainContent = document.querySelector('.main-content');

        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSidebar(sidebar, header, mainContent);
            });

            // Removed auto-close on outside click to keep sidebar open until toggled

            // Initialize sidebar navigation
            this.initializeSidebarNavigation();
        }
    }

    toggleSidebar(sidebar, header, mainContent) {
        sidebar.classList.toggle('active');
        
        if (sidebar.classList.contains('active')) {
            header.style.marginLeft = '300px';
            mainContent.style.marginLeft = '300px';
        } else {
            header.style.marginLeft = '0';
            mainContent.style.marginLeft = '0';
        }
    }

    closeSidebar(sidebar, header, mainContent) {
        sidebar.classList.remove('active');
        header.style.marginLeft = '0';
        mainContent.style.marginLeft = '0';
    }

    initializeSidebarNavigation() {
        const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                // Add active class to clicked item
                item.classList.add('active');
                
                // Handle navigation
                const text = item.querySelector('span').textContent;
                console.log(`Navigating to: ${text}`);
                
                if (text === 'Messages') {
                    this.showMessagesInterface();
                } else if (text === 'Dashboard') {
                    this.showLeaveManagementInterface();
                } else {
                    this.showUnderConstruction(text);
                }
            });
        });
    }

    showUnderConstruction(name) {
        const mainContent = document.querySelector('.main-content .container-fluid');
        if (!mainContent) return;
        const navTabs = mainContent.querySelector('.nav-tabs');
        const html = `
            <div class="row">
                <div class="col-12">
                    <div class="content-panel text-center" style="min-height: 300px; display: flex; align-items: center; justify-content: center;">
                        <div>
                            <h2 class="mb-3"><i class="bi bi-cone-striped me-2 text-warning"></i>${name}</h2>
                            <p class="lead mb-1">This section is under construction.</p>
                            <p class="text-muted">Please check back later.</p>
                        </div>
                    </div>
                </div>
            </div>`;
        // Insert after the tabs row if present, else after the title
        const tabsRow = navTabs ? navTabs.closest('.row') : null;
        const anchorRow = tabsRow || mainContent.querySelector('.row:first-child');
        if (anchorRow) {
            // Remove rows after the anchor (keep title and tabs visible)
            const rows = Array.from(mainContent.querySelectorAll('.row'));
            rows.forEach((row, idx) => {
                if (row === anchorRow) {
                    // remove all rows after this one
                    for (let i = idx + 1; i < rows.length; i++) {
                        rows[i].remove();
                    }
                }
            });
            anchorRow.insertAdjacentHTML('afterend', html);
            this.updatePageTitle(name);
        }
    }

    // Tab functionality
    initializeTabs() {
        const tabs = document.querySelectorAll('.nav-tabs .btn');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => {
                    t.classList.remove('active', 'btn-warning');
                    t.classList.add('btn-primary');
                });
                
                // Add active class to clicked tab
                tab.classList.remove('btn-primary');
                tab.classList.add('active', 'btn-warning');
                
                // Handle tab content switching
                this.switchTab(tab.textContent.trim());
            });
        });
    }

    switchTab(tabName) {
        this.currentTab = tabName.toLowerCase().replace(' ', '-');
        console.log(`Switched to tab: ${tabName}`);
        
        // For tabs other than Leave Settings, show under construction
        if (tabName !== 'Leave Settings') {
            this.showUnderConstruction(tabName);
        }
    }

    // Form functionality
    initializeForm() {
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });

            // Real-time form validation
            this.initializeFormValidation();
        }
    }

    initializeFormValidation() {
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        this.clearFieldError(field);

        // Validation rules
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'number' && value && (value < 1 || value > 365)) {
            isValid = false;
            errorMessage = 'Duration must be between 1 and 365 days';
        } else if (field.id === 'bonusPercentage' && value && (value < 0 || value > 100)) {
            isValid = false;
            errorMessage = 'Percentage must be between 0 and 100';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        // Create or update error message
        let errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    handleFormSubmission() {
        const form = document.querySelector('form');
        const formData = new FormData(form);
        
        // Validate all fields
        const inputs = form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Please fix the errors in the form', 'error');
            return;
        }

        // Collect form data
        const leavePlan = {
            id: Date.now(),
            name: formData.get('leavePlanName') || document.getElementById('leavePlanName').value,
            duration: parseInt(formData.get('duration') || document.getElementById('duration').value),
            recall: formData.get('leaveRecall') || document.getElementById('leaveRecall').value,
            bonus: formData.get('leaveBonus') || document.getElementById('leaveBonus').value,
            bonusPercentage: formData.get('bonusPercentage') || document.getElementById('bonusPercentage').value,
            allocation: formData.get('leaveAllocation') || document.getElementById('leaveAllocation').value,
            recallReason: formData.get('recallReason') || document.getElementById('recallReason').value
        };

        // Add to leave plans
        this.leavePlans.push(leavePlan);
        
        // Update table
        this.loadLeavePlans();
        
        // Reset form
        form.reset();
        document.getElementById('leavePlanName').value = 'Maternity';
        document.getElementById('duration').value = '60';
        document.getElementById('leaveAllocation').value = 'senior';
        
        this.showNotification('Leave plan created successfully!', 'success');
    }

    // Table functionality
    initializeTable() {
        this.loadLeavePlans();
    }

    loadLeavePlans() {
        const tbody = document.querySelector('.table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        this.leavePlans.forEach(plan => {
            const row = this.createTableRow(plan);
            tbody.appendChild(row);
        });
    }

    createTableRow(plan) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${plan.name}</td>
            <td>${plan.duration}</td>
            <td>${plan.recall}/${plan.autorenew}</td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        Actions <i class="bi bi-chevron-down"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item edit-btn" href="#" data-id="${plan.id}">Edit</a></li>
                        <li><a class="dropdown-item delete-btn" href="#" data-id="${plan.id}">Delete</a></li>
                    </ul>
                </div>
            </td>
        `;

        // Add event listeners for edit and delete
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');

        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.editLeavePlan(plan);
        });

        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.deleteLeavePlan(plan.id);
        });

        return row;
    }

    editLeavePlan(plan) {
        // Populate form with plan data
        document.getElementById('leavePlanName').value = plan.name;
        document.getElementById('duration').value = plan.duration;
        document.getElementById('leaveRecall').value = plan.recall === 'Yes' ? 'yes' : 'no';
        document.getElementById('leaveBonus').value = plan.bonus === 'Yes' ? 'yes' : 'no';
        document.getElementById('bonusPercentage').value = plan.bonusPercentage || '';
        document.getElementById('leaveAllocation').value = plan.allocation || 'senior';
        document.getElementById('recallReason').value = plan.recallReason || '';

        // Change form button text
        const submitBtn = document.querySelector('form button[type="submit"]');
        submitBtn.textContent = 'Update';
        submitBtn.dataset.editId = plan.id;

        // Scroll to form
        document.querySelector('.content-panel').scrollIntoView({ behavior: 'smooth' });
    }

    deleteLeavePlan(planId) {
        if (confirm('Are you sure you want to delete this leave plan?')) {
            this.leavePlans = this.leavePlans.filter(plan => plan.id !== planId);
            this.loadLeavePlans();
            this.showNotification('Leave plan deleted successfully!', 'success');
        }
    }

    // Search functionality
    initializeSearch() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                this.performSearch(query);
            });
        }
    }

    performSearch(query) {
        const rows = document.querySelectorAll('.table tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(query)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Notification system
    initializeNotifications() {
        // Initialize notification badges
        this.updateNotificationBadges();
        
        // Add click handlers for notification icons
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            item.addEventListener('click', () => {
                this.showNotification('Notification clicked!', 'info');
            });
        });
    }

    updateNotificationBadges() {
        // You can implement real notification logic here
        const badges = document.querySelectorAll('.notification-badge');
        badges.forEach(badge => {
            badge.textContent = Math.floor(Math.random() * 20) + 1;
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Messages Interface Methods
    showMessagesInterface() {
        this.currentInterface = 'messages';
        this.updatePageTitle('Messages');
        this.renderMessagesInterface();
    }

    showLeaveManagementInterface() {
        this.currentInterface = 'leave-management';
        this.updatePageTitle('Leave Management');
        this.renderLeaveManagementInterface();
    }

    updatePageTitle(title) {
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            const icon = title === 'Messages' ? 'bi-envelope-fill' : 'bi-journal-text';
            pageTitle.innerHTML = `<div class="d-flex justify-content-between align-items-center w-100">
                <span><i class="bi ${icon} me-2"></i>${title}</span>
                ${title === 'Messages' ? `<button class="btn btn-success" id="openSendModalBtn"><i class="bi bi-send me-1"></i>Send</button>` : ''}
            </div>`;
        }
    }

    renderMessagesInterface() {
        const mainContent = document.querySelector('.main-content .container-fluid');
        if (!mainContent) return;

        // Hide navigation tabs
        const navTabs = mainContent.querySelector('.nav-tabs');
        if (navTabs) navTabs.style.display = 'none';

        // Create messages interface as a table (default view)
        const messagesHTML = `
            <div class="row">
                <div class="col-md-12">
                    <div class="content-panel">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h3 class="section-title m-0">Message History (${this.messages.length} messages)</h3>
                            <div class="dropdown">
                                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-download me-1"></i>Export
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li><a class="dropdown-item export-csv" href="#"><i class="bi bi-filetype-csv me-2"></i>Download CSV</a></li>
                                    <li><a class="dropdown-item export-xlsx" href="#"><i class="bi bi-file-earmark-excel me-2"></i>Download Excel</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover" id="messagesTable">
                                <thead>
                                    <tr>
                                        <th>Date/Time</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Subject</th>
                                        <th>Message</th>
                                        <th>Attachments</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${this.messages.map(message => `
                                        <tr data-message-id="${message.id}">
                                            <td>${this.formatDateTime(message.timestamp)}</td>
                                            <td>${this.getContactNameByEmail(message.from)}</td>
                                            <td>${message.to}</td>
                                            <td>${message.subject}</td>
                                            <td>${(message.content || '').toString().slice(0, 80).replace(/\n/g, ' ')}${(message.content || '').length > 80 ? '…' : ''}</td>
                                            <td>${message.attachments && message.attachments.length ? message.attachments.length : 0}</td>
                                            <td>${message.read ? 'Read' : 'Unread'}</td>
                                            <td>
                                                <button class="btn btn-sm btn-outline-danger delete-message-btn" title="Delete message">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        <!-- Send Message Modal -->
                        <div class="modal fade" id="sendMessageModal" tabindex="-1" aria-hidden="true">
                            <div class="modal-dialog modal-lg modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Send Message</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form id="messageForm">
                                            <div class="form-group">
                                                <label for="recipient" class="form-label">To</label>
                                                <input type="email" class="form-control" id="recipient" name="recipient" placeholder="Enter email address" required>
                                            </div>
                                            <div class="form-group">
                                                <label for="subject" class="form-label">Subject</label>
                                                <input type="text" class="form-control" id="subject" name="subject" required>
                                            </div>
                                            <div class="form-group">
                                                <label for="messageContent" class="form-label">Message</label>
                                                <textarea class="form-control" id="messageContent" name="messageContent" rows="6" required></textarea>
                                            </div>
                                            <div class="form-group">
                                                <label for="documentUpload" class="form-label">Attach Document (Optional)</label>
                                                <div class="file-upload-wrapper">
                                                    <input type="file" class="form-control" id="documentUpload" name="documentUpload" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif" multiple>
                                                    <div class="file-info" id="fileInfo"></div>
                                                    <div class="file-preview" id="filePreview"></div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-success" id="sendMessageBtn">Send</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;

        // Replace content after the page title
        const pageTitleRow = mainContent.querySelector('.row:first-child');
        if (pageTitleRow) {
            // Remove existing content after page title
            const existingContent = mainContent.querySelectorAll('.row:not(:first-child)');
            existingContent.forEach(row => row.remove());
            
            // Add messages interface
            pageTitleRow.insertAdjacentHTML('afterend', messagesHTML);
            
            // Initialize table functionality
            this.initializeMessagesTableFunctionality();
        }
    }

    renderLeaveManagementInterface() {
        const mainContent = document.querySelector('.main-content .container-fluid');
        if (!mainContent) return;

        // Show navigation tabs
        const navTabs = mainContent.querySelector('.nav-tabs');
        if (navTabs) navTabs.style.display = 'flex';

        // Remove messages interface and restore original content
        const existingContent = mainContent.querySelectorAll('.row:not(:first-child)');
        existingContent.forEach(row => row.remove());

        // Add back the original leave management content
        const pageTitleRow = mainContent.querySelector('.row:first-child');
        if (pageTitleRow) {
            const originalContent = `
                <!-- Navigation Tabs -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="nav-tabs">
                            <button class="btn btn-warning active">Leave Settings</button>
                            <button class="btn btn-primary">Leave Recall</button>
                            <button class="btn btn-primary">Leave History</button>
                            <button class="btn btn-primary">Relief Officers</button>
                        </div>
                    </div>
                </div>

                <!-- Content Panels -->
                <div class="row">
                    <!-- Left Panel: Create Leave Settings -->
                    <div class="col-md-6">
                        <div class="content-panel">
                            <h2 class="panel-title">Create Leave Settings</h2>
                            <form>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="leavePlanName" class="form-label">Leave Plan Name</label>
                                            <input type="text" class="form-control" id="leavePlanName" name="leavePlanName" value="Maternity">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="duration" class="form-label">Duration (days)</label>
                                            <input type="number" class="form-control" id="duration" name="duration" value="60" min="1">
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="leaveRecall" class="form-label">Do you want to activate Leave Recall for this plan ?</label>
                                    <select class="form-select" id="leaveRecall" name="leaveRecall">
                                        <option selected>Select option from dropdown</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="leaveBonus" class="form-label">Would you like to activate leave bonus</label>
                                            <select class="form-select" id="leaveBonus" name="leaveBonus">
                                                <option selected>Select option from dropdown</option>
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="bonusPercentage" class="form-label">How much percentage of leave bonus?</label>
                                            <input type="text" class="form-control" id="bonusPercentage" name="bonusPercentage" placeholder="Percentage (%)">
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="leaveAllocation" class="form-label">Select Leave Allocation</label>
                                    <select class="form-select" id="leaveAllocation" name="leaveAllocation">
                                        <option value="senior" selected>Senior Level</option>
                                        <option value="junior">Junior Level</option>
                                        <option value="entry">Entry Level</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="recallReason" class="form-label">Reason for Recall</label>
                                    <textarea class="form-control" id="recallReason" name="recallReason" rows="3" placeholder="Enter reason for recall..."></textarea>
                                </div>
                                <button type="submit" class="btn btn-success w-100">Create</button>
                            </form>
                        </div>
                    </div>

                    <!-- Right Panel: Manage Leave Settings -->
                    <div class="col-md-6">
                        <div class="content-panel">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h2 class="panel-title mb-0">Manage Leave Settings</h2>
                                <button class="btn btn-link text-dark">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </button>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Leave Plan</th>
                                            <th>Duration(s)</th>
                                            <th>Recall /Autorenew</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            pageTitleRow.insertAdjacentHTML('afterend', originalContent);
            
            // Reinitialize leave management functionality
            this.initializeTabs();
            this.initializeForm();
            this.initializeTable();
            this.loadLeavePlans();
        }
    }

    initializeMessagesFunctionality() {
        // Initialize message tabs
        const composeTab = document.getElementById('composeTab');
        const historyTab = document.getElementById('historyTab');
        const composeSection = document.getElementById('composeSection');
        const historySection = document.getElementById('historySection');

        if (composeTab && historyTab) {
            composeTab.addEventListener('click', () => {
                composeTab.classList.remove('btn-primary');
                composeTab.classList.add('btn-warning', 'active');
                historyTab.classList.remove('btn-warning', 'active');
                historyTab.classList.add('btn-primary');
                composeSection.style.display = 'block';
                historySection.style.display = 'none';
            });

            historyTab.addEventListener('click', () => {
                historyTab.classList.remove('btn-primary');
                historyTab.classList.add('btn-warning', 'active');
                composeTab.classList.remove('btn-warning', 'active');
                composeTab.classList.add('btn-primary');
                historySection.style.display = 'block';
                composeSection.style.display = 'none';
            });
        }

        // Initialize message form
        const messageForm = document.getElementById('messageForm');
        if (messageForm) {
            messageForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }

        // Initialize message interactions
        this.initializeMessageInteractions();
        
        // Initialize file upload functionality
        this.initializeFileUpload();




    }

    initializeMessagesTableFunctionality() {
        // Also wire Send button rendered in the title for Messages
        const openSendBtnTop = document.getElementById('openSendModalBtn');
        if (openSendBtnTop && typeof bootstrap !== 'undefined') {
            openSendBtnTop.addEventListener('click', () => {
                const modalEl = document.getElementById('sendMessageModal');
                if (!modalEl) return;
                const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                modal.show();
                this.initializeFileUpload();
            });
        }
        // Export CSV
        const exportCsvLink = document.querySelector('.export-csv');
        if (exportCsvLink) {
            exportCsvLink.addEventListener('click', (e) => {
                e.preventDefault();
                const csv = this.generateMessagesCsv();
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const date = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
                link.download = `messages-${date}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            });
        }

        // Export Excel (XLSX)
        const exportXlsxLink = document.querySelector('.export-xlsx');
        if (exportXlsxLink && typeof XLSX !== 'undefined') {
            exportXlsxLink.addEventListener('click', (e) => {
                e.preventDefault();
                const data = this.messages.map(m => ({
                    DateTime: this.formatDateTime(m.timestamp),
                    From: this.getContactNameByEmail(m.from),
                    To: m.to,
                    Subject: m.subject,
                    Message: (m.content || '').toString(),
                    Attachments: (m.attachments && m.attachments.length) ? m.attachments.length : 0,
                    Status: m.read ? 'Read' : 'Unread'
                }));
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Messages');
                const date = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
                XLSX.writeFile(wb, `messages-${date}.xlsx`);
            });
        }

        // Delete in table
        const table = document.getElementById('messagesTable');
        if (table) {
            table.addEventListener('click', (e) => {
                const btn = e.target.closest('.delete-message-btn');
                if (!btn) return;
                const tr = e.target.closest('tr');
                const id = parseInt(tr?.dataset.messageId);
                if (!id) return;
                if (confirm('Are you sure you want to delete this message?')) {
                    this.deleteMessage(id);
                }
            });
        }

        // Open Send modal
        const openSendBtn = document.getElementById('openSendModalBtn');
        if (openSendBtn && typeof bootstrap !== 'undefined') {
            openSendBtn.addEventListener('click', () => {
                const modalEl = document.getElementById('sendMessageModal');
                if (!modalEl) return;
                const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                modal.show();
                // Reset previous file previews
                const fileInput = document.getElementById('documentUpload');
                if (fileInput) fileInput.value = '';
                const fileInfo = document.getElementById('fileInfo');
                const filePreview = document.getElementById('filePreview');
                if (fileInfo) fileInfo.innerHTML = '';
                if (filePreview) filePreview.innerHTML = '';
                // Init upload interactions
                this.initializeFileUpload();
            });
        }

        // Send from modal
        const sendBtn = document.getElementById('sendMessageBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
                const modalEl = document.getElementById('sendMessageModal');
                if (modalEl && typeof bootstrap !== 'undefined') {
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    if (modal) modal.hide();
                }
                // Re-render table to reflect new message
                this.renderMessagesInterface();
            });
        }
    }

    generateMessagesCsv() {
        const headers = [
            'Date/Time','From','To','Subject','Message','Attachments','Status'
        ];
        const escape = (val) => {
            const str = (val ?? '').toString().replace(/\r?\n/g, ' ');
            if (str.includes(',') || str.includes('"')) {
                return '"' + str.replace(/"/g, '""') + '"';
            }
            return str;
        };
        const rows = this.messages.map(m => [
            this.formatDateTime(m.timestamp),
            this.getContactNameByEmail(m.from),
            m.to,
            m.subject,
            (m.content || '').toString(),
            (m.attachments && m.attachments.length) ? m.attachments.length : 0,
            m.read ? 'Read' : 'Unread'
        ].map(escape).join(','));
        return [headers.join(','), ...rows].join('\n');
    }

    sendMessage() {
        const form = document.getElementById('messageForm');
        const formData = new FormData(form);
        
        const recipient = formData.get('recipient');
        const subject = formData.get('subject');
        const content = formData.get('messageContent');
        const fileInput = document.getElementById('documentUpload');
        const files = fileInput.files;

        if (!recipient || !subject || !content) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Show sending notification
        this.showNotification('Sending email...', 'info');

        // Create new message with file attachments
        const newMessage = {
            id: Date.now(),
            from: 'chandra.sekhar@company.com',
            to: recipient,
            subject: subject,
            content: content,
            timestamp: new Date(),
            read: true,
            attachments: this.processFileAttachments(files)
        };

        // Send email using Resend via serverless function
        this.sendEmailViaResend(recipient, subject, content, newMessage, files);
    }

    async sendEmailViaResend(recipient, subject, content, newMessage, files) {
        try {
            // convert files to base64 for attachments
            const attachments = files ? await this.convertFilesToBase64ForResend(files) : [];

            const payload = {
                to: recipient,
                subject,
                text: content,
                html: this.createHtmlEmailContent(content),
                attachments: attachments.map(f => ({
                    filename: f.name,
                    contentBase64: f.base64,
                    contentType: f.type
                }))
            };

            const resp = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await resp.json();
            if (!resp.ok || !data.ok) {
                throw new Error(data?.error || 'Failed');
            }

            // success
            this.messages.unshift(newMessage);
            this.saveMessagesToStorage();
            const form = document.getElementById('messageForm');
            if (form) form.reset();
            this.showNotification('Email sent successfully!', 'success');
            this.renderMessagesInterface();
        } catch (error) {
            console.error('Resend send error:', error);
            this.showNotification(`Failed to send email: ${error.message}`, 'error');
        }
    }

    async convertFilesToBase64ForResend(files) {
        const out = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const base64 = await this.fileToBase64(file);
            out.push({ name: file.name, type: file.type, base64 });
        }
        return out;
    }

    simulateEmailSending(recipient, subject, content) {
        // Simulate email sending process
        console.log('Sending email...');
        console.log('To:', recipient);
        console.log('Subject:', subject);
        console.log('Content:', content);
        
        // In a real application, this would integrate with an email service
        // For demo purposes, we'll just log the email details
        setTimeout(() => {
            console.log('Email sent successfully to:', recipient);
        }, 1000);
    }

    getContactNameByEmail(email) {
        const contact = this.contacts.find(c => c.email === email);
        return contact ? contact.name : email;
    }



    formatDateTime(date) {
        return new Date(date).toLocaleString();
    }



    // Utility methods
    formatDate(date) {
        return new Date(date).toLocaleDateString();
    }

    generateId() {
        return Date.now() + Math.random();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Bootstrap tooltips and popovers
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }

    // Initialize the dashboard
    window.leaveDashboard = new LeaveManagementDashboard();
    
    console.log('Leave Management Dashboard initialized successfully!');
});

// Global utility functions
window.showNotification = (message, type) => {
    if (window.leaveDashboard) {
        window.leaveDashboard.showNotification(message, type);
    }
};

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeaveManagementDashboard;
}
