// ===================================
// Dark Mode - Initialize IMMEDIATELY (before DOM loads)
// ===================================
(function() {
    const savedTheme = localStorage.getItem('nebaz_theme') || localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

// ===================================
// Navigation & Hamburger Menu
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger Menu Toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ===================================
    // Sticky Navigation on Scroll
    // ===================================
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow when scrolled
        if (navbar && currentScroll > 0) {
            navbar.classList.add('scrolled');
        } else if (navbar) {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // ===================================
    // Smooth Scrolling for Anchor Links
    // ===================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href has been changed to an external URL
            if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/')) {
                return; // Let the browser handle it normally
            }
            
            // Only handle anchors that point to actual IDs (not just "#")
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===================================
    // Active Navigation Link Highlighting
    // ===================================
    
    function updateActiveNavLink() {
        if (!navbar) return; // Skip if navbar doesn't exist
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + navbar.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // ===================================
    // Fade-in Animation on Scroll
    // ===================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards and sections
    const elementsToObserve = document.querySelectorAll('.tutorial-card, .topic-card, .stat-card');
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });

    // ===================================
    // Handle Window Resize
    // ===================================
    
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Reset menu state on desktop view
            if (window.innerWidth > 768 && hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 250);
    });

    // ===================================
    // Page Load Animation
    // ===================================
    
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // ===================================
    // Button Click Effects
    // ===================================
    
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // ===================================
    // Console Welcome Message
    // ===================================
    
    console.log('%c👋 Welcome to Nebaz AI Academy!', 'color: #0891b2; font-size: 20px; font-weight: bold;');
    console.log('%cLearn AI, Machine Learning, and Python with step-by-step tutorials.', 'color: #475569; font-size: 14px;');
    console.log('%cInterested in the code? Check out the source!', 'color: #0d9488; font-size: 14px;');

    // ===================================
    // Copy Code Button Functionality
    // ===================================
    
    // Add copy button to all code blocks
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(codeBlock => {
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-btn';
        copyButton.innerHTML = `
            <svg class="copy-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span class="copy-text">Copy</span>
        `;
        
        // Make the pre element position relative
        codeBlock.style.position = 'relative';
        codeBlock.appendChild(copyButton);
        
        // Copy functionality
        copyButton.addEventListener('click', async () => {
            const code = codeBlock.querySelector('code');
            const text = code ? code.textContent : codeBlock.textContent;
            
            try {
                await navigator.clipboard.writeText(text);
                
                // Visual feedback
                copyButton.innerHTML = `
                    <svg class="copy-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span class="copy-text">Copied!</span>
                `;
                copyButton.classList.add('copied');
                
                // Reset after 2 seconds
                setTimeout(() => {
                    copyButton.innerHTML = `
                        <svg class="copy-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span class="copy-text">Copy</span>
                    `;
                    copyButton.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code:', err);
                copyButton.innerHTML = '<span class="copy-text">Failed</span>';
                setTimeout(() => {
                    copyButton.innerHTML = `
                        <svg class="copy-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span class="copy-text">Copy</span>
                    `;
                }, 2000);
            }
        });
    });

    // ===================================
    // Copy Prompt Functionality
    // ===================================
    
    // Add copy button to all .prompt-example blocks
    const promptExamples = document.querySelectorAll('.prompt-example');
    promptExamples.forEach(promptBlock => {
        // Create copy button
        const copyPromptButton = document.createElement('button');
        copyPromptButton.className = 'copy-prompt-btn';
        copyPromptButton.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy</span>
        `;
        
        // Make the prompt block position relative
        promptBlock.style.position = 'relative';
        promptBlock.style.paddingTop = '2.5rem'; // Add padding to prevent text obstruction
        promptBlock.appendChild(copyPromptButton);
        
        // Copy functionality
        copyPromptButton.addEventListener('click', async () => {
            // Get text content, clean up formatting
            let text = promptBlock.textContent;
            // Remove the button text itself
            text = text.replace(/Copy|Copied!|✓/g, '').trim();
            
            try {
                await navigator.clipboard.writeText(text);
                
                // Visual feedback
                copyPromptButton.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Copied!</span>
                `;
                copyPromptButton.classList.add('copied');
                
                // Reset after 2 seconds
                setTimeout(() => {
                    copyPromptButton.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span>Copy</span>
                    `;
                    copyPromptButton.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy prompt:', err);
                copyPromptButton.innerHTML = '<span>Failed</span>';
                setTimeout(() => {
                    copyPromptButton.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span>Copy</span>
                    `;
                }, 2000);
            }
        });
    });

    // ===================================
    // Dark Mode Toggle Functionality
    // ===================================
    
    // Create dark mode toggle button in navbar
    const navContainer = document.querySelector('.nav-container');
    const navigationMenu = document.getElementById('navMenu');
    if (navContainer && navigationMenu) {
        const darkModeToggle = document.createElement('button');
        darkModeToggle.className = 'dark-mode-toggle';
        darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
        darkModeToggle.innerHTML = `
            <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        `;
        
        // Add as last item in nav menu (after AI Agents)
        navigationMenu.appendChild(darkModeToggle);
        
        // Toggle dark mode
        darkModeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('nebaz_theme', newTheme);
        });
    }

    // ===================================
    // Interactive Quiz Functionality
    // ===================================
    
    // Initialize all quizzes on the page
    const quizContainers = document.querySelectorAll('.quiz-container');
    quizContainers.forEach(quizContainer => {
        const questions = quizContainer.querySelectorAll('.quiz-question');
        let correctAnswers = 0;
        let totalQuestions = questions.length;
        
        questions.forEach((question, questionIndex) => {
            const options = question.querySelectorAll('.quiz-option');
            const feedback = question.querySelector('.quiz-feedback');
            
            options.forEach(option => {
                option.addEventListener('click', () => {
                    // Prevent multiple selections
                    if (question.classList.contains('answered')) return;
                    
                    // Mark as answered
                    question.classList.add('answered');
                    
                    // Check if correct - support both old and new quiz formats
                    let isCorrect = false;
                    
                    // New format: data-correct="true"
                    if (option.dataset.correct !== undefined) {
                        isCorrect = option.dataset.correct === 'true';
                    }
                    // Old format: data-answer on question, data-value on option
                    else if (question.dataset.answer && option.dataset.value) {
                        isCorrect = option.dataset.value === question.dataset.answer;
                    }
                    
                    if (isCorrect) {
                        option.classList.add('correct');
                        correctAnswers++;
                        if (feedback) {
                            feedback.textContent = '✓ Correct!';
                            feedback.className = 'quiz-feedback correct';
                            feedback.style.display = 'block';
                        }
                    } else {
                        option.classList.add('incorrect');
                        // Show the correct answer - support both formats
                        options.forEach(opt => {
                            // New format
                            if (opt.dataset.correct === 'true') {
                                opt.classList.add('correct');
                            }
                            // Old format
                            else if (question.dataset.answer && opt.dataset.value === question.dataset.answer) {
                                opt.classList.add('correct');
                            }
                        });
                        if (feedback) {
                            feedback.textContent = '✗ Incorrect. Try reviewing the section above.';
                            feedback.className = 'quiz-feedback incorrect';
                            feedback.style.display = 'block';
                        }
                    }
                    
                    // Disable all options
                    options.forEach(opt => opt.style.pointerEvents = 'none');
                    
                    // Update score if all questions answered
                    const answeredQuestions = quizContainer.querySelectorAll('.quiz-question.answered').length;
                    if (answeredQuestions === totalQuestions) {
                        showQuizResults(quizContainer, correctAnswers, totalQuestions);
                    }
                });
            });
        });
    });
    
    function showQuizResults(quizContainer, correct, total) {
        const percentage = Math.round((correct / total) * 100);
        const resultsDiv = quizContainer.querySelector('.quiz-results');
        
        if (resultsDiv) {
            let message = '';
            let emoji = '';
            
            if (percentage === 100) {
                message = 'Perfect score! You\'ve mastered this topic! 🎉';
                emoji = '🌟';
            } else if (percentage >= 80) {
                message = 'Great job! You have a strong understanding! 👏';
                emoji = '✨';
            } else if (percentage >= 60) {
                message = 'Good effort! Review the material for better understanding. 📚';
                emoji = '💪';
            } else {
                message = 'Keep learning! Review the tutorial and try again. 🚀';
                emoji = '📖';
            }
            
            resultsDiv.innerHTML = `
                <div class="quiz-score">
                    <div class="score-emoji">${emoji}</div>
                    <div class="score-text">Your Score: ${correct}/${total} (${percentage}%)</div>
                    <div class="score-message">${message}</div>
                </div>
            `;
            resultsDiv.style.display = 'block';
        }
    }

    // ===================================
    // Back to Top Button
    // ===================================
    
    // Create back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top-btn';
    backToTopBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
    `;
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===================================
    // Reading Progress Bar
    // ===================================
    
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    });

    // ===================================
    // Keyboard Shortcuts
    // ===================================
    
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // D key for dark mode toggle
        if (e.key === 'd' || e.key === 'D') {
            const darkModeToggle = document.querySelector('.dark-mode-toggle');
            if (darkModeToggle) {
                darkModeToggle.click();
            }
        }
        
        // T key for back to top
        if (e.key === 't' || e.key === 'T') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });

    // ===================================
    // Emoji Reactions / Feedback
    // ===================================
    // MOVED TO common.js - Feedback and Social Sharing are now centralized
    // All tutorials automatically get these features via common.js
    // No need to duplicate code here anymore
    
    /* DEPRECATED - Keeping for reference only
    // Add feedback section before tutorial navigation
    const tutorialNav = document.querySelector('.tutorial-nav, .tutorial-navigation');
    if (tutorialNav) {
        (async function initFeedback() {
            const tutorialUrl = window.location.pathname;
        
        // API Base URL
        const API_BASE = `${window.location.origin}/api`;
        
        // Generate unique user ID (stored in localStorage)
        function getUserId() {
            let userId = localStorage.getItem('votingUserId');
            if (!userId) {
                userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
                localStorage.setItem('votingUserId', userId);
            }
            return userId;
        }
        
        // Get vote counts for this tutorial from API
        async function getVoteCounts() {
            try {
                const tutorialName = tutorialUrl.split('/').pop();
                const response = await fetch(`${API_BASE}/votes/${tutorialName}`);
                const counts = await response.json();
                return {
                    helpful: counts.helpful || 0,
                    love: counts.love || 0,
                    confused: counts.confused || 0,
                    'not-helpful': counts.notHelpful || 0
                };
            } catch (error) {
                console.error('Error fetching vote counts:', error);
                return {
                    helpful: 0,
                    love: 0,
                    confused: 0,
                    'not-helpful': 0
                };
            }
        }
        
        // Check if user already voted (stored locally)
        function hasUserVoted() {
            const votedTutorials = JSON.parse(localStorage.getItem('votedTutorials') || '{}');
            return tutorialUrl in votedTutorials;
        }
        
        // Get user's previous vote for this tutorial
        function getUserVote() {
            const votedTutorials = JSON.parse(localStorage.getItem('votedTutorials') || '{}');
            return votedTutorials[tutorialUrl] || null;
        }
        
        // Save that user voted for this tutorial
        function saveUserVote(reaction) {
            const votedTutorials = JSON.parse(localStorage.getItem('votedTutorials') || '{}');
            votedTutorials[tutorialUrl] = reaction;
            localStorage.setItem('votedTutorials', JSON.stringify(votedTutorials));
        }
        
        // Initialize feedback section with vote counts
        const voteCounts = await getVoteCounts();
        const userVoted = hasUserVoted();
        const userVote = getUserVote();
        
        const feedbackSection = document.createElement('div');
        feedbackSection.className = 'tutorial-feedback';
        feedbackSection.innerHTML = `
            <div class="feedback-question">Was this tutorial helpful?</div>
            <div class="feedback-buttons">
                <button class="feedback-btn ${userVote === 'helpful' ? 'selected' : ''}" data-reaction="helpful">
                    <span class="feedback-emoji">👍</span>
                    <span class="feedback-label">Helpful</span>
                    <span class="feedback-count">${voteCounts.helpful > 0 ? voteCounts.helpful : ''}</span>
                </button>
                <button class="feedback-btn ${userVote === 'love' ? 'selected' : ''}" data-reaction="love">
                    <span class="feedback-emoji">❤️</span>
                    <span class="feedback-label">Love it</span>
                    <span class="feedback-count">${voteCounts.love > 0 ? voteCounts.love : ''}</span>
                </button>
                <button class="feedback-btn ${userVote === 'confused' ? 'selected' : ''}" data-reaction="confused">
                    <span class="feedback-emoji">😕</span>
                    <span class="feedback-label">Confused</span>
                    <span class="feedback-count">${voteCounts.confused > 0 ? voteCounts.confused : ''}</span>
                </button>
                <button class="feedback-btn ${userVote === 'not-helpful' ? 'selected' : ''}" data-reaction="not-helpful">
                    <span class="feedback-emoji">👎</span>
                    <span class="feedback-label">Not Helpful</span>
                    <span class="feedback-count">${voteCounts['not-helpful'] > 0 ? voteCounts['not-helpful'] : ''}</span>
                </button>
            </div>
            <div class="feedback-thanks" style="display: ${userVoted ? 'flex' : 'none'};">
                <span class="thanks-emoji">🎉</span>
                <span class="thanks-message">Thanks for your feedback!</span>
            </div>
        `;
        
        tutorialNav.parentNode.insertBefore(feedbackSection, tutorialNav);
        
        // Handle feedback clicks
        const feedbackBtns = feedbackSection.querySelectorAll('.feedback-btn');
        feedbackBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const reaction = btn.dataset.reaction;
                const userId = getUserId();
                
                try {
                    // Submit vote to API
                    const tutorialName = tutorialUrl.split('/').pop();
                    const response = await fetch(`${API_BASE}/vote`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            tutorial: tutorialName,
                            reaction: reaction,
                            userId: userId
                        })
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to submit vote');
                    }
                    
                    const updatedCounts = await response.json();
                    
                    // Update all count displays with new counts from server
                    feedbackBtns.forEach(b => {
                        const r = b.dataset.reaction;
                        const countSpan = b.querySelector('.feedback-count');
                        const countKey = r === 'not-helpful' ? 'notHelpful' : r;
                        const count = updatedCounts[countKey] || 0;
                        countSpan.textContent = count > 0 ? count : '';
                        
                        // Remove selected class from all buttons
                        b.classList.remove('selected');
                    });
                    
                    // Add selected class to clicked button
                    btn.classList.add('selected');
                    
                    // Save user vote locally
                    saveUserVote(reaction);
                    
                    // Show thanks message
                    feedbackSection.querySelector('.feedback-thanks').style.display = 'flex';
                    
                    console.log('Vote submitted successfully:', reaction, updatedCounts);
                } catch (error) {
                    console.error('Error submitting vote:', error);
                    alert('Failed to submit vote. Please make sure the server is running.');
                }
            });
        });
        
        // Add social share buttons after feedback section is created
        addSocialShareButtons();
        
        })(); // End of async initFeedback function
    }
    */ // END DEPRECATED CODE - Now handled by common.js
});

// ===================================
// Performance Optimization
// ===================================

// Lazy loading for images (if you add images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// Accessibility Enhancements
// ===================================

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close menu with Escape key
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Focus trap in mobile menu
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Apply focus trap to mobile menu when active
const navMenu = document.getElementById('navMenu');
if (navMenu) {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                if (navMenu.classList.contains('active')) {
                    trapFocus(navMenu);
                }
            }
        });
    });

    observer.observe(navMenu, { attributes: true });
}


// ===================================
// Learning Progress Tracker
// ===================================

const ProgressTracker = {
    // Get current tutorial URL (relative path)
    getCurrentTutorial() {
        const path = window.location.pathname;
        // Extract tutorial name from path (e.g., "variables.html" from ".../python/variables.html")
        const parts = path.split('/');
        return parts[parts.length - 1];
    },

    // Get all progress data
    getProgress() {
        const data = localStorage.getItem('nebaz_learningProgress');
        return data ? JSON.parse(data) : {
            completedTutorials: [],
            bookmarkedTutorials: [],
            scrollPositions: {},
            lastVisit: null,
            points: 0
        };
    },

    // Save progress data
    saveProgress(progress) {
        localStorage.setItem('nebaz_learningProgress', JSON.stringify(progress));
    },

    // Mark tutorial as completed
    markCompleted(tutorialUrl) {
        const progress = this.getProgress();
        if (!progress.completedTutorials.includes(tutorialUrl)) {
            progress.completedTutorials.push(tutorialUrl);
            progress.points += 50; // Award 50 points per tutorial
            this.saveProgress(progress);
            this.showCompletionNotification();
        }
    },

    // Check if tutorial is completed
    isCompleted(tutorialUrl) {
        const progress = this.getProgress();
        return progress.completedTutorials.includes(tutorialUrl);
    },

    // Save scroll position
    saveScrollPosition() {
        const tutorialUrl = this.getCurrentTutorial();
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        const progress = this.getProgress();
        progress.scrollPositions[tutorialUrl] = {
            position: window.scrollY,
            percent: Math.round(scrollPercent),
            timestamp: new Date().toISOString()
        };
        progress.lastVisit = tutorialUrl;
        this.saveProgress(progress);
    },

    // Restore scroll position
    restoreScrollPosition() {
        const tutorialUrl = this.getCurrentTutorial();
        const progress = this.getProgress();
        const saved = progress.scrollPositions[tutorialUrl];

        if (saved && saved.percent > 10 && saved.percent < 95) {
            // Show "continue where you left off" banner
            this.showContinueBanner(saved.percent);
        }
    },

    // Show "Continue Reading" banner
    showContinueBanner(percent) {
        const tutorialUrl = this.getCurrentTutorial();
        const progress = this.getProgress();
        const saved = progress.scrollPositions[tutorialUrl];

        const banner = document.createElement('div');
        banner.className = 'continue-banner';
        banner.innerHTML = `
            <div class="continue-banner-content">
                <span class="continue-icon">📖</span>
                <div class="continue-text">
                    <strong>Welcome back!</strong>
                    <span>You were ${percent}% through this tutorial.</span>
                </div>
                <div class="continue-actions">
                    <button class="continue-btn" onclick="ProgressTracker.scrollToSavedPosition()">
                        Continue Reading
                    </button>
                    <button class="dismiss-btn" onclick="ProgressTracker.dismissBanner()">
                        Start Over
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);
        
        // Show banner with animation
        setTimeout(() => banner.classList.add('show'), 100);
    },

    // Scroll to saved position
    scrollToSavedPosition() {
        const tutorialUrl = this.getCurrentTutorial();
        const progress = this.getProgress();
        const saved = progress.scrollPositions[tutorialUrl];

        if (saved) {
            window.scrollTo({ top: saved.position, behavior: 'smooth' });
        }
        this.dismissBanner();
    },

    // Dismiss continue banner
    dismissBanner() {
        const banner = document.querySelector('.continue-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 300);
        }
    },

    // Show completion notification
    showCompletionNotification() {
        const notification = document.createElement('div');
        notification.className = 'completion-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">🎉</span>
                <div class="notification-text">
                    <strong>Tutorial Completed!</strong>
                    <span>+50 points earned</span>
                </div>
            </div>
        `;

        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    },

    // Add "Mark as Complete" button
    addCompleteButton() {
        const tutorialUrl = this.getCurrentTutorial();
        
        // Find the tutorial feedback section to add button before it
        const feedbackSection = document.querySelector('.tutorial-feedback');
        if (!feedbackSection) return;

        const isCompleted = this.isCompleted(tutorialUrl);

        const completeSection = document.createElement('div');
        completeSection.className = 'tutorial-complete-section';
        completeSection.innerHTML = `
            <div class="complete-content">
                ${isCompleted ? `
                    <div class="completed-badge">
                        <span class="check-icon">✓</span>
                        <span>Completed</span>
                    </div>
                    <p class="complete-message">Great job! You've finished this tutorial.</p>
                ` : `
                    <h3>Finished this tutorial?</h3>
                    <p>Mark it as complete to track your progress!</p>
                    <button class="mark-complete-btn" onclick="ProgressTracker.handleMarkComplete()">
                        <span class="btn-icon">✓</span>
                        Mark as Complete
                    </button>
                `}
            </div>
        `;

        feedbackSection.parentNode.insertBefore(completeSection, feedbackSection);
    },

    // Handle mark complete button click
    handleMarkComplete() {
        const tutorialUrl = this.getCurrentTutorial();
        this.markCompleted(tutorialUrl);

        // Update the UI
        const completeSection = document.querySelector('.tutorial-complete-section');
        if (completeSection) {
            completeSection.innerHTML = `
                <div class="complete-content">
                    <div class="completed-badge">
                        <span class="check-icon">✓</span>
                        <span>Completed</span>
                    </div>
                    <p class="complete-message">Great job! You've finished this tutorial.</p>
                </div>
            `;
        }
    },

    // Initialize progress tracking
    init() {
        // Restore scroll position on page load
        this.restoreScrollPosition();

        // Add mark complete button
        this.addCompleteButton();

        // Save scroll position periodically
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.saveScrollPosition();
            }, 1000); // Save after 1 second of no scrolling
        });

        // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveScrollPosition();
        });
    }
};

// Initialize progress tracker if on a tutorial page
if (document.querySelector('.tutorial-content')) {
    ProgressTracker.init();
}


// ===================================
// Estimated Reading Time
// ===================================

function calculateReadingTime() {
    const tutorialContent = document.querySelector('.tutorial-content');
    if (!tutorialContent) return;

    // Check if tutorial already has a time specified in meta-info
    const tutorialMetaInfo = document.querySelector('.tutorial-meta-info');
    if (tutorialMetaInfo) {
        const hasTimeInfo = Array.from(tutorialMetaInfo.querySelectorAll('.meta-item')).some(item => {
            return item.textContent.includes('min') || item.textContent.includes('⏱️');
        });
        
        // Don't auto-calculate if time is already specified
        if (hasTimeInfo) return;
    }

    // Count words in the tutorial content
    const text = tutorialContent.innerText || tutorialContent.textContent;
    const wordCount = text.trim().split(/\s+/).length;
    
    // Average reading speed: 200 words per minute
    const readingTimeMinutes = Math.ceil(wordCount / 200);

    // Find where to insert reading time (after the tutorial header)
    const tutorialHeader = document.querySelector('.tutorial-header h1');
    if (!tutorialHeader) return;

    const readingTimeDiv = document.createElement('div');
    readingTimeDiv.className = 'reading-time';
    readingTimeDiv.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>${readingTimeMinutes} min read</span>
    `;

    // Insert after h1
    tutorialHeader.parentNode.insertBefore(readingTimeDiv, tutorialHeader.nextSibling);
}

