/**
 * common.js - Centralized HTML Components & Features
 * 
 * This file manages all common HTML structures across tutorial pages.
 * When you add/modify features here, all 50+ tutorials update automatically.
 * 
 * Usage: Add <script src="../../common.js"></script> before closing </body> tag
 */

// ============================================
// CONFIGURATION (from js/config.js when loaded)
// ============================================
const CONFIG = typeof SITE_CONFIG !== 'undefined' ? {
    siteName: SITE_CONFIG.siteName,
    siteURL: SITE_CONFIG.siteURL || 'https://nebaz-ai.local',
    siteIcon: '🇪🇹',
    siteSlug: SITE_CONFIG.siteSlug,
    founderName: SITE_CONFIG.founderName,
    curriculumVersion: SITE_CONFIG.curriculumVersion,
    enableComments: SITE_CONFIG.enableComments,
    enableAITeacher: SITE_CONFIG.enableAITeacher,
    enableAutoSEO: true,
    enableMonetization: SITE_CONFIG.enableMonetization,
    aiTier: SITE_CONFIG.aiTier,
    commentsAPI: SITE_CONFIG.commentsAPI,
    aiTeacherAPI: SITE_CONFIG.aiTeacherAPI
} : {
    siteName: 'Nebaz AI Academy',
    siteURL: 'https://nebaz-ai.local',
    siteIcon: '🇪🇹',
    enableComments: false,
    enableAITeacher: true,
    enableAutoSEO: true,
    commentsAPI: '/api/comments',
    aiTeacherAPI: '/api/ai-teacher'
};

// ============================================
// SEO META TAGS INJECTION
// ============================================
function injectSEOTags() {
    if (!CONFIG.enableAutoSEO) return;
    
    const pageTitle = document.querySelector('h1')?.textContent || document.title;
    const metaDescription = document.querySelector('meta[name="description"]')?.content || '';
    const currentURL = window.location.href;
    const canonicalURL = currentURL.split('?')[0]; // Remove query params
    
    // Extract keywords from page content
    const keywords = extractKeywords();
    
    // Add missing meta tags
    addMetaTag('keywords', keywords.join(', '));
    addMetaTag('author', CONFIG.siteName);
    addMetaTag('robots', 'index, follow');
    
    // Add canonical link
    addLinkTag('canonical', canonicalURL);
    
    // Open Graph tags
    addMetaTag('og:type', 'article', 'property');
    addMetaTag('og:url', canonicalURL, 'property');
    addMetaTag('og:title', pageTitle + ' - ' + CONFIG.siteName, 'property');
    addMetaTag('og:description', metaDescription, 'property');
    addMetaTag('og:site_name', CONFIG.siteName, 'property');
    
    // Twitter Card tags
    addMetaTag('twitter:card', 'summary_large_image');
    addMetaTag('twitter:title', pageTitle + ' - ' + CONFIG.siteName);
    addMetaTag('twitter:description', metaDescription);
    
    // Structured data
    injectStructuredData(pageTitle, metaDescription, canonicalURL, keywords);
}

