// Messaging system functionality
class MessagingManager {
    constructor() {
        this.data = null;
        this.currentConversation = null;
        this.initEventListeners();
    }

    setData(data) {
        this.data = data;
    }

    initEventListeners() {
        // New message form submission
        const newMessageForm = document.getElementById('newMessageForm');
        if (newMessageForm) {
            newMessageForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendNewMessage();
            });
        }

        // Send message button
        const sendMessageBtn = document.getElementById('sendMessageBtn');
        if (sendMessageBtn) {
            sendMessageBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        // Enter key for sending messages
        const messageText = document.getElementById('messageText');
        if (messageText) {
            messageText.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    loadMessages() {
        if (!this.data) return;

        this.loadMessagesList();
        this.loadTeachers();
    }

    loadMessagesList() {
        const container = document.getElementById('messagesList');
        if (!container || !this.data) return;

        container.innerHTML = '';

        this.data.conversations.forEach(conversation => {
            const conversationDiv = document.createElement('div');
            conversationDiv.className = `p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${this.currentConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''}`;
            conversationDiv.onclick = () => this.selectConversation(conversation.id);
            
            const lastMessage = conversation.messages[conversation.messages.length - 1];
            const unreadCount = conversation.messages.filter(msg => !msg.read && msg.sender !== 'parent').length;
            
            conversationDiv.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium text-gray-800 text-sm">${conversation.name}</h4>
                    ${unreadCount > 0 ? `<span class="bg-blue-500 text-white text-xs rounded-full px-2 py-1">${unreadCount}</span>` : ''}
                </div>
                <p class="text-xs text-gray-600 mb-1">${conversation.subject}</p>
                <p class="text-xs text-gray-500 truncate">${lastMessage.text}</p>
                <p class="text-xs text-gray-400 mt-1">${lastMessage.time}</p
`;

            container.appendChild(conversationDiv);
        });
    }

    loadTeachers() {
        const recipientSelect = document.getElementById('recipientSelect');
        if (!recipientSelect || !this.data) return;

        recipientSelect.innerHTML = '<option value="">اختر المستقبل</option>';
        
        this.data.teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher.id;
            option.textContent = `${teacher.name} - ${teacher.subject}`;
            recipientSelect.appendChild(option);
        });
    }

    selectConversation(conversationId) {
        this.currentConversation = conversationId;
        
        // Update UI
        this.loadMessagesList(); // Refresh to show selection
        this.loadConversationMessages(conversationId);
        
        // Show message input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.classList.remove('hidden');
        }
    }

    loadConversationMessages(conversationId) {
        const conversation = this.data.conversations.find(c => c.id === conversationId);
        if (!conversation) return;

        // Update header
        const messageHeader = document.getElementById('messageHeader');
        if (messageHeader) {
            messageHeader.innerHTML = `
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-gray-600 text-sm"></i>
                    </div>
                    <div class="mr-3">
                        <h3 class="font-medium text-gray-800">${conversation.name}</h3>
                        <p class="text-sm text-gray-600">${conversation.subject}</p>
                    </div>
                </div>
            `;
        }

        // Load messages
        const messageContent = document.getElementById('messageContent');
        if (messageContent) {
            messageContent.innerHTML = '';

            conversation.messages.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `mb-4 ${message.sender === 'parent' ? 'text-left' : 'text-right'}`;
                
                messageDiv.innerHTML = `
                    <div class="${message.sender === 'parent' ? 'message-sent' : 'message-received'} inline-block">
                        <p class="text-sm">${message.text}</p>
                        <p class="text-xs opacity-75 mt-1">${message.time}</p>
                    </div>
                `;

                messageContent.appendChild(messageDiv);
            });

            // Scroll to bottom
            messageContent.scrollTop = messageContent.scrollHeight;
        }
    }

    sendMessage() {
        const messageText = document.getElementById('messageText');
        if (!messageText || !messageText.value.trim() || !this.currentConversation) return;

        const text = messageText.value.trim();
        const now = new Date();
        const timeString = now.toLocaleTimeString('ar-SA', { hour12: true, hour: '2-digit', minute: '2-digit' });

        // Find conversation and add message
        const conversation = this.data.conversations.find(c => c.id === this.currentConversation);
        if (conversation) {
            conversation.messages.push({
                id: Date.now().toString(),
                sender: 'parent',
                text: text,
                time: timeString,
                read: true
            });

            // Reload conversation
            this.loadConversationMessages(this.currentConversation);
            this.loadMessagesList(); // Refresh list to update last message
        }

        // Clear input
        messageText.value = '';
    }

    sendNewMessage() {
        const recipientSelect = document.getElementById('recipientSelect');
        const messageSubject = document.getElementById('messageSubject');
        const messageBody = document.getElementById('messageBody');

        if (!recipientSelect.value || !messageSubject.value.trim() || !messageBody.value.trim()) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        // Find teacher
        const teacher = this.data.teachers.find(t => t.id === recipientSelect.value);
        if (!teacher) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString('ar-SA', { hour12: true, hour: '2-digit', minute: '2-digit' });

        // Create new conversation
        const newConversation = {
            id: Date.now().toString(),
            name: teacher.name,
            subject: messageSubject.value.trim(),
            messages: [{
                id: Date.now().toString(),
                sender: 'parent',
                text: messageBody.value.trim(),
                time: timeString,
                read: true
            }]
        };

        // Add to conversations
        this.data.conversations.unshift(newConversation);

        // Close modal
        window.app.hideNewMessageModal();

        // Select the new conversation
        this.selectConversation(newConversation.id);
        this.loadMessagesList();

        // Show success message
        window.app.showSuccess('تم إرسال الرسالة بنجاح');
    }
}

// Initialize messaging manager
window.messagingManager = new MessagingManager();