// Calculate reading time on page load
if (document.querySelector('.tutorial-content')) {
    calculateReadingTime();
}


// ===================================
// Social Share Buttons
// ===================================

/* DEPRECATED - MOVED TO common.js
function addSocialShareButtons() {
    const feedbackSection = document.querySelector('.tutorial-feedback');
    if (!feedbackSection) return;

    const pageTitle = document.querySelector('.tutorial-header h1')?.textContent || 'this tutorial';
    const pageUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(`I'm learning ${pageTitle} on Nebaz AI Academy! 🚀`);

    const shareSection = document.createElement('div');
    shareSection.className = 'social-share-section';
    shareSection.innerHTML = `
        <h3 class="share-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            Share Your Learning
        </h3>
        <p class="share-description">Share this tutorial with others!</p>
        <div class="share-buttons">
            <a href="https://twitter.com/intent/tweet?text=${shareText}&url=${pageUrl}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="share-btn twitter-btn"
               aria-label="Share on Twitter">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span>Twitter</span>
            </a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="share-btn linkedin-btn"
               aria-label="Share on LinkedIn">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="share-btn facebook-btn"
               aria-label="Share on Facebook">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
            </a>
            <button class="share-btn copy-link-btn" onclick="copyPageLink()" aria-label="Copy link">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <span>Copy Link</span>
            </button>
        </div>
    `;

    // Insert after feedback section
    feedbackSection.parentNode.insertBefore(shareSection, feedbackSection.nextSibling);
}

// Copy page link function
window.copyPageLink = function() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        const btn = document.querySelector('.copy-link-btn span');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
};

// Note: Social share buttons are now called from within the feedback init function
// to ensure the feedback section exists before trying to insert share buttons
*/ // END DEPRECATED - Now in common.js