function addMetaTag(name, content, propertyType = 'name') {
    if (!content) return;
    
    // Check if tag already exists
    const existingTag = document.querySelector(`meta[${propertyType}="${name}"]`);
    if (existingTag) {
        existingTag.setAttribute('content', content);
    } else {
        const meta = document.createElement('meta');
        meta.setAttribute(propertyType, name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
    }
}

function addLinkTag(rel, href) {
    const existingLink = document.querySelector(`link[rel="${rel}"]`);
    if (!existingLink) {
        const link = document.createElement('link');
        link.setAttribute('rel', rel);
        link.setAttribute('href', href);
        document.head.appendChild(link);
    }
}

function extractKeywords() {
    const keywords = new Set(['artificial intelligence', 'AI tutorial', CONFIG.siteName]);
    
    // Extract from page title
    const title = document.querySelector('h1')?.textContent || '';
    const titleWords = title.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    titleWords.forEach(w => keywords.add(w));
    
    // Extract from headings
    document.querySelectorAll('h2, h3').forEach(heading => {
        const text = heading.textContent.toLowerCase();
        if (text.includes('machine learning')) keywords.add('machine learning');
        if (text.includes('deep learning')) keywords.add('deep learning');
        if (text.includes('neural network')) keywords.add('neural network');
        if (text.includes('python')) keywords.add('python programming');
        if (text.includes('data')) keywords.add('data science');
    });
    
    // Get category from URL
    const urlPath = window.location.pathname;
    if (urlPath.includes('/python/')) keywords.add('python tutorial');
    if (urlPath.includes('/machine-learning/')) keywords.add('machine learning tutorial');
    if (urlPath.includes('/ai-for-everyone/')) keywords.add('AI for beginners');
    if (urlPath.includes('/deep-learning/')) keywords.add('deep learning tutorial');
    
    return Array.from(keywords).slice(0, 10); // Limit to 10 keywords
}

function injectStructuredData(title, description, url, keywords) {
    // Article Schema
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": title,
        "description": description,
        "author": {
            "@type": "Organization",
            "name": CONFIG.siteName,
            "url": CONFIG.siteURL
        },
        "publisher": {
            "@type": "Organization",
            "name": CONFIG.siteName,
            "logo": {
                "@type": "ImageObject",
                "url": CONFIG.siteURL + "/assets/images/logo.svg"
            }
        },
        "datePublished": "2025-10-26",
        "dateModified": new Date().toISOString().split('T')[0],
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
        },
        "keywords": keywords.join(', '),
        "inLanguage": "en-US",
        "isAccessibleForFree": true,
        "educationalLevel": "Beginner",
        "learningResourceType": "Tutorial"
    };
    
    // Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": []
    };
    
    // Extract breadcrumb from page
    const breadcrumbDiv = document.querySelector('.tutorial-breadcrumb');
    if (breadcrumbDiv) {
        const links = breadcrumbDiv.querySelectorAll('a');
        links.forEach((link, index) => {
            breadcrumbSchema.itemListElement.push({
                "@type": "ListItem",
                "position": index + 1,
                "name": link.textContent.trim(),
                "item": link.href
            });
        });
        // Add current page
        breadcrumbSchema.itemListElement.push({
            "@type": "ListItem",
            "position": links.length + 1,
            "name": title,
            "item": url
        });
    }
    
    // Inject schemas
    const scriptTag1 = document.createElement('script');
    scriptTag1.type = 'application/ld+json';
    scriptTag1.textContent = JSON.stringify(articleSchema);
    document.head.appendChild(scriptTag1);
    
    if (breadcrumbSchema.itemListElement.length > 0) {
        const scriptTag2 = document.createElement('script');
        scriptTag2.type = 'application/ld+json';
        scriptTag2.textContent = JSON.stringify(breadcrumbSchema);
        document.head.appendChild(scriptTag2);
    }
}

// ============================================
// NAVIGATION BAR
// ============================================
// ============================================
// NAVIGATION BAR
// ============================================
function injectNavbar() {
    // Navigation is now handled by navigation.js
    // This function is kept for backward compatibility but does nothing
    // To update navigation, edit navigation.js instead
    console.log('ℹ️ Navigation is managed by navigation.js');
}

