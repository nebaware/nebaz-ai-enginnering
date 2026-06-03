/**
 * Nebaz AI Academy — AI Tutor Chat Widget
 * Floating chat interface for context-aware tutoring.
 * Falls back to offline keyword-based answers when server is unreachable.
 */

class AITutorWidget {
    constructor() {
        const cfg = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {};
        this.aiTier = cfg.aiTier || 'offline';
        this.API_URL = cfg.aiTier === 'ollama' ? (cfg.ollamaURL || 'http://localhost:11434') : 'http://localhost:8888';
        this.isOpen = false;
        this.chatHistory = [];
        this.dailyLimit = 50;
        this.storageKey = (cfg.storageKeys && cfg.storageKeys.tutor) || 'nebaz_tutor_requests';
        this.offlineMode = this.aiTier === 'offline';
        this.init();
    }
    
    init() {
        // Only initialize on tutorial pages
        if (!this.isTutorialPage()) {
            return;
        }
        
        this.injectHTML();
        this.attachEventListeners();
        this.checkDailyLimit();
    }
    
    isTutorialPage() {
        // Appear on all pages
        return true;
    }
    
    injectHTML() {
        const html = `
            <!-- AI Tutor Widget -->
            <div id="aitutor-widget">
                <!-- Backdrop for mobile -->
                <div id="aitutor-backdrop" class="aitutor-backdrop"></div>
                
                <!-- Floating Button -->
                <button id="aitutor-button" class="aitutor-fab" title="Ask AITutor" aria-label="Open AI Tutor Chat">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="white"/>
                        <circle cx="9" cy="11" r="1.5" fill="white"/>
                        <circle cx="15" cy="11" r="1.5" fill="white"/>
                        <path d="M12 17.5C14.33 17.5 16.32 16.04 17.11 14H6.89C7.68 16.04 9.67 17.5 12 17.5Z" fill="white"/>
                    </svg>
                    <span>Ask AITutor</span>
                </button>
                
                <!-- Chat Panel -->
                <div id="aitutor-panel" class="aitutor-panel aitutor-hidden">
                    <!-- Header -->
                    <div class="aitutor-header">
                        <div class="aitutor-header-content">
                            <div class="aitutor-avatar">🎓</div>
                            <div>
                                <h3>Nebaz AI Tutor</h3>
                                <p class="aitutor-status" id="aitutor-status-text">Connecting…</p>
                            </div>
                        </div>
                        <button id="aitutor-close" class="aitutor-close-btn" title="Close">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Messages -->
                    <div id="aitutor-messages" class="aitutor-messages">
                        <div class="aitutor-message aitutor-bot">
                            <div class="aitutor-message-content">
                                <p>👋 Selam! I'm Nebaz AI Tutor — your AI learning assistant.</p>
                                <p>Ask me anything about this tutorial and I'll explain it in simple terms! 🎯</p>
                                <div class="aitutor-suggestions">
                                    <p style="font-size: 0.85rem; color: #64748b; margin: 0.75rem 0 0.5rem 0;">Try asking:</p>
                                    <button class="aitutor-suggestion-btn">Explain this topic simply</button>
                                    <button class="aitutor-suggestion-btn">Can you give me an example?</button>
                                    <button class="aitutor-suggestion-btn">What are the key concepts?</button>
                                    <button class="aitutor-suggestion-btn">How is this used in Ethiopia?</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Input -->
                    <div class="aitutor-input-container">
                        <div id="aitutor-limit-warning" class="aitutor-warning aitutor-hidden">
                            ⚠️ Daily limit reached (20 questions). Try again tomorrow!
                        </div>
                        <textarea 
                            id="aitutor-input" 
                            class="aitutor-input" 
                            placeholder="Ask a question about this tutorial..."
                            rows="2"
                            maxlength="500"
                        ></textarea>
                        <button id="aitutor-send" class="aitutor-send-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
    }
    
    attachEventListeners() {
        const button = document.getElementById('aitutor-button');
        const closeBtn = document.getElementById('aitutor-close');
        const sendBtn = document.getElementById('aitutor-send');
        const input = document.getElementById('aitutor-input');
        const backdrop = document.getElementById('aitutor-backdrop');
        
        button.addEventListener('click', () => this.togglePanel());
        closeBtn.addEventListener('click', () => this.togglePanel());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Close on backdrop click (mobile)
        backdrop.addEventListener('click', () => this.togglePanel());
        
        // Send on Enter (Shift+Enter for new line)
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.togglePanel();
            }
        });
        
        // Handle suggestion button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('aitutor-suggestion-btn')) {
                const input = document.getElementById('aitutor-input');
                input.value = e.target.textContent;
                input.focus();
                // Optionally auto-send
                this.sendMessage();
            }
        });
    }
    
    togglePanel() {
        const panel = document.getElementById('aitutor-panel');
        const button = document.getElementById('aitutor-button');
        const backdrop = document.getElementById('aitutor-backdrop');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            panel.classList.remove('aitutor-hidden');
            button.classList.add('aitutor-hidden');
            backdrop.classList.add('aitutor-visible');
            document.getElementById('aitutor-input').focus();
            
            // Prevent body scroll on mobile when chat is open
            if (window.innerWidth <= 768) {
                document.body.style.overflow = 'hidden';
            }
        } else {
            panel.classList.add('aitutor-hidden');
            button.classList.remove('aitutor-hidden');
            backdrop.classList.remove('aitutor-visible');
            
            // Re-enable body scroll
            document.body.style.overflow = '';
        }
    }
    
    checkDailyLimit() {
        const today = new Date().toDateString();
        const data = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        
        if (data.date !== today) {
            // Reset counter for new day
            data.date = today;
            data.count = 0;
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        }
        
        return data.count < this.dailyLimit;
    }
    
    incrementRequestCount() {
        const today = new Date().toDateString();
        const data = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        
        data.date = today;
        data.count = (data.count || 0) + 1;
        
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        
        return data.count;
    }
    
    getRemainingRequests() {
        const today = new Date().toDateString();
        const data = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        
        if (data.date !== today) {
            return this.dailyLimit;
        }
        
        return Math.max(0, this.dailyLimit - (data.count || 0));
    }
    
    extractPageContext() {
        // Extract relevant context from current tutorial page
        const context = {
            course: '',
            topic: '',
            headings: [],
            keyPoints: []
        };
        
        // Get course from URL
        const pathParts = window.location.pathname.split('/');
        const categoryIndex = pathParts.indexOf('tutorials') + 1;
        if (categoryIndex > 0 && categoryIndex < pathParts.length) {
            context.course = pathParts[categoryIndex].replace(/-/g, ' ');
        }
        
        // Get topic from page title or h1
        const h1 = document.querySelector('h1');
        if (h1) {
            context.topic = h1.textContent.trim();
        } else {
            context.topic = document.title.split('|')[0].trim();
        }
        
        // Get main headings (h2 only, limited to first 5)
        const headings = Array.from(document.querySelectorAll('h2'))
            .slice(0, 5)
            .map(h => h.textContent.trim());
        context.headings = headings;
        
        // Get key points from info boxes (if any)
        const infoBoxes = Array.from(document.querySelectorAll('.info-box, .success-box'))
            .slice(0, 3)
            .map(box => box.textContent.trim().substring(0, 100));
        context.keyPoints = infoBoxes;
        
        // Format as string
        let contextStr = `Course: ${context.course}\n`;
        contextStr += `Topic: ${context.topic}\n`;
        
        if (context.headings.length > 0) {
            contextStr += `\nMain Sections:\n${context.headings.map(h => `- ${h}`).join('\n')}`;
        }
        
        if (context.keyPoints.length > 0) {
            contextStr += `\n\nKey Points:\n${context.keyPoints.map(p => `- ${p}...`).join('\n')}`;
        }
        
        return contextStr.substring(0, 1000); // Limit context size
    }
    
    // ─── Offline Knowledge Base ───────────────────────────────────────────────
    buildOfflineAnswer(question, pageContext) {
        const q = question.toLowerCase();

        // Extract all text paragraphs and code from the page
        const paragraphs = Array.from(document.querySelectorAll('.tutorial-content p, .tutorial-content li'))
            .map(el => el.textContent.trim()).filter(t => t.length > 30);
        const codeBlocks = Array.from(document.querySelectorAll('pre code'))
            .slice(0, 2).map(el => el.textContent.trim().slice(0, 300));
        const headings = Array.from(document.querySelectorAll('h2, h3'))
            .map(el => el.textContent.trim());

        // Keyword → section matching
        const keywords = ['variable', 'function', 'loop', 'list', 'dict', 'class', 'import',
                          'array', 'string', 'integer', 'boolean', 'if', 'else', 'for', 'while',
                          'machine learning', 'neural', 'model', 'training', 'data', 'algorithm',
                          'python', 'numpy', 'pandas', 'tensorflow', 'pytorch', 'llm', 'transformer',
                          'attention', 'gradient', 'loss', 'epoch', 'batch', 'overfitting'];

        const matched = keywords.filter(k => q.includes(k));
        const relevantParas = paragraphs.filter(p =>
            matched.some(k => p.toLowerCase().includes(k))
        ).slice(0, 3);

        // Ethiopian context tips
        const ethiopianTips = {
            python: 'In Ethiopia, Python is widely used at institutions like Addis Ababa University (AAU) and at the ICT Park. It powers Telebirr integrations, agricultural data analysis, and fintech apps like Chapa.',
            'machine learning': 'Ethiopian organizations use ML for coffee quality grading, crop disease detection (partnering with MinT), and credit scoring for microfinance institutions.',
            llm: 'LLMs are being integrated into Amharic language processing at AAU\'s NLP Lab. Models like Llama can be fine-tuned on Amharic and Tigrinya corpora.',
            data: 'Ethiopia\'s Central Statistical Agency (CSA) and the Ethiopian Economics Association publish datasets useful for ML practice projects.',
        };
        const ethTip = Object.entries(ethiopianTips).find(([k]) => q.includes(k));

        let answer = '';

        if (q.includes('example') || q.includes('code') || q.includes('show me')) {
            if (codeBlocks.length > 0) {
                answer = `Here's an example from this tutorial:\n\n\`\`\`\n${codeBlocks[0]}\n\`\`\``;
            } else {
                answer = 'I couldn\'t find a code example on this page, but try checking the code sections above.';
            }
        } else if (q.includes('summary') || q.includes('cover') || q.includes('topic') || q.includes('teach')) {
            const sections = headings.slice(0, 5).map(h => `• ${h}`).join('\n');
            answer = `This tutorial covers:\n\n${sections || 'See the headings on this page for the main sections.'}\n\n${relevantParas[0] || ''}`;
        } else if (relevantParas.length > 0) {
            answer = relevantParas.join('\n\n');
        } else {
            answer = `I searched this tutorial for "${question}" but couldn't find a direct match. Try scrolling through the sections above, or rephrase your question.`;
        }

        if (ethTip) {
            answer += `\n\n🇪🇹 **Ethiopian context:** ${ethTip[1]}`;
        }

        answer += '\n\n_📴 Offline mode — connect to the internet for full AI answers._';
        return answer;
    }

    async sendMessage() {
        const input = document.getElementById('aitutor-input');
        const question = input.value.trim();
        if (!question) return;

        if (!this.checkDailyLimit()) {
            document.getElementById('aitutor-limit-warning').classList.remove('aitutor-hidden');
            return;
        }

        input.value = '';
        this.addMessage(question, 'user');
        const loadingId = this.addMessage('Thinking…', 'bot', true);

        const context = this.extractPageContext();

        if (this.aiTier === 'ollama') {
            try {
                const response = await fetch(`${this.API_URL}/api/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'llama3.2',
                        messages: [
                            { role: 'system', content: `You are a tutor for Nebaz AI Academy. Context:\n${context}` },
                            { role: 'user', content: question }
                        ],
                        stream: false
                    })
                });
                if (!response.ok) throw new Error('Ollama error');
                const data = await response.json();
                const answer = data.message?.content || data.response || 'No response';
                this.removeMessage(loadingId);
                this.addMessage(answer, 'bot');
                this.incrementRequestCount();
                this.updateStatus('Ollama • Connected');
                return;
            } catch (err) {
                console.warn('Ollama unreachable:', err.message);
                this.updateStatus('📴 Offline helper (Ollama unavailable)');
            }
        }

        if (this.aiTier === 'cloud') {
            try {
                const api = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG.aiTeacherAPI : '/api/ai-teacher';
                const response = await fetch(api, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question, context })
                });
                if (!response.ok) throw new Error('API error');
                const data = await response.json();
                this.removeMessage(loadingId);
                this.addMessage(data.answer, 'bot');
                this.incrementRequestCount();
                return;
            } catch (err) {
                console.warn('Cloud AI tutor error:', err.message);
            }
        }

        // ── Try legacy local server ──────────────────────────────────────────
        if (!this.offlineMode && this.aiTier !== 'offline') {
            try {
                const ctrl = new AbortController();
                setTimeout(() => ctrl.abort(), 5000);
                const response = await fetch(`http://localhost:8888/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question, context }),
                    signal: ctrl.signal
                });
                if (!response.ok) throw new Error('Server error');
                const data = await response.json();
                this.removeMessage(loadingId);
                this.addMessage(data.answer, 'bot');
                this.incrementRequestCount();
                this.updateStatus('Online • Ready to help');
                return;
            } catch (err) {
                console.warn('AI Tutor server unreachable:', err.message);
                this.offlineMode = true;
                this.updateStatus('📴 Offline helper mode');
            }
        }

        // ── Offline fallback ─────────────────────────────────────────────────
        await new Promise(r => setTimeout(r, 600)); // brief "thinking" delay
        this.removeMessage(loadingId);
        const offlineAnswer = this.buildOfflineAnswer(question, context);
        this.addMessage(offlineAnswer, 'bot');
        this.incrementRequestCount();
    }
    
    addMessage(text, sender, isLoading = false, isError = false) {
        const messagesContainer = document.getElementById('aitutor-messages');
        const messageId = `msg-${Date.now()}`;
        
        const messageDiv = document.createElement('div');
        messageDiv.id = messageId;
        messageDiv.className = `aitutor-message aitutor-${sender}`;
        
        if (isLoading) {
            messageDiv.innerHTML = `
                <div class="aitutor-message-content aitutor-loading">
                    <span class="aitutor-loading-dots">
                        <span>.</span><span>.</span><span>.</span>
                    </span>
                    ${text}
                </div>
            `;
        } else if (isError) {
            messageDiv.innerHTML = `
                <div class="aitutor-message-content aitutor-error">
                    <p>⚠️ ${text}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="aitutor-message-content">
                    ${this.formatMessage(text)}
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        return messageId;
    }
    
    removeMessage(messageId) {
        const message = document.getElementById(messageId);
        if (message) {
            message.remove();
        }
    }
    
    formatMessage(text) {
        // Simple markdown-like formatting
        // Bold: **text**
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic: *text*
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Code: `code`
        text = text.replace(/`(.*?)`/g, '<code>$1</code>');
        
        // Line breaks
        text = text.replace(/\n/g, '<br>');
        
        return `<p>${text}</p>`;
    }
    
    updateStatus(text) {
        const status = document.getElementById('aitutor-status-text') || document.querySelector('.aitutor-status');
        if (status) status.textContent = text;
    }
}

// Initialize widget when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AITutorWidget();
    });
} else {
    new AITutorWidget();
}