// ===================================
// Related Tutorials Widget
// ===================================

const RelatedTutorials = {
    // Tutorial metadata and relationships
    tutorials: {
        // 1. About Python Programming Language
        'about-python.html': {
            title: 'About Python Programming Language',
            category: 'python',
            level: 'beginner',
            time: '8 min',
            next: 'variables.html',
            related: ['variables.html', 'data_types.html']
        },
        // 2. Variables in Python
        'variables.html': {
            title: 'Variables in Python',
            category: 'python',
            level: 'beginner',
            time: '5 min',
            prev: 'about-python.html',
            next: 'data_types.html',
            related: ['about-python.html', 'data_types.html', 'python-operators-tutorial.html']
        },
        // 3. Basic Data Types in Python
        'data_types.html': {
            title: 'Basic Data Types in Python',
            category: 'python',
            level: 'beginner',
            time: '7 min',
            prev: 'variables.html',
            next: 'python-operators-tutorial.html',
            related: ['variables.html', 'python-operators-tutorial.html', 'python-data-structures-tutorial.html']
        },
        // 4. Operators in Python
        'python-operators-tutorial.html': {
            title: 'Operators in Python',
            category: 'python',
            level: 'beginner',
            time: '10 min',
            prev: 'data_types.html',
            next: 'conditional-statements-tutorial.html',
            related: ['data_types.html', 'conditional-statements-tutorial.html', 'variables.html']
        },
        // 5. Conditional Statements
        'conditional-statements-tutorial.html': {
            title: 'Conditional Statements in Python',
            category: 'python',
            level: 'beginner',
            time: '8 min',
            prev: 'python-operators-tutorial.html',
            next: 'python-loops-tutorial.html',
            related: ['python-operators-tutorial.html', 'python-loops-tutorial.html']
        },
        // 6. Loops in Python
        'python-loops-tutorial.html': {
            title: 'Loops in Python',
            category: 'python',
            level: 'beginner',
            time: '10 min',
            prev: 'conditional-statements-tutorial.html',
            next: 'python-data-structures-tutorial.html',
            related: ['conditional-statements-tutorial.html', 'python-data-structures-tutorial.html']
        },
        // 7. Inbuilt Data Structures
        'python-data-structures-tutorial.html': {
            title: 'Inbuilt Data Structures in Python',
            category: 'python',
            level: 'intermediate',
            time: '15 min',
            prev: 'python-loops-tutorial.html',
            next: 'python_functions_tutorial.html',
            related: ['python-loops-tutorial.html', 'python_functions_tutorial.html', 'data_types.html']
        },
        // 8. Functions in Python
        'python_functions_tutorial.html': {
            title: 'Functions in Python',
            category: 'python',
            level: 'intermediate',
            time: '12 min',
            prev: 'python-data-structures-tutorial.html',
            next: 'modules-packages-tutorial.html',
            related: ['python-data-structures-tutorial.html', 'modules-packages-tutorial.html']
        },
        // 9. Importing, Creating Modules and Packages
        'modules-packages-tutorial.html': {
            title: 'Modules and Packages in Python',
            category: 'python',
            level: 'intermediate',
            time: '10 min',
            prev: 'python_functions_tutorial.html',
            related: ['python_functions_tutorial.html', 'python-data-structures-tutorial.html']
        },

        // AI for Everyone Course
        // 1. Understanding Intelligence (Human & Artificial) - New Version
        'understanding-intelligence-v2.html': {
            title: 'Understanding Intelligence (Human & Artificial)',
            category: 'ai-for-everyone',
            level: 'beginner',
            time: '20 min',
            next: 'how-does-ai-work.html',
            related: ['how-does-ai-work.html', 'types-of-ai.html']
        },
        // 2. How Does AI Work?
        'how-does-ai-work.html': {
            title: 'How Does AI Work?',
            category: 'ai-for-everyone',
            level: 'beginner',
            time: '15 min',
            next: 'types-of-ai.html',
            related: ['understanding-intelligence-v2.html', 'types-of-ai.html']
        },
        // 3. Types of AI: From Narrow to General
        'types-of-ai.html': {
            title: 'Types of AI (From Narrow to General)',
            category: 'ai-for-everyone',
            level: 'beginner',
            time: '12 min',
            next: 'ai-in-daily-life.html',
            related: ['how-does-ai-work.html', 'ai-in-daily-life.html']
        },
        // 4. AI in Daily Life
        'ai-in-daily-life.html': {
            title: 'AI in Daily Life',
            category: 'ai-for-everyone',
            level: 'beginner',
            time: '15 min',
            next: 'ai-in-business.html',
            related: ['how-does-ai-work.html', 'types-of-ai.html', 'ai-in-business.html']
        },
        // 5. AI in Business & Industry
        'ai-in-business.html': {
            title: 'AI in Business & Industry',
            category: 'ai-for-everyone',
            level: 'beginner',
            time: '18 min',
            next: 'ai-in-healthcare.html',
            related: ['ai-in-daily-life.html', 'types-of-ai.html', 'ai-in-healthcare.html']
        },
        // 6. AI in Healthcare & Science
        'ai-in-healthcare.html': {
            title: 'AI in Healthcare & Science',
            category: 'ai-for-everyone',
            level: 'beginner',
            time: '16 min',
            next: 'data-in-ai.html',
            related: ['ai-in-business.html', 'ai-in-daily-life.html', 'how-does-ai-work.html']
        },
        // 7. The Role of Data in AI
        'data-in-ai.html': {
            title: 'The Role of Data in AI',
            category: 'ai-for-everyone',
            level: 'beginner',
            time: '17 min',
            next: 'training-ai-models.html',
            related: ['how-does-ai-work.html', 'training-ai-models.html', 'ai-in-healthcare.html']
        },
        // 8. How AI Models are Trained
        'training-ai-models.html': {
            title: 'How AI Models are Trained',
            category: 'ai-for-everyone',
            level: 'beginner',
            time: '20 min',
            next: 'ai-project-workflow.html',
            related: ['data-in-ai.html', 'how-does-ai-work.html', 'ai-in-business.html']
        },
        // 9. AI Project Workflow
        'ai-project-workflow.html': {
            title: 'AI Project Workflow',
            category: 'ai-for-everyone',
            level: 'beginner',
            time: '22 min',
            next: 'ai-ethics.html',
            related: ['training-ai-models.html', 'data-in-ai.html', 'ai-in-business.html']
        },
        // 10. AI Ethics & Responsibility
        'ai-ethics.html': {
            title: 'AI Ethics & Responsibility',
            category: 'ai-for-everyone',
            level: 'beginner',
            time: '25 min',
            next: 'ai-careers.html',
            related: ['ai-project-workflow.html', 'ai-in-healthcare.html', 'data-in-ai.html']
        },
        // 11. Career Opportunities in AI
        'ai-careers.html': {
            title: 'Career Opportunities in AI',
            category: 'ai-for-everyone',
            level: 'beginner',
            time: '24 min',
            next: 'future-of-ai.html',
            related: ['ai-ethics.html', 'ai-project-workflow.html', 'ai-in-business.html']
        },
        // 12. The Future of AI
        'future-of-ai.html': {
            title: 'The Future of AI',
            category: 'ai-for-everyone',
            level: 'beginner',
            time: '26 min',
            next: null,
            related: ['ai-careers.html', 'ai-ethics.html', 'training-ai-models.html']
        },
        // Legacy versions
        'understanding-intelligence.html': {
            title: 'Understanding Intelligence (Human & Artificial)',
            category: 'ai-for-everyone',
            level: 'beginner',
            time: '15 min',
            next: 'understanding-intelligence-v2.html',
            related: ['understanding-intelligence-v2.html', 'what-is-ai.html']
        },
        'what-is-ai.html': {
            title: 'What is Artificial Intelligence?',
            category: 'ai-for-everyone',
            level: 'beginner',
            time: '10 min',
            next: 'understanding-intelligence-v2.html',
            related: ['understanding-intelligence-v2.html', 'how-does-ai-work.html']
        },

        // ChatGPT & Prompt Engineering Course
        // 1. Introduction to ChatGPT
        'intro-to-chatgpt.html': {
            title: 'Introduction to ChatGPT',
            category: 'chatgpt-prompt-engineering',
            level: 'beginner',
            time: '25 min',
            next: 'prompt-engineering-fundamentals.html',
            related: ['prompt-engineering-fundamentals.html', 'advanced-prompting-techniques.html']
        },
        // 2. Prompt Engineering Fundamentals
        'prompt-engineering-fundamentals.html': {
            title: 'Prompt Engineering Fundamentals',
            category: 'chatgpt-prompt-engineering',
            level: 'beginner',
            time: '30 min',
            prev: 'intro-to-chatgpt.html',
            next: 'advanced-prompting-techniques.html',
            related: ['intro-to-chatgpt.html', 'advanced-prompting-techniques.html', 'prompt-frameworks-templates.html']
        },
        // 3. Advanced Prompting Techniques
        'advanced-prompting-techniques.html': {
            title: 'Advanced Prompting Techniques',
            category: 'chatgpt-prompt-engineering',
            level: 'intermediate',
            time: '28 min',
            prev: 'prompt-engineering-fundamentals.html',
            next: 'prompt-frameworks-templates.html',
            related: ['prompt-engineering-fundamentals.html', 'prompt-frameworks-templates.html', 'chatgpt-for-coding.html']
        },
        // 4. Prompt Frameworks & Templates
        'prompt-frameworks-templates.html': {
            title: 'Prompt Frameworks & Templates',
            category: 'chatgpt-prompt-engineering',
            level: 'intermediate',
            time: '32 min',
            prev: 'advanced-prompting-techniques.html',
            next: 'chatgpt-for-writing.html',
            related: ['advanced-prompting-techniques.html', 'chatgpt-for-writing.html', 'chatgpt-for-coding.html']
        },
        // 5. ChatGPT for Writing & Content
        'chatgpt-for-writing.html': {
            title: 'ChatGPT for Writing & Content',
            category: 'chatgpt-prompt-engineering',
            level: 'intermediate',
            time: '35 min',
            prev: 'prompt-frameworks-templates.html',
            next: 'chatgpt-for-coding.html',
            related: ['prompt-frameworks-templates.html', 'chatgpt-for-coding.html', 'chatgpt-for-business.html']
        },
        // 6. ChatGPT for Coding & Technical Work
        'chatgpt-for-coding.html': {
            title: 'ChatGPT for Coding & Technical Work',
            category: 'chatgpt-prompt-engineering',
            level: 'intermediate',
            time: '30 min',
            prev: 'chatgpt-for-writing.html',
            next: 'chatgpt-for-business.html',
            related: ['chatgpt-for-writing.html', 'chatgpt-for-business.html', 'advanced-prompting-techniques.html']
        },
        // 7. ChatGPT for Business & Analysis
        'chatgpt-for-business.html': {
            title: 'ChatGPT for Business & Analysis',
            category: 'chatgpt-prompt-engineering',
            level: 'intermediate',
            time: '33 min',
            prev: 'chatgpt-for-coding.html',
            next: 'building-ai-workflows.html',
            related: ['chatgpt-for-coding.html', 'building-ai-workflows.html', 'chatgpt-for-writing.html']
        },
        // 8. Building AI Workflows
        'building-ai-workflows.html': {
            title: 'Building AI Workflows',
            category: 'chatgpt-prompt-engineering',
            level: 'intermediate',
            time: '38 min',
            prev: 'chatgpt-for-business.html',
            next: null,
            related: ['chatgpt-for-business.html', 'chatgpt-for-coding.html', 'prompt-frameworks-templates.html']
        },

        // Machine Learning Course
        // 1. Introduction to Machine Learning
        'introduction-to-ml.html': {
            title: 'Introduction to Machine Learning',
            category: 'machine-learning',
            level: 'beginner',
            time: '15 min',
            next: 'linear-regression.html',
            related: ['linear-regression.html', 'logistic-regression.html']
        },
        // 2. Linear Regression
        'linear-regression.html': {
            title: 'Linear Regression',
            category: 'machine-learning',
            level: 'beginner',
            time: '20 min',
            prev: 'introduction-to-ml.html',
            next: 'logistic-regression.html',
            related: ['introduction-to-ml.html', 'logistic-regression.html', 'decision-trees.html']
        },
        // 3. Logistic Regression
        'logistic-regression.html': {
            title: 'Logistic Regression',
            category: 'machine-learning',
            level: 'intermediate',
            time: '18 min',
            prev: 'linear-regression.html',
            next: 'decision-trees.html',
            related: ['linear-regression.html', 'decision-trees.html', 'introduction-to-ml.html']
        },
        // 4. Decision Trees
        'decision-trees.html': {
            title: 'Decision Trees',
            category: 'machine-learning',
            level: 'intermediate',
            time: '22 min',
            prev: 'logistic-regression.html',
            next: 'random-forests.html',
            related: ['logistic-regression.html', 'random-forests.html', 'gradient-boosting.html']
        },
        // 5. Random Forests
        'random-forests.html': {
            title: 'Random Forests',
            category: 'machine-learning',
            level: 'advanced',
            time: '25 min',
            prev: 'decision-trees.html',
            next: 'support-vector-machines.html',
            related: ['decision-trees.html', 'gradient-boosting.html', 'logistic-regression.html']
        },
        // 6. Support Vector Machines
        'support-vector-machines.html': {
            title: 'Support Vector Machines',
            category: 'machine-learning',
            level: 'advanced',
            time: '28 min',
            prev: 'random-forests.html',
            next: 'gradient-boosting.html',
            related: ['random-forests.html', 'logistic-regression.html', 'decision-trees.html']
        },
        // 7. Gradient Boosting
        'gradient-boosting.html': {
            title: 'Gradient Boosting (XGBoost & LightGBM)',
            category: 'machine-learning',
            level: 'advanced',
            time: '30 min',
            prev: 'support-vector-machines.html',
            next: null,
            related: ['random-forests.html', 'decision-trees.html', 'support-vector-machines.html']
        },

        // Deep Learning Course
        // 1. Neural Networks Fundamentals
        'neural-networks-fundamentals.html': {
            title: 'Neural Networks Fundamentals',
            category: 'deep-learning',
            level: 'beginner',
            time: '25 min',
            next: 'training-neural-networks.html',
            related: ['training-neural-networks.html', 'convolutional-neural-networks.html']
        },
        // 2. Training Neural Networks
        'training-neural-networks.html': {
            title: 'Training Neural Networks',
            category: 'deep-learning',
            level: 'beginner',
            time: '22 min',
            prev: 'neural-networks-fundamentals.html',
            next: 'convolutional-neural-networks.html',
            related: ['neural-networks-fundamentals.html', 'convolutional-neural-networks.html', 'recurrent-neural-networks.html']
        },
        // 3. Convolutional Neural Networks
        'convolutional-neural-networks.html': {
            title: 'Convolutional Neural Networks (CNN)',
            category: 'deep-learning',
            level: 'intermediate',
            time: '28 min',
            prev: 'training-neural-networks.html',
            next: 'recurrent-neural-networks.html',
            related: ['training-neural-networks.html', 'recurrent-neural-networks.html', 'attention-and-transformers.html']
        },
        // 4. Recurrent Neural Networks
        'recurrent-neural-networks.html': {
            title: 'Recurrent Neural Networks (RNN)',
            category: 'deep-learning',
            level: 'intermediate',
            time: '30 min',
            prev: 'convolutional-neural-networks.html',
            next: 'attention-and-transformers.html',
            related: ['convolutional-neural-networks.html', 'attention-and-transformers.html', 'transfer-learning-and-fine-tuning.html']
        },
        // 5. Attention & Transformers
        'attention-and-transformers.html': {
            title: 'Attention & Transformers',
            category: 'deep-learning',
            level: 'advanced',
            time: '35 min',
            prev: 'recurrent-neural-networks.html',
            next: 'transfer-learning-and-fine-tuning.html',
            related: ['recurrent-neural-networks.html', 'transfer-learning-and-fine-tuning.html', 'generative-models-and-gans.html']
        },
        // 6. Transfer Learning & Fine-tuning
        'transfer-learning-and-fine-tuning.html': {
            title: 'Transfer Learning & Fine-tuning',
            category: 'deep-learning',
            level: 'advanced',
            time: '28 min',
            prev: 'attention-and-transformers.html',
            next: 'generative-models-and-gans.html',
            related: ['attention-and-transformers.html', 'generative-models-and-gans.html', 'convolutional-neural-networks.html']
        },
        // 7. Generative Models & GANs
        'generative-models-and-gans.html': {
            title: 'Generative Models & GANs',
            category: 'deep-learning',
            level: 'advanced',
            time: '32 min',
            prev: 'transfer-learning-and-fine-tuning.html',
            next: null,
            related: ['transfer-learning-and-fine-tuning.html', 'attention-and-transformers.html', 'neural-networks-fundamentals.html']
        },

        // LLMs & Transformers Course
        // 1. What Are LLMs?
        'what-are-llms.html': {
            title: 'What Are LLMs?',
            category: 'llm-transformers',
            level: 'beginner',
            time: '20 min',
            next: 'tokenization-and-embeddings.html',
            related: ['tokenization-and-embeddings.html', 'prompt-engineering.html', 'attention-and-transformers.html']
        },
        // 2. Tokenization & Embeddings
        'tokenization-and-embeddings.html': {
            title: 'Tokenization & Embeddings',
            category: 'llm-transformers',
            level: 'beginner',
            time: '18 min',
            prev: 'what-are-llms.html',
            next: 'prompt-engineering.html',
            related: ['what-are-llms.html', 'prompt-engineering.html', 'neural-networks-fundamentals.html']
        },
        // 3. Prompt Engineering
        'prompt-engineering.html': {
            title: 'Prompt Engineering',
            category: 'llm-transformers',
            level: 'intermediate',
            time: '25 min',
            prev: 'tokenization-and-embeddings.html',
            next: 'in-context-learning-and-rag.html',
            related: ['tokenization-and-embeddings.html', 'in-context-learning-and-rag.html', 'building-llm-applications.html']
        },
        // 4. In-Context Learning & RAG
        'in-context-learning-and-rag.html': {
            title: 'In-Context Learning & RAG',
            category: 'llm-transformers',
            level: 'intermediate',
            time: '28 min',
            prev: 'prompt-engineering.html',
            next: 'fine-tuning-llms.html',
            related: ['prompt-engineering.html', 'fine-tuning-llms.html', 'what-are-llms.html']
        },
        // 5. Fine-tuning LLMs
        'fine-tuning-llms.html': {
            title: 'Fine-tuning LLMs',
            category: 'llm-transformers',
            level: 'advanced',
            time: '32 min',
            prev: 'in-context-learning-and-rag.html',
            next: 'inference-optimization.html',
            related: ['in-context-learning-and-rag.html', 'inference-optimization.html', 'transfer-learning-and-fine-tuning.html']
        },
        // 6. Inference Optimization
        'inference-optimization.html': {
            title: 'Inference Optimization',
            category: 'llm-transformers',
            level: 'advanced',
            time: '30 min',
            prev: 'fine-tuning-llms.html',
            next: 'building-llm-applications.html',
            related: ['fine-tuning-llms.html', 'building-llm-applications.html', 'neural-networks-fundamentals.html']
        },
        // 7. Building LLM Applications
        'building-llm-applications.html': {
            title: 'Building LLM Applications',
            category: 'llm-transformers',
            level: 'advanced',
            time: '35 min',
            prev: 'inference-optimization.html',
            next: null,
            related: ['inference-optimization.html', 'prompt-engineering.html', 'what-are-llms.html']
        },

        // AI Agents Course
        // 1. What Are AI Agents?
        'what-are-ai-agents.html': {
            title: 'What Are AI Agents?',
            category: 'ai-agents',
            level: 'beginner',
            time: '22 min',
            next: 'agent-planning-and-reasoning.html',
            related: ['agent-planning-and-reasoning.html', 'agent-tools-and-actions.html', 'agent-frameworks.html']
        },
        // 2. Agent Planning & Reasoning
        'agent-planning-and-reasoning.html': {
            title: 'Agent Planning & Reasoning',
            category: 'ai-agents',
            level: 'beginner',
            time: '25 min',
            prev: 'what-are-ai-agents.html',
            next: 'agent-tools-and-actions.html',
            related: ['what-are-ai-agents.html', 'agent-tools-and-actions.html', 'agent-frameworks.html']
        },
        // 3. Agent Tools & Actions
        'agent-tools-and-actions.html': {
            title: 'Agent Tools & Actions',
            category: 'ai-agents',
            level: 'intermediate',
            time: '28 min',
            prev: 'agent-planning-and-reasoning.html',
            next: 'agent-frameworks.html',
            related: ['agent-planning-and-reasoning.html', 'agent-frameworks.html', 'multi-agent-systems.html']
        },
        // 4. Agent Frameworks
        'agent-frameworks.html': {
            title: 'Agent Frameworks',
            category: 'ai-agents',
            level: 'intermediate',
            time: '30 min',
            prev: 'agent-tools-and-actions.html',
            next: 'multi-agent-systems.html',
            related: ['agent-tools-and-actions.html', 'multi-agent-systems.html', 'building-production-agent-systems.html']
        },
        // 5. Multi-Agent Systems
        'multi-agent-systems.html': {
            title: 'Multi-Agent Systems',
            category: 'ai-agents',
            level: 'advanced',
            time: '32 min',
            prev: 'agent-frameworks.html',
            next: 'agent-evaluation-and-safety.html',
            related: ['agent-frameworks.html', 'agent-evaluation-and-safety.html', 'what-are-ai-agents.html']
        },
        // 6. Agent Evaluation & Safety
        'agent-evaluation-and-safety.html': {
            title: 'Agent Evaluation & Safety',
            category: 'ai-agents',
            level: 'advanced',
            time: '28 min',
            prev: 'multi-agent-systems.html',
            next: 'building-production-agent-systems.html',
            related: ['multi-agent-systems.html', 'building-production-agent-systems.html', 'agent-tools-and-actions.html']
        },
        // 7. Building Production Agent Systems
        'building-production-agent-systems.html': {
            title: 'Building Production Agent Systems',
            category: 'ai-agents',
            level: 'advanced',
            time: '35 min',
            prev: 'agent-evaluation-and-safety.html',
            next: null,
            related: ['agent-evaluation-and-safety.html', 'agent-frameworks.html', 'what-are-ai-agents.html']
        },

        // Transformers Architecture Course
        'the-problem-with-rnns.html': {
            title: 'The Problem With RNNs',
            category: 'transformers',
            level: 'beginner',
            time: '24 min',
            prev: null,
            next: 'attention-is-all-you-need.html',
            related: ['attention-is-all-you-need.html', 'self-attention-mechanism.html', 'complete-transformer-architecture.html']
        },
        'attention-is-all-you-need.html': {
            title: 'Attention Is All You Need',
            category: 'transformers',
            level: 'beginner',
            time: '28 min',
            prev: 'the-problem-with-rnns.html',
            next: 'self-attention-mechanism.html',
            related: ['the-problem-with-rnns.html', 'self-attention-mechanism.html', 'multi-head-attention-and-positional-encoding.html']
        },
        'self-attention-mechanism.html': {
            title: 'Self-Attention Mechanism',
            category: 'transformers',
            level: 'intermediate',
            time: '32 min',
            prev: 'attention-is-all-you-need.html',
            next: 'multi-head-attention-and-positional-encoding.html',
            related: ['attention-is-all-you-need.html', 'multi-head-attention-and-positional-encoding.html', 'complete-transformer-architecture.html']
        },
        'multi-head-attention-and-positional-encoding.html': {
            title: 'Multi-Head Attention & Positional Encoding',
            category: 'transformers',
            level: 'intermediate',
            time: '30 min',
            prev: 'self-attention-mechanism.html',
            next: 'complete-transformer-architecture.html',
            related: ['self-attention-mechanism.html', 'complete-transformer-architecture.html', 'how-llms-work-from-tokens-to-tokens.html']
        },
        'complete-transformer-architecture.html': {
            title: 'Complete Transformer Architecture',
            category: 'transformers',
            level: 'advanced',
            time: '35 min',
            prev: 'multi-head-attention-and-positional-encoding.html',
            next: 'decoder-only-models-and-language-generation.html',
            related: ['multi-head-attention-and-positional-encoding.html', 'decoder-only-models-and-language-generation.html', 'how-llms-work-from-tokens-to-tokens.html']
        },
        'decoder-only-models-and-language-generation.html': {
            title: 'Decoder-Only Models & Language Generation',
            category: 'transformers',
            level: 'advanced',
            time: '33 min',
            prev: 'complete-transformer-architecture.html',
            next: 'how-llms-work-from-tokens-to-tokens.html',
            related: ['complete-transformer-architecture.html', 'how-llms-work-from-tokens-to-tokens.html', 'self-attention-mechanism.html']
        },
        'how-llms-work-from-tokens-to-tokens.html': {
            title: 'How LLMs Work: From Tokens to Tokens',
            category: 'transformers',
            level: 'advanced',
            time: '38 min',
            prev: 'decoder-only-models-and-language-generation.html',
            next: null,
            related: ['decoder-only-models-and-language-generation.html', 'complete-transformer-architecture.html', 'the-problem-with-rnns.html']
        },

        // Feature Engineering Course
        // 1. Data Preprocessing Fundamentals
        'data-preprocessing.html': {
            title: 'Data Preprocessing Fundamentals',
            category: 'feature-engineering',
            level: 'beginner',
            time: '65 min',
            next: 'encoding-categorical.html',
            related: ['encoding-categorical.html', 'introduction-to-ml.html']
        },
        // 2. Encoding Categorical Variables
        'encoding-categorical.html': {
            title: 'Encoding Categorical Variables',
            category: 'feature-engineering',
            level: 'beginner',
            time: '70 min',
            prev: 'data-preprocessing.html',
            next: 'feature-scaling.html',
            related: ['data-preprocessing.html', 'feature-scaling.html', 'introduction-to-ml.html']
        },
        // 3. Feature Scaling & Normalization
        'feature-scaling.html': {
            title: 'Feature Scaling & Normalization',
            category: 'feature-engineering',
            level: 'intermediate',
            time: '60 min',
            prev: 'encoding-categorical.html',
            next: 'feature-extraction.html',
            related: ['encoding-categorical.html', 'feature-extraction.html', 'linear-regression.html']
        },
        // 4. Feature Extraction & Creation
        'feature-extraction.html': {
            title: 'Feature Extraction & Creation',
            category: 'feature-engineering',
            level: 'intermediate',
            time: '75 min',
            prev: 'feature-scaling.html',
            next: 'feature-transformation.html',
            related: ['feature-scaling.html', 'data-preprocessing.html', 'encoding-categorical.html']
        },
        // 5. Feature Transformation Techniques
        'feature-transformation.html': {
            title: 'Feature Transformation Techniques',
            category: 'feature-engineering',
            level: 'intermediate',
            time: '65 min',
            prev: 'feature-extraction.html',
            next: 'feature-selection.html',
            related: ['feature-extraction.html', 'feature-scaling.html', 'data-preprocessing.html']
        },
        // 6. Feature Selection Methods
        'feature-selection.html': {
            title: 'Feature Selection Methods',
            category: 'feature-engineering',
            level: 'intermediate',
            time: '70 min',
            prev: 'feature-transformation.html',
            next: 'dimensionality-reduction.html',
            related: ['feature-transformation.html', 'dimensionality-reduction.html', 'feature-extraction.html']
        },
        // 7. Dimensionality Reduction
        'dimensionality-reduction.html': {
            title: 'Dimensionality Reduction',
            category: 'feature-engineering',
            level: 'advanced',
            time: '80 min',
            prev: 'feature-selection.html',
            next: 'automated-feature-engineering.html',
            related: ['feature-selection.html', 'automated-feature-engineering.html', 'feature-transformation.html']
        },
        // 8. Automated Feature Engineering
        'automated-feature-engineering.html': {
            title: 'Automated Feature Engineering',
            category: 'feature-engineering',
            level: 'advanced',
            time: '85 min',
            prev: 'dimensionality-reduction.html',
            next: null,
            related: ['dimensionality-reduction.html', 'feature-extraction.html', 'feature-selection.html']
        }
    },

    // Get current tutorial filename
    getCurrentTutorial() {
        const path = window.location.pathname;
        const parts = path.split('/');
        return parts[parts.length - 1];
    },

    // Create tutorial card HTML
    createTutorialCard(filename, metadata, type = 'related') {
        const baseUrl = './'; // Same directory as current tutorial
        const icon = type === 'next' ? '→' : type === 'prev' ? '←' : '📚';
        
        return `
            <a href="${baseUrl}${filename}" class="related-tutorial-card ${type}-card">
                <div class="card-icon">${icon}</div>
                <div class="card-content">
                    <div class="card-label">${type === 'next' ? 'Next Tutorial' : type === 'prev' ? 'Previous Tutorial' : 'Related'}</div>
                    <h4 class="card-title">${metadata.title}</h4>
                    <div class="card-meta">
                        <span class="card-badge">${metadata.level}</span>
                        <span class="card-time">${metadata.time} read</span>
                    </div>
                </div>
            </a>
        `;
    },

    // Add related tutorials section
    addRelatedTutorials() {
        const currentTutorial = this.getCurrentTutorial();
        const metadata = this.tutorials[currentTutorial];

        if (!metadata) return; // No metadata for this tutorial yet

        // Find where to insert (after share section or feedback)
        const shareSection = document.querySelector('.social-share-section');
        const feedbackSection = document.querySelector('.tutorial-feedback');
        const insertAfter = shareSection || feedbackSection;

        if (!insertAfter) return;

        const relatedSection = document.createElement('div');
        relatedSection.className = 'related-tutorials-section';

        let cardsHTML = '';

        // Add next tutorial if exists
        if (metadata.next && this.tutorials[metadata.next]) {
            cardsHTML += this.createTutorialCard(metadata.next, this.tutorials[metadata.next], 'next');
        }

        // Add previous tutorial if exists
        if (metadata.prev && this.tutorials[metadata.prev]) {
            cardsHTML += this.createTutorialCard(metadata.prev, this.tutorials[metadata.prev], 'prev');
        }

        // Add related tutorials
        if (metadata.related && metadata.related.length > 0) {
            metadata.related.forEach(filename => {
                if (this.tutorials[filename]) {
                    cardsHTML += this.createTutorialCard(filename, this.tutorials[filename], 'related');
                }
            });
        }

        relatedSection.innerHTML = `
            <div class="related-tutorials-header">
                <h3>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    Continue Your Learning Journey
                </h3>
                <p>Check out these related tutorials to expand your knowledge</p>
            </div>
            <div class="related-tutorials-grid">
                ${cardsHTML}
            </div>
        `;

        // Insert after share/feedback section
        insertAfter.parentNode.insertBefore(relatedSection, insertAfter.nextSibling);
    },

    // Initialize
    init() {
        this.addRelatedTutorials();
    }
};

