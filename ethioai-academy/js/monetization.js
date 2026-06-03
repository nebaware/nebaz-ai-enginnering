/**
 * Monetization Module for Nebaz AI Academy
 * Handles affiliate links, study pack promos, and analytics tracking
 */

class MonetizationManager {
    constructor() {
        this.affiliatesConfig = null;
        this.analyticsEnabled = false;
        this.init();
    }

    async init() {
        await this.loadAffiliatesConfig();
        this.setupAnalytics();
        this.setupEventTracking();
    }

    async loadAffiliatesConfig() {
        try {
            const response = await fetch('/assets/data/affiliates.json');
            this.affiliatesConfig = await response.json();
            console.log('✅ Monetization config loaded');
        } catch (error) {
            console.warn('⚠️ Could not load affiliates config:', error);
        }
    }

    /**
     * Generate affiliate URL with proper tracking
     */
    getAffiliateUrl(program, params = {}) {
        if (!this.affiliatesConfig) return '#';
        
        const programConfig = this.affiliatesConfig.programs[program];
        if (!programConfig) return '#';

        let url = programConfig.baseUrl;
        
        // Add product-specific path
        if (params.productPath) {
            url += params.productPath;
        }
        
        // Add affiliate parameters
        if (programConfig.referralParam) {
            url += programConfig.referralParam;
        }
        
        // Add tracking parameters
        url += `${url.includes('?') ? '&' : '?'}utm_source=nebaz-ai&utm_medium=referral`;
        
        return url;
    }

    /**
     * Build Amazon affiliate link
     */
    getAmazonLink(asin) {
        const config = this.affiliatesConfig?.programs?.amazon;
        if (!config || config.tag === 'REPLACE_WITH_YOUR_AMAZON_TAG') {
            return `https://www.amazon.in/dp/${asin}`;
        }
        return `https://www.amazon.in/dp/${asin}?tag=${config.tag}`;
    }

    /**
     * Build Udemy affiliate link
     */
    getUdemyLink(courseSlug) {
        const config = this.affiliatesConfig?.programs?.udemy;
        if (!config) {
            return `https://www.udemy.com/course/${courseSlug}/`;
        }
        return `https://www.udemy.com/course/${courseSlug}/${config.referralParam}`;
    }

    /**
     * Inject recommended resources section into tutorial page
     */
    injectRecommendedResources(category, options = {}) {
        if (!this.affiliatesConfig) return;
        
        const products = this.affiliatesConfig.recommendedProducts[category];
        if (!products) return;

        const container = options.container || document.querySelector('.tutorial-content');
        if (!container) return;

        const section = this.buildRecommendedResourcesHTML(products, category);
        
        // Insert before "Next Steps" section or at the end
        const nextSteps = container.querySelector('h2:last-of-type');
        if (nextSteps) {
            nextSteps.insertAdjacentHTML('beforebegin', section);
        } else {
            container.insertAdjacentHTML('beforeend', section);
        }

        console.log(`✅ Recommended resources added for category: ${category}`);
    }