// ============================================
// FEEDBACK & SOCIAL SHARING SYSTEM
// ============================================
async function injectFeedbackAndSharing() {
    console.log('🔍 injectFeedbackAndSharing called');
    const tutorialNav = document.querySelector('.tutorial-nav, .tutorial-navigation');
    console.log('📍 tutorialNav found:', tutorialNav);
    if (!tutorialNav) {
        console.log('❌ No tutorial navigation found, skipping feedback');
        return;
    }

    const tutorialUrl = window.location.pathname;
    const API_BASE = `${window.location.origin}/api`;

    // Generate unique user ID
    function getUserId() {
        let userId = localStorage.getItem('votingUserId');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('votingUserId', userId);
        }
        return userId;
    }

    // Get vote counts from API
    async function getVoteCounts() {
        const tutorialName = tutorialUrl.split('/').pop();
        
        // Local fallback key
        const localCountsKey = 'local_votes_' + tutorialName;
        const getLocalCounts = () => {
            const counts = JSON.parse(localStorage.getItem(localCountsKey) || '{}');
            return {
                helpful: counts.helpful || 0,
                love: counts.love || 0,
                confused: counts.confused || 0,
                'not-helpful': counts.notHelpful || 0
            };
        };

        if (window.location.protocol === 'file:') {
            return getLocalCounts();
        }

        try {
            console.log('📊 Fetching vote counts...');
            const response = await fetch(`${API_BASE}/votes/${tutorialName}`);
            const counts = await response.json();
            console.log('📊 Vote counts received:', counts);
            return {
                helpful: counts.helpful || 0,
                love: counts.love || 0,
                confused: counts.confused || 0,
                'not-helpful': counts.notHelpful || 0
            };
        } catch (error) {
            console.error('❌ Error fetching vote counts, using local cache:', error);
            return getLocalCounts();
        }
    }

    // Check if user voted
    function getUserVote() {
        const votedTutorials = JSON.parse(localStorage.getItem('votedTutorials') || '{}');
        return votedTutorials[tutorialUrl] || null;
    }

    // Save user vote
    function saveUserVote(reaction) {
        const votedTutorials = JSON.parse(localStorage.getItem('votedTutorials') || '{}');
        votedTutorials[tutorialUrl] = reaction;
        localStorage.setItem('votedTutorials', JSON.stringify(votedTutorials));
    }

    // Initialize feedback section
    console.log('🎬 Starting feedback initialization...');
    
    // Try to get vote counts, but use defaults if it fails or takes too long
    let voteCounts = { helpful: 0, love: 0, confused: 0, 'not-helpful': 0 };
    try {
        voteCounts = await Promise.race([
            getVoteCounts(),
            new Promise((resolve) => setTimeout(() => resolve({ helpful: 0, love: 0, confused: 0, 'not-helpful': 0 }), 2000))
        ]);
        console.log('✅ Vote counts loaded:', voteCounts);
    } catch (error) {
        console.warn('⚠️ Could not load vote counts, using defaults:', error);
    }
    
    const userVote = getUserVote();
    console.log('👤 User vote:', userVote);

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
        <div class="feedback-thanks" style="display: ${userVote ? 'flex' : 'none'};">
            <span class="thanks-emoji">🎉</span>
            <span class="thanks-message">Thanks for your feedback!</span>
        </div>
    `;

    tutorialNav.parentNode.insertBefore(feedbackSection, tutorialNav);
    console.log('✅ Feedback section injected');

    // Handle feedback clicks
    const feedbackBtns = feedbackSection.querySelectorAll('.feedback-btn');
    feedbackBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const reaction = btn.dataset.reaction;
            const userId = getUserId();
            const tutorialName = tutorialUrl.split('/').pop();

            console.log('👆 Vote button clicked:', reaction);

            const handleLocalVote = () => {
                const localCountsKey = 'local_votes_' + tutorialName;
                const counts = JSON.parse(localStorage.getItem(localCountsKey) || '{"helpful":0,"love":0,"confused":0,"notHelpful":0}');
                
                const oldVote = getUserVote();
                if (oldVote) {
                    const oldKey = oldVote === 'not-helpful' ? 'notHelpful' : oldVote;
                    if (counts[oldKey] > 0) counts[oldKey]--;
                }
                
                const newKey = reaction === 'not-helpful' ? 'notHelpful' : reaction;
                counts[newKey] = (counts[newKey] || 0) + 1;
                
                localStorage.setItem(localCountsKey, JSON.stringify(counts));
                
                // Update UI counts
                feedbackBtns.forEach(b => {
                    const r = b.dataset.reaction;
                    const countSpan = b.querySelector('.feedback-count');
                    const k = r === 'not-helpful' ? 'notHelpful' : r;
                    const count = counts[k] || 0;
                    countSpan.textContent = count > 0 ? count : '';
                    b.classList.remove('selected');
                });
                
                btn.classList.add('selected');
                saveUserVote(reaction);
                feedbackSection.querySelector('.feedback-thanks').style.display = 'flex';
            };

            if (window.location.protocol === 'file:') {
                handleLocalVote();
                return;
            }

            try {
                console.log('📤 Submitting vote:', { tutorial: tutorialName, reaction, userId });
                
                const response = await fetch(`${API_BASE}/vote`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tutorial: tutorialName, reaction, userId })
                });

                console.log('📥 Response status:', response.status);
                
                if (!response.ok) {
                    throw new Error('Failed to submit vote');
                }

                const updatedCounts = await response.json();
                console.log('✅ Updated counts:', updatedCounts);

                // Update counts
                feedbackBtns.forEach(b => {
                    const r = b.dataset.reaction;
                    const countSpan = b.querySelector('.feedback-count');
                    const countKey = r === 'not-helpful' ? 'notHelpful' : r;
                    const count = updatedCounts[countKey] || 0;
                    countSpan.textContent = count > 0 ? count : '';
                    b.classList.remove('selected');
                });

                btn.classList.add('selected');
                saveUserVote(reaction);
                feedbackSection.querySelector('.feedback-thanks').style.display = 'flex';
            } catch (error) {
                console.error('Error submitting vote, falling back to local storage:', error);
                handleLocalVote();
            }
        });
    });

    // Add social share buttons
    addSocialShareButtons(feedbackSection);
}

function addSocialShareButtons(feedbackSection) {
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
               target="_blank" rel="noopener noreferrer" class="share-btn twitter-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span>Twitter</span>
            </a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}" 
               target="_blank" rel="noopener noreferrer" class="share-btn linkedin-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}" 
               target="_blank" rel="noopener noreferrer" class="share-btn facebook-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
            </a>
            <button class="share-btn copy-link-btn" onclick="window.NebazAcademy.copyPageLink()" aria-label="Copy link">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <span>Copy Link</span>
            </button>
        </div>
    `;

    feedbackSection.parentNode.insertBefore(shareSection, feedbackSection.nextSibling);
}