// Initialize related tutorials on tutorial pages
if (document.querySelector('.tutorial-content')) {
    RelatedTutorials.init();
}


// ===================================
// Bookmark System
// ===================================

const BookmarkSystem = {
    // Get bookmarks from localStorage
    getBookmarks() {
        const bookmarks = localStorage.getItem('bookmarkedTutorials');
        return bookmarks ? JSON.parse(bookmarks) : [];
    },

    // Save bookmarks
    saveBookmarks(bookmarks) {
        localStorage.setItem('bookmarkedTutorials', JSON.stringify(bookmarks));
    },

    // Get current tutorial info
    getCurrentTutorialInfo() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        const title = document.querySelector('.tutorial-header h1')?.textContent || 'Tutorial';
        
        return {
            url: path,
            filename: filename,
            title: title,
            timestamp: new Date().toISOString()
        };
    },

    // Check if current tutorial is bookmarked
    isBookmarked() {
        const bookmarks = this.getBookmarks();
        const currentUrl = window.location.pathname;
        return bookmarks.some(b => b.url === currentUrl);
    },

    // Toggle bookmark
    toggleBookmark() {
        const bookmarks = this.getBookmarks();
        const currentUrl = window.location.pathname;
        const index = bookmarks.findIndex(b => b.url === currentUrl);

        if (index > -1) {
            // Remove bookmark
            bookmarks.splice(index, 1);
            this.saveBookmarks(bookmarks);
            this.updateBookmarkButton(false);
            this.showNotification('Bookmark removed');
        } else {
            // Add bookmark
            const tutorialInfo = this.getCurrentTutorialInfo();
            bookmarks.push(tutorialInfo);
            this.saveBookmarks(bookmarks);
            this.updateBookmarkButton(true);
            this.showNotification('Tutorial bookmarked!');
        }
    },

    // Update bookmark button appearance
    updateBookmarkButton(isBookmarked) {
        const btn = document.querySelector('.bookmark-btn');
        if (!btn) return;

        if (isBookmarked) {
            btn.classList.add('bookmarked');
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                <span>Bookmarked</span>
            `;
        } else {
            btn.classList.remove('bookmarked');
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                <span>Bookmark</span>
            `;
        }
    },

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'bookmark-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    },

    // Add bookmark button to page
    addBookmarkButton() {
        const tutorialHeader = document.querySelector('.tutorial-header');
        if (!tutorialHeader) return;

        const isBookmarked = this.isBookmarked();

        const bookmarkBtn = document.createElement('button');
        bookmarkBtn.className = 'bookmark-btn' + (isBookmarked ? ' bookmarked' : '');
        bookmarkBtn.setAttribute('aria-label', 'Bookmark this tutorial');
        bookmarkBtn.onclick = () => this.toggleBookmark();

        if (isBookmarked) {
            bookmarkBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                <span>Bookmarked</span>
            `;
        } else {
            bookmarkBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                <span>Bookmark</span>
            `;
        }

        tutorialHeader.appendChild(bookmarkBtn);
    },

    // Initialize
    init() {
        this.addBookmarkButton();
    }
};