    buildRecommendedResourcesHTML(products, category) {
        const disclosure = this.affiliatesConfig.disclosure;
        
        let html = `
        <div class="recommended-resources">
            <h3>📚 Continue Learning</h3>
            <div class="resource-grid">
        `;

        // Add books
        if (products.books && products.books.length > 0) {
            products.books.slice(0, 2).forEach(book => {
                const url = book.affiliate === 'amazon' 
                    ? this.getAmazonLink(book.asin)
                    : '#';
                
                html += `
                <a href="${url}" 
                   class="resource-card tracked-link" 
                   target="_blank" 
                   rel="noopener nofollow"
                   data-track-event="affiliate_click"
                   data-track-type="book"
                   data-track-title="${book.title}">
                    <span class="resource-icon">${book.icon}</span>
                    <span class="resource-title">${book.title}</span>
                    <span class="resource-type">Book · ${book.price}</span>
                </a>
                `;
            });
        }

        // Add courses
        if (products.courses && products.courses.length > 0) {
            products.courses.slice(0, 2).forEach(course => {
                const url = course.affiliate === 'udemy' 
                    ? this.getUdemyLink(course.courseId)
                    : course.url || '#';
                
                html += `
                <a href="${url}" 
                   class="resource-card tracked-link" 
                   target="_blank" 
                   rel="noopener nofollow"
                   data-track-event="affiliate_click"
                   data-track-type="course"
                   data-track-title="${course.title}">
                    <span class="resource-icon">${course.icon}</span>
                    <span class="resource-title">${course.title}</span>
                    <span class="resource-type">Course · ${course.price}</span>
                </a>
                `;
            });
        }

        // Add tools
        if (products.tools && products.tools.length > 0) {
            products.tools.slice(0, 2).forEach(tool => {
                const url = tool.url || this.getAffiliateUrl(tool.affiliate);
                
                html += `
                <a href="${url}" 
                   class="resource-card tracked-link" 
                   target="_blank" 
                   rel="noopener nofollow"
                   data-track-event="affiliate_click"
                   data-track-type="tool"
                   data-track-title="${tool.title}">
                    <span class="resource-icon">${tool.icon}</span>
                    <span class="resource-title">${tool.title}</span>
                    <span class="resource-type">Tool · ${tool.price}</span>
                </a>
                `;
            });
        }

        html += `
            </div>
            <p class="affiliate-disclosure">
                <small>${disclosure}</small>
            </p>
        </div>
        `;

        return html;
    }

    /**
     * Inject study pack promo
     */
    injectStudyPackPromo(packId, options = {}) {
        if (!this.affiliatesConfig) return;
        
        const pack = this.affiliatesConfig.studyPacks[packId];
        if (!pack) return;

        const container = options.container || document.querySelector('.tutorial-content');
        if (!container) return;

        const sidebar = options.sidebar || false;
        const html = this.buildStudyPackHTML(pack, sidebar);
        
        if (sidebar) {
            // Add to sidebar or after second h2
            const secondH2 = container.querySelectorAll('h2')[1];
            if (secondH2) {
                secondH2.insertAdjacentHTML('afterend', html);
            }
        } else {
            container.insertAdjacentHTML('beforeend', html);
        }

        console.log(`✅ Study pack promo added: ${pack.title}`);
    }

    buildStudyPackHTML(pack, sidebar = false) {
        const className = sidebar ? 'sidebar-study-pack' : 'study-pack-promo';
        
        let html = `
        <div class="${className}">
            <div class="promo-badge">💎 Premium</div>
            <h4>${pack.title}</h4>
            <p>${pack.description}</p>
        `;

        if (!sidebar && pack.includes) {
            html += `<ul class="promo-features">`;
            pack.includes.forEach(item => {
                html += `<li>✓ ${item}</li>`;
            });
            html += `</ul>`;
        }

        html += `
            <a href="${pack.gumroadUrl || '#'}" 
               class="btn btn-premium"
               target="_blank"
               rel="noopener"
               data-track-event="study_pack_click"
               data-track-pack="${pack.title}">
                Get for ${pack.price} →
            </a>
            <p class="support-text"><small>Supports free tutorials ❤️</small></p>
        </div>
        `;

        return html;
    }

    /**
     * Setup privacy-friendly analytics (Plausible)
     */
    setupAnalytics() {
        // Check if analytics should be enabled
        const tracking = this.affiliatesConfig?.tracking;
        if (!tracking || !tracking.enabled) return;

        // Plausible Analytics - privacy-friendly, no cookies
        const script = document.createElement('script');
        script.defer = true;
        script.dataset.domain = window.location.hostname;
        script.src = 'https://plausible.io/js/script.js';
        
        // Only load if not localhost
        if (!window.location.hostname.includes('localhost') && 
            !window.location.hostname.includes('127.0.0.1')) {
            document.head.appendChild(script);
            this.analyticsEnabled = true;
            console.log('✅ Analytics enabled (Plausible)');
        }
    }