// ============================================
// FOOTER
// ============================================
function injectFooter() {
    // Check if footer already exists (for course hub pages with hardcoded footer)
    if (document.querySelector('footer.footer')) {
        return;
    }
    
    const p = window.location.pathname.includes('/tutorials/') ? '../../' : '../';
    const founder = CONFIG.founderName || 'Nebaz';
    const email = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.supportEmail) ? SITE_CONFIG.supportEmail : 'hello@nebaz-ai.local';
    const ver = CONFIG.curriculumVersion || '2026.06';
    const footerHTML = `
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3 class="footer-brand">${CONFIG.siteName}</h3>
                    <p class="footer-description">Original curriculum by <strong>${founder}</strong> for Ethiopia. Not affiliated with external tutorial or affiliate sites.</p>
                    <p style="margin-top:0.75rem;font-size:0.85rem;"><a href="${p}about.html">About</a> · <a href="${p}terms.html">Terms</a> · <a href="${p}privacy.html">Privacy</a></p>
                </div>
                <div class="footer-section">
                    <h4 class="footer-heading">Learn</h4>
                    <ul class="footer-links">
                        <li><a href="${p}index.html">Home</a></li>
                        <li><a href="${p}courses/ai-engineer-path.html">AI Engineer Path</a></li>
                        <li><a href="${p}progress.html">My progress</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4 class="footer-heading">🇪🇹 Ethiopia focus</h4>
                    <p style="font-size:0.9rem;line-height:1.6;">Local examples, bilingual NLP, ETB-aware deployment notes.</p>
                </div>
                <div class="footer-section">
                    <h4 class="footer-heading">Contact</h4>
                    <a href="mailto:${email}" style="color:#a7f3d0;">${email}</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 ${CONFIG.siteName} · Curriculum v${ver}</p>
            </div>
        </div>
    </footer>
    `;
    
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// ============================================
// AI TEACHER WIDGET (Future Feature)
// ============================================
function injectAITeacher() {
    if (!CONFIG.enableAITeacher) return;
    if (document.getElementById('aitutor-widget') || document.querySelector('script[data-aitutor]')) return;

    const scripts = document.getElementsByTagName('script');
    let base = 'ai-tutor/frontend/';
    for (const s of scripts) {
        const src = s.getAttribute('src') || '';
        if (src.includes('common.js')) {
            base = src.replace(/js\/common\.js$/, '') + 'ai-tutor/frontend/';
            break;
        }
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = base + 'aitutor-widget.css';
    document.head.appendChild(link);
    const el = document.createElement('script');
    el.src = base + 'aitutor-widget.js';
    el.setAttribute('data-aitutor', '1');
    document.body.appendChild(el);
    return;

    const aiTeacherHTML = `
    <div class="ai-teacher-widget" id="aiTeacherWidget">
        <button class="ai-teacher-toggle" id="aiTeacherToggle" aria-label="Open AI Teacher">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>Ask AI Teacher</span>
        </button>
        
        <div class="ai-teacher-panel" id="aiTeacherPanel" style="display: none;">
            <div class="ai-teacher-header">
                <h3>🤖 AI Teacher</h3>
                <button class="ai-teacher-close" id="aiTeacherClose">&times;</button>
            </div>
            
            <div class="ai-teacher-messages" id="aiTeacherMessages">
                <div class="ai-message">
                    <p>👋 Hi! I'm your AI teaching assistant. Ask me anything about this tutorial!</p>
                </div>
            </div>
            
            <div class="ai-teacher-input">
                <textarea 
                    id="aiTeacherInput" 
                    placeholder="Ask a question about this tutorial..."
                    rows="3"
                ></textarea>
                <button id="aiTeacherSend" class="btn btn-primary">Send</button>
            </div>
        </div>
    </div>
    
    <style>
        .ai-teacher-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
        }
        
        .ai-teacher-toggle {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem 1.5rem;
            background: linear-gradient(135deg, #078930 0%, #0d9488 100%);
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            transition: all 0.3s;
        }
        
        .ai-teacher-toggle:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }
        
        .ai-teacher-panel {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 400px;
            max-height: 600px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .ai-teacher-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            background: linear-gradient(135deg, #078930 0%, #0d9488 100%);
            color: white;
        }
        
        .ai-teacher-header h3 {
            margin: 0;
            font-size: 1.25rem;
        }
        
        .ai-teacher-close {
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            line-height: 1;
        }
        
        .ai-teacher-messages {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem;
            background: #f8fafc;
        }
        
        .ai-message {
            background: white;
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 1rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .user-message {
            background: #078930;
            color: white;
            margin-left: 2rem;
        }
        
        .ai-teacher-input {
            padding: 1rem;
            background: white;
            border-top: 1px solid #e2e8f0;
        }
        
        .ai-teacher-input textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            font-family: inherit;
            resize: none;
        }
        
        .ai-teacher-input button {
            width: 100%;
        }
        
        @media (max-width: 768px) {
            .ai-teacher-panel {
                width: calc(100vw - 40px);
                right: 20px;
            }
        }
    </style>
    `;
    
    // Inject after footer
    document.querySelector('footer').insertAdjacentHTML('afterend', aiTeacherHTML);
    
    // Add event listeners
    setTimeout(() => {
        const toggle = document.getElementById('aiTeacherToggle');
        const panel = document.getElementById('aiTeacherPanel');
        const close = document.getElementById('aiTeacherClose');
        const send = document.getElementById('aiTeacherSend');
        const input = document.getElementById('aiTeacherInput');
        
        toggle.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
        });
        
        close.addEventListener('click', () => {
            panel.style.display = 'none';
        });
        
        send.addEventListener('click', () => sendAIQuestion(input.value));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendAIQuestion(input.value);
            }
        });
    }, 100);
}