// Initialize bookmark system on tutorial pages
// DISABLED: Bookmark feature removed - no bookmarks.html page exists to display saved bookmarks
// if (document.querySelector('.tutorial-content')) {
//     BookmarkSystem.init();
// }

/**
 * AITutor Chat Widget
 * Floating chat interface for context-aware tutoring
 * Integrates with AITutor backend API
 */

class AITutorWidget {
    constructor() {
        // AI Tutor now integrated into main Flask server - no separate backend needed!
        // Uses same server for both website and AI chat
        this.API_URL = window.location.origin; // Will be http://localhost:5000 locally, https://nebaz-ai.local in production
        
        this.isOpen = false;
        this.isMaximized = false;
        this.chatHistory = [];
        this.dailyLimit = 20;
        this.storageKey = 'AITutor_requests';
        
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
                <!-- Floating Button -->
                <button id="aitutor-button" class="aitutor-fab" title="Ask AITutor">
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
                                <h3>AITutor</h3>
                                <p class="aitutor-status">Online • Ready to help</p>
                            </div>
                        </div>
                        <div class="aitutor-header-actions">
                            <button id="aitutor-maximize" class="aitutor-maximize-btn" title="Maximize">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                                </svg>
                            </button>
                            <button id="aitutor-close" class="aitutor-close-btn" title="Close">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Messages -->
                    <div id="aitutor-messages" class="aitutor-messages">
                        <div class="aitutor-message aitutor-bot">
                            <div class="aitutor-message-content">
                                <p>👋 Hi! I'm AITutor, your friendly AI assistant for this tutorial.</p>
                                <p>Ask me anything about the topic, and I'll explain it in simple terms! 🎯</p>
                            </div>
                        </div>
                        
                        <!-- Suggested Questions (shown only when chat is empty) -->
                        <div id="aitutor-suggestions" class="aitutor-suggestions">
                            <p class="aitutor-suggestions-title">Try asking:</p>
                            <button class="aitutor-suggestion-btn" data-question="Summarize this tutorial in simple terms">
                                📝 Summarize this tutorial
                            </button>
                            <button class="aitutor-suggestion-btn" data-question="What are the key points I should remember?">
                                ⭐ Key points to remember
                            </button>
                            <button class="aitutor-suggestion-btn" data-question="Can you give me a practical example?">
                                💡 Give me an example
                            </button>
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
        const maximizeBtn = document.getElementById('aitutor-maximize');
        const sendBtn = document.getElementById('aitutor-send');
        const input = document.getElementById('aitutor-input');
        
        button.addEventListener('click', () => this.togglePanel());
        closeBtn.addEventListener('click', () => this.togglePanel());
        maximizeBtn.addEventListener('click', () => this.toggleMaximize());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Send on Enter (Shift+Enter for new line)
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Suggested question buttons
        const suggestionBtns = document.querySelectorAll('.aitutor-suggestion-btn');
        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                input.value = question;
                this.sendMessage();
            });
        });
    }
    
    togglePanel() {
        const panel = document.getElementById('aitutor-panel');
        const button = document.getElementById('aitutor-button');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            panel.classList.remove('aitutor-hidden');
            button.classList.add('aitutor-hidden');
            document.getElementById('aitutor-input').focus();
        } else {
            panel.classList.add('aitutor-hidden');
            button.classList.remove('aitutor-hidden');
        }
    }
    
    toggleMaximize() {
        const panel = document.getElementById('aitutor-panel');
        const maximizeBtn = document.getElementById('aitutor-maximize');
        
        this.isMaximized = !this.isMaximized;
        
        if (this.isMaximized) {
            panel.classList.add('maximized');
            maximizeBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                </svg>
            `;
            maximizeBtn.title = 'Minimize';
        } else {
            panel.classList.remove('maximized');
            maximizeBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
            `;
            maximizeBtn.title = 'Maximize';
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
    
    async sendMessage() {
        const input = document.getElementById('aitutor-input');
        const question = input.value.trim();
        
        if (!question) {
            return;
        }
        
        // Hide suggestions after first message
        const suggestions = document.getElementById('aitutor-suggestions');
        if (suggestions) {
            suggestions.classList.add('aitutor-hidden');
        }
        
        // Check daily limit
        if (!this.checkDailyLimit()) {
            document.getElementById('aitutor-limit-warning').classList.remove('aitutor-hidden');
            return;
        }
        
        // Clear input
        input.value = '';
        
        // Add user message to chat
        this.addMessage(question, 'user');
        
        // Show loading state
        const loadingId = this.addMessage('Thinking...', 'bot', true);
        
        try {
            // Extract context from current page
            const context = this.extractPageContext();
            
            // Call API (now integrated into Flask server)
            const response = await fetch(`${this.API_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: question,
                    context: context
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || error.detail || 'Failed to get response');
            }
            
            const data = await response.json();
            
            // Remove loading message
            this.removeMessage(loadingId);
            
            // Add AI response
            this.addMessage(data.answer, 'bot');
            
            // Increment request count
            this.incrementRequestCount();
            
            // Update status
            const remaining = this.getRemainingRequests();
            if (remaining <= 5) {
                this.updateStatus(`${remaining} questions remaining today`);
            }
            
        } catch (error) {
            console.error('AITutor error:', error);
            
            // Remove loading message
            this.removeMessage(loadingId);
            
            // Show error message
            this.addMessage(
                `Sorry, I encountered an error: ${error.message}. Please try again in a moment.`,
                'bot',
                false,
                true
            );
        }
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
        const status = document.querySelector('.aitutor-status');
        if (status) {
            status.textContent = text;
        }
    }
}

// Initialize widget when DOM is ready
console.log('🤖 [AITutor] Script loaded, initializing widget...');
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🤖 [AITutor] DOM ready, creating widget instance');
        new AITutorWidget();
    });
} else {
    console.log('🤖 [AITutor] DOM already ready, creating widget instance now');
    new AITutorWidget();
}

// ============================================
// Newsletter Subscription
// ============================================
class NewsletterHandler {
    constructor() {
        this.form = document.getElementById('newsletter-form');
        this.emailInput = document.getElementById('newsletter-email');
        this.messageDiv = document.getElementById('newsletter-message');
        this.submitBtn = null;
        this.storageKey = 'newsletter_subscribed';
        
        if (this.form) {
            this.submitBtn = this.form.querySelector('.newsletter-btn');
            this.init();
        }
    }
    
    init() {
        // Check if already subscribed
        if (this.isAlreadySubscribed()) {
            this.showMessage('You\'re already subscribed! 🎉', 'success');
            this.disableForm();
            return;
        }
        
        // Attach form submit handler
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    isAlreadySubscribed() {
        const subscribed = localStorage.getItem(this.storageKey);
        return subscribed === 'true';
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const email = this.emailInput.value.trim().toLowerCase();
        
        // Basic validation
        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Disable button during submission
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Subscribing...';
        
        try {
            const response = await fetch(`${window.location.origin}/api/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Success!
                this.showMessage(data.message, 'success');
                localStorage.setItem(this.storageKey, 'true');
                this.disableForm();
                this.emailInput.value = '';
            } else {
                // Error from server
                this.showMessage(data.message, 'error');
                this.submitBtn.disabled = false;
                this.submitBtn.textContent = 'Subscribe';
            }
            
        } catch (error) {
            // Network or other error
            console.error('Newsletter subscription error:', error);
            this.showMessage('Unable to subscribe. Please try again later.', 'error');
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = 'Subscribe';
        }
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    showMessage(message, type) {
        this.messageDiv.textContent = message;
        this.messageDiv.className = `newsletter-message show ${type}`;
    }
    
    disableForm() {
        this.emailInput.disabled = true;
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = '✓ Subscribed';
    }
}

// Initialize newsletter handler when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new NewsletterHandler());
} else {
    new NewsletterHandler();
}