    /**
     * Setup event tracking for affiliate clicks and conversions
     */
    setupEventTracking() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-track-event]');
            if (!link) return;

            const event = link.dataset.trackEvent;
            const props = {
                type: link.dataset.trackType || 'unknown',
                title: link.dataset.trackTitle || 'unknown',
                url: link.href || 'unknown'
            };

            this.trackEvent(event, props);
        });
    }

    /**
     * Track custom event
     */
    trackEvent(eventName, props = {}) {
        if (!this.analyticsEnabled) return;

        // Send to Plausible
        if (window.plausible) {
            window.plausible(eventName, { props });
        }

        // Console log for debugging
        console.log('📊 Event tracked:', eventName, props);
    }

    /**
     * Auto-detect tutorial category and inject appropriate resources
     */
    autoInject() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.autoInject());
            return;
        }

        // Detect category from URL
        const path = window.location.pathname;
        let category = null;

        if (path.includes('/python/')) category = 'python';
        else if (path.includes('/machine-learning/')) category = 'machine-learning';
        else if (path.includes('/ai-for-everyone/')) category = 'ai-for-everyone';
        else if (path.includes('/chatgpt/')) category = 'chatgpt';

        if (category) {
            // Add small delay to ensure tutorial content is loaded
            setTimeout(() => {
                this.injectRecommendedResources(category);
            }, 500);
        }
    }
    
    /**
     * Inject mini-project into tutorial page
     */
    injectMiniProject(projectId, options = {}) {
        if (!this.affiliatesConfig) return;
        
        const project = this.affiliatesConfig.miniProjects?.[projectId];
        if (!project) {
            console.warn(`Mini-project not found: ${projectId}`);
            return;
        }

        const container = options.container || document.querySelector('.tutorial-content');
        if (!container) return;

        const html = this.buildMiniProjectHTML(project, projectId);
        
        // Insert before navigation or at the end
        const navigation = container.querySelector('.tutorial-navigation');
        if (navigation) {
            navigation.insertAdjacentHTML('beforebegin', html);
        } else {
            container.insertAdjacentHTML('beforeend', html);
        }

        this.setupProjectInteractions();
        console.log(`✅ Mini-project added: ${project.title}`);
    }

    buildMiniProjectHTML(project, projectId) {
        const toolCard = this.buildToolCardForProject(project.tool);
        const stepsHTML = project.steps?.map((step, i) => this.buildStepHTML(step, i + 1)).join('') || '';
        
        return `
        <div class="mini-project-section">
            <div class="mini-project-card">
                <div class="project-badge">🚀 Mini-Project</div>
                <h3>${project.title}</h3>
                <div class="project-meta">
                    <span class="meta-item">⏱️ ${project.duration}</span>
                    <span class="meta-item">⭐ ${project.level}</span>
                    <span class="meta-item">💻 ${project.category || 'Hands-on'}</span>
                </div>
                <p class="project-description">${project.description}</p>
                
                ${project.stats ? this.buildProjectStatsHTML(project.stats) : ''}
                
                <div class="project-tools-needed">
                    <h4>🛠️ You'll Need:</h4>
                    ${toolCard}
                </div>
                
                <button class="expand-project" data-project-id="${projectId}">
                    Start Building →
                </button>
            </div>
            
            <div class="project-content" style="display: none;" data-project-content="${projectId}">
                <div class="project-steps">
                    ${stepsHTML}
                </div>
                
                <div class="project-complete">
                    <h4>🎉 Project Complete!</h4>
                    <p>Share your creation with the community:</p>
                    <button class="btn-share-twitter" 
                            data-project="${project.title}"
                            data-hashtag="Nebaz AI Academy">
                        Share on Twitter
                    </button>
                    <button class="btn-share-linkedin" 
                            data-project="${project.title}">
                        Share on LinkedIn
                    </button>
                </div>
                
                ${project.showcase ? this.buildShowcaseHTML(project.showcase) : ''}
            </div>
        </div>
        `;
    }

    buildToolCardForProject(tool) {
        const affiliateUrl = this.getAffiliateUrl(tool.id) || tool.url || '#';
        
        return `
        <div class="tool-card-project">
            <img src="${tool.logo || '/assets/logos/' + tool.id + '.svg'}" 
                 alt="${tool.name}"
                 onerror="this.style.display='none'">
            <div class="tool-info">
                <strong>${tool.name}</strong>
                <span>${tool.pricing}</span>
            </div>
            <a href="${affiliateUrl}" 
               class="btn-tool-signup"
               target="_blank"
               rel="noopener nofollow"
               data-track-event="project_tool_signup"
               data-tool="${tool.id}"
               data-project="${tool.name}">
                ${tool.ctaText || 'Sign Up Free →'}
            </a>
        </div>
        `;
    }

    buildStepHTML(step, number) {
        return `
        <div class="project-step">
            <h4>Step ${number}: ${step.title}</h4>
            <p>${step.description}</p>
            ${step.code ? `<pre><code class="language-${step.language || 'python'}">${this.escapeHtml(step.code)}</code></pre>` : ''}
            ${step.tip ? `<div class="info-box">💡 <strong>Tip:</strong> ${step.tip}</div>` : ''}
        </div>
        `;
    }

    buildProjectStatsHTML(stats) {
        return `
        <div class="project-stats">
            ${stats.students ? `<span>👥 ${stats.students} students built this</span>` : ''}
            ${stats.rating ? `<span>⭐ ${stats.rating}/5 rating</span>` : ''}
            ${stats.trending ? `<span>🔥 Trending this week</span>` : ''}
        </div>
        `;
    }

    buildShowcaseHTML(showcase) {
        if (!showcase || !showcase.items || showcase.items.length === 0) return '';
        
        const itemsHTML = showcase.items.map(item => `
            <div class="showcase-item">
                <img src="${item.image}" alt="${item.author}'s project">
                <span>${item.author}</span>
            </div>
        `).join('');
        
        return `
        <div class="student-showcase">
            <h4>What Students Built:</h4>
            <div class="showcase-grid">
                ${itemsHTML}
            </div>
        </div>
        `;
    }

    setupProjectInteractions() {
        // Expand/collapse project instructions
        document.querySelectorAll('.expand-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const projectId = e.target.dataset.projectId;
                const card = e.target.closest('.mini-project-card');
                const content = document.querySelector(`[data-project-content="${projectId}"]`);
                
                if (!content) return;
                
                const isExpanded = content.style.display !== 'none';
                content.style.display = isExpanded ? 'none' : 'block';
                btn.textContent = isExpanded ? 'Start Building →' : 'Hide Instructions ↑';
                
                // Track project expansion
                if (!isExpanded) {
                    this.trackEvent('project_expanded', {
                        project: projectId
                    });
                }
                
                // Scroll to project content
                if (!isExpanded) {
                    setTimeout(() => {
                        content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                }
            });
        });
        
        // Social sharing buttons
        document.querySelectorAll('.btn-share-twitter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const projectTitle = e.target.dataset.project;
                const hashtag = e.target.dataset.hashtag || 'Nebaz AI Academy';
                const text = `Just built: ${projectTitle}! 🚀`;
                const url = window.location.href;
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtag}`;
                
                window.open(twitterUrl, '_blank', 'width=600,height=400');
                this.trackEvent('project_shared', { platform: 'twitter', project: projectTitle });
            });
        });
        
        document.querySelectorAll('.btn-share-linkedin').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const url = window.location.href;
                const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                
                window.open(linkedinUrl, '_blank', 'width=600,height=400');
                this.trackEvent('project_shared', { platform: 'linkedin', project: e.target.dataset.project });
            });
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

}

// Initialize monetization manager
const monetization = new MonetizationManager();

// Auto-inject on tutorial pages (can be disabled by setting data-no-monetization)
if (!document.body.dataset.noMonetization) {
    monetization.autoInject();
}

// Export for manual use
window.MonetizationManager = monetization;