async function sendAIQuestion(question) {
    if (!question.trim()) return;
    
    const messagesDiv = document.getElementById('aiTeacherMessages');
    const input = document.getElementById('aiTeacherInput');
    
    // Add user message
    messagesDiv.insertAdjacentHTML('beforeend', `
        <div class="ai-message user-message">
            <p>${question}</p>
        </div>
    `);
    
    input.value = '';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    try {
        // Call AI Teacher API
        const response = await fetch(CONFIG.aiTeacherAPI, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question,
                context: document.querySelector('.tutorial-content')?.innerText.substring(0, 2000) || '',
                pageTitle: document.title
            })
        });
        
        const data = await response.json();
        
        // Add AI response
        messagesDiv.insertAdjacentHTML('beforeend', `
            <div class="ai-message">
                <p>${data.answer}</p>
            </div>
        `);
        
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } catch (error) {
        console.error('AI Teacher error:', error);
        messagesDiv.insertAdjacentHTML('beforeend', `
            <div class="ai-message">
                <p>⚠️ Sorry, I'm having trouble connecting. Please try again.</p>
            </div>
        `);
    }
}

// ============================================
// COMMENTS SECTION (Future Feature)
// ============================================
function injectComments() {
    if (!CONFIG.enableComments) return;
    
    const commentsHTML = `
    <section class="comments-section" id="commentsSection">
        <div class="container">
            <h2 class="comments-title">💬 Comments & Discussion</h2>
            <p class="comments-subtitle">Share your thoughts or ask questions about this tutorial</p>
            
            <div class="comment-form">
                <textarea 
                    id="commentInput" 
                    placeholder="Write your comment here..."
                    rows="4"
                ></textarea>
                <div class="comment-form-actions">
                    <input type="text" id="commentName" placeholder="Your name (optional)" />
                    <button id="submitComment" class="btn btn-primary">Post Comment</button>
                </div>
            </div>
            
            <div class="comments-list" id="commentsList">
                <div class="loading-comments">Loading comments...</div>
            </div>
        </div>
    </section>
    
    <style>
        .comments-section {
            background: #f8fafc;
            padding: 3rem 0;
            margin-top: 3rem;
            border-top: 2px solid #e2e8f0;
        }
        
        .comments-title {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            color: #1e293b;
        }
        
        .comments-subtitle {
            color: #64748b;
            margin-bottom: 2rem;
        }
        
        .comment-form {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .comment-form textarea {
            width: 100%;
            padding: 1rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-family: inherit;
            margin-bottom: 1rem;
            resize: vertical;
        }
        
        .comment-form-actions {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        
        .comment-form-actions input {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
        }
        
        .comments-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .comment-item {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .comment-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.75rem;
        }
        
        .comment-author {
            font-weight: 600;
            color: #1e293b;
        }
        
        .comment-date {
            color: #64748b;
            font-size: 0.875rem;
        }
        
        .comment-text {
            color: #475569;
            line-height: 1.6;
        }
        
        @media (max-width: 768px) {
            .comment-form-actions {
                flex-direction: column;
            }
            
            .comment-form-actions input,
            .comment-form-actions button {
                width: 100%;
            }
        }
    </style>
    `;
    
    // Inject before footer
    document.querySelector('footer').insertAdjacentHTML('beforebegin', commentsHTML);
    
    // Load existing comments
    setTimeout(() => {
        loadComments();
        setupCommentSubmit();
    }, 100);
}

async function loadComments() {
    const commentsList = document.getElementById('commentsList');
    
    try {
        const response = await fetch(`${CONFIG.commentsAPI}?page=${window.location.pathname}`);
        const comments = await response.json();
        
        if (comments.length === 0) {
            commentsList.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
            return;
        }
        
        commentsList.innerHTML = comments.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">${comment.name || 'Anonymous'}</span>
                    <span class="comment-date">${formatDate(comment.date)}</span>
                </div>
                <p class="comment-text">${escapeHtml(comment.text)}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading comments:', error);
        commentsList.innerHTML = '<p class="error-message">Failed to load comments.</p>';
    }
}

function setupCommentSubmit() {
    const submitBtn = document.getElementById('submitComment');
    const input = document.getElementById('commentInput');
    const nameInput = document.getElementById('commentName');
    
    submitBtn.addEventListener('click', async () => {
        const text = input.value.trim();
        if (!text) return;
        
        try {
            const response = await fetch(CONFIG.commentsAPI, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page: window.location.pathname,
                    text: text,
                    name: nameInput.value.trim() || 'Anonymous',
                    date: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                input.value = '';
                nameInput.value = '';
                loadComments();
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment. Please try again.');
        }
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Check if page is a tutorial page (has .tutorial-content)
    const isTutorialPage = document.querySelector('.tutorial-content') !== null;
    
    if (isTutorialPage) {
        console.log('🚀 Common.js: Initializing shared components...');
        
        // Inject SEO tags first
        injectSEOTags();
        
        // Inject common components
        injectNavbar();
        injectFooter();
        
        // Inject feedback and social sharing (async)
        injectFeedbackAndSharing().then(() => {
            console.log('✅ Feedback & Social Sharing loaded');
        });
        
        // Inject future features (only if enabled)
        injectAITeacher();
        injectComments();
        loadBootcampPlus();
        ensureNebazTheme();
        
        console.log('✅ Common.js: All components loaded successfully!');
    }
});

function ensureNebazTheme() {
    if (document.querySelector('link[href*="nebaz-theme.css"]')) return;
    const scripts = document.getElementsByTagName('script');
    let base = 'css/';
    for (const s of scripts) {
        const src = s.getAttribute('src') || '';
        if (src.includes('common.js')) {
            base = src.replace(/js\/common\.js$/, 'css/');
            break;
        }
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = base + 'nebaz-theme.css';
    document.head.appendChild(link);
}

function loadBootcampPlus() {
    if (document.querySelector('script[data-bootcamp-plus]')) return;
    const scripts = document.getElementsByTagName('script');
    let base = 'js/';
    for (const s of scripts) {
        const src = s.getAttribute('src') || '';
        if (src.includes('common.js')) {
            base = src.replace('common.js', '');
            break;
        }
    }
    const el = document.createElement('script');
    el.src = base + 'bootcamp-plus.js';
    el.setAttribute('data-bootcamp-plus', '1');
    document.body.appendChild(el);
}

// ============================================
// EXPORT FOR FUTURE USE
// ============================================
window.NebazAcademy = {
    config: CONFIG,
    enableAITeacher: () => {
        CONFIG.enableAITeacher = true;
        injectAITeacher();
    },
    enableComments: () => {
        CONFIG.enableComments = true;
        injectComments();
    },
    copyPageLink: () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            const btn = document.querySelector('.copy-link-btn span');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            }
        });
    }
};
