/**
 * Centralized Navigation System
 * This file manages the header navigation across all pages
 * Update navigation items here to reflect changes everywhere
 */

(function() {
    'use strict';
    
    // Navigation configuration
    const navigationConfig = {
        logo: {
            text: 'Nebaz AI Academy',
            icon: '🇪🇹',
            href: 'index.html'
        },
        items: [
            { label: 'Home', href: 'index.html', id: 'home' },
            { label: 'Progress', href: 'progress.html', id: 'progress' },
            { label: 'About', href: 'about.html', id: 'about' },
            { label: '🚀 AI Engineer Path', href: 'courses/ai-engineer-path.html', id: 'ai-engineer-path', highlight: true },
            { label: 'AI for Everyone', href: 'courses/ai-for-everyone.html', id: 'ai-for-everyone' },
            { label: 'Python', href: 'courses/python.html', id: 'python' },
            { label: 'Machine Learning', href: 'courses/machine-learning.html', id: 'machine-learning' },
            { label: 'Deep Learning', href: 'courses/deep-learning.html', id: 'deep-learning' },
            { 
                label: 'More', 
                id: 'more',
                dropdown: [
                    { label: 'ChatGPT Prompt Engineering', href: 'courses/chatgpt-prompt-engineering.html', id: 'chatgpt' },
                    { label: 'AI for Project Managers', href: 'courses/ai-for-project-managers.html', id: 'ai-for-pms' },
                    { label: 'AI for Business Leaders', href: 'courses/ai-for-business-leaders.html', id: 'ai-for-leaders' },
                    { label: 'MLOps Engineer', href: 'courses/mlops-engineer.html', id: 'mlops' },
                    { label: 'Statistics for AI', href: 'courses/statistics-for-ai.html', id: 'statistics' },
                    { label: 'Transformers Architecture', href: 'courses/transformers-architecture.html', id: 'transformers' },
                    { label: 'LLMs & Transformers', href: 'courses/llms-and-transformers.html', id: 'llms' },
                    { label: 'AI Agents', href: 'courses/ai-agents.html', id: 'ai-agents' },
                    { label: 'LLMOps Engineer', href: 'courses/llmops-engineer.html', id: 'llmops-path' }
                ]
            }
        ]
    };
    
    /**
     * Determine the depth level of current page
     * Returns number of '../' needed to reach root
     */
    function getPageDepth() {
        const path = window.location.pathname;
        
        // Root level (index.html)
        if (path.endsWith('index.html') || path.endsWith('/')) {
            return 0;
        }
        
        // Course pages (courses/*.html)
        if (path.includes('/courses/') && !path.includes('/tutorials/')) {
            return 1;
        }
        
        // Tutorial pages (tutorials/*/**.html)
        if (path.includes('/tutorials/')) {
            return 2;
        }

        // certificates/, courses/, about.html at academy root subfolders
        if (path.includes('/certificates/') || path.includes('/courses/')) {
            return 1;
        }
        
        // Default to root
        return 0;
    }
    
    /**
     * Adjust href paths based on page depth
     */
    function adjustPath(href, depth) {
        if (depth === 0) {
            return href;
        } else if (depth === 1) {
            // From courses/ folder
            if (href === 'index.html') {
                return '../index.html';
            }
            if (href.startsWith('courses/')) {
                return href.replace('courses/', '');
            }
            return href;
        } else if (depth === 2) {
            // From tutorials/*/ folder
            if (href === 'index.html') {
                return '../../index.html';
            }
            if (href.startsWith('courses/')) {
                return '../../' + href;
            }
            return href;
        }
        return href;
    }
    
    /**
     * Determine which nav item should be active
     */
    function getActiveNavId() {
        const path = window.location.pathname;
        
        if (path.includes('ai-for-everyone')) return 'ai-for-everyone';
        if (path.includes('chatgpt') || path.includes('prompt-engineering')) return 'chatgpt';
        if (path.includes('ai-for-project-managers') || path.includes('ai-for-pms')) return 'ai-for-pms';
        if (path.includes('ai-for-business-leaders') || path.includes('ai-for-leaders')) return 'ai-for-leaders';
        if (path.includes('ai-engineer-path')) return 'ai-engineer-path';
        if (path.includes('/python')) return 'python';
        if (path.includes('machine-learning')) return 'machine-learning';
        if (path.includes('deep-learning')) return 'deep-learning';
        if (path.includes('mlops')) return 'mlops';
        if (path.includes('statistics')) return 'statistics';
        if (path.includes('transformers')) return 'transformers';
        if (path.includes('llms')) return 'llms';
        if (path.includes('ai-agents')) return 'ai-agents';
        if (path.includes('llmops')) return 'llmops-path';
        if (path.includes('progress.html')) return 'progress';
        if (path.includes('about.html')) return 'about';
        if (path.endsWith('index.html') || path.endsWith('/')) return 'home';
        
        return 'home';
    }
    
    /**
     * Inject favicon dynamically based on page depth
     */
    function injectFavicon() {
        const depth = getPageDepth();
        let prefix = '';
        if (depth === 1) prefix = '../';
        if (depth === 2) prefix = '../../';
        
        const faviconPath = prefix + 'assets/images/logo.svg';
        
        // Check if favicon already exists
        let favicon = document.querySelector('link[rel="icon"]') || 
                      document.querySelector('link[rel="shortcut icon"]');
        
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            favicon.type = 'image/png';
            document.head.appendChild(favicon);
        }
        favicon.href = faviconPath;
        
        // Add apple-touch-icon for iOS
        let appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
        if (!appleIcon) {
            appleIcon = document.createElement('link');
            appleIcon.rel = 'apple-touch-icon';
            document.head.appendChild(appleIcon);
        }
        appleIcon.href = faviconPath;
    }
    
    /**
     * Create and inject navigation HTML
     */
    function injectNavigation() {
        // Check if navigation already exists
        const existingNav = document.querySelector('nav.navbar');
        if (existingNav) {
            existingNav.remove();
        }
        
        const depth = getPageDepth();
        const activeId = getActiveNavId();
        
        // Create navigation HTML
        const nav = document.createElement('nav');
        nav.className = 'navbar';
        nav.id = 'navbar';
        
        const logoHref = adjustPath(navigationConfig.logo.href, depth);
        
        nav.innerHTML = `
            <div class="nav-container">
                <a href="${logoHref}" class="logo">
                    <span class="logo-icon">${navigationConfig.logo.icon}</span>
                    <span class="logo-text">${navigationConfig.logo.text}</span>
                </a>
                
                <button class="hamburger" id="hamburger" aria-label="Toggle navigation">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                
                <ul class="nav-menu" id="navMenu">
                    ${navigationConfig.items.map(item => {
                        if (item.dropdown) {
                            // Dropdown menu item
                            const hasActiveChild = item.dropdown.some(child => child.id === activeId);
                            const activeClass = hasActiveChild ? ' active' : '';
                            return `
                    <li class="nav-item-dropdown">
                        <button class="nav-link dropdown-toggle${activeClass}">${item.label} <span class="dropdown-arrow">▼</span></button>
                        <ul class="dropdown-menu">
                            ${item.dropdown.map(child => {
                                const href = adjustPath(child.href, depth);
                                const childActiveClass = child.id === activeId ? ' active' : '';
                                return `<li><a href="${href}" class="dropdown-link${childActiveClass}">${child.label}</a></li>`;
                            }).join('\n                            ')}
                        </ul>
                    </li>`;
                        } else {
                            // Regular menu item
                            const href = adjustPath(item.href, depth);
                            const activeClass = item.id === activeId ? ' active' : '';
                            const highlightClass = item.highlight ? ' highlight' : '';
                            return `<li><a href="${href}" class="nav-link${activeClass}${highlightClass}">${item.label}</a></li>`;
                        }
                    }).join('\n                    ')}
                </ul>
            </div>
        `;
        
        // Insert navigation at the beginning of body
        document.body.insertBefore(nav, document.body.firstChild);
        
        // Initialize dropdowns and mobile menu
        initializeDropdowns();
        initializeMobileMenu();
        
        // Inject favicon
        injectFavicon();
    }
    
    /**
     * Initialize dropdown menus
     */
    function initializeDropdowns() {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            // Desktop: hover
            const parent = toggle.closest('.nav-item-dropdown');
            
            parent.addEventListener('mouseenter', function() {
                if (window.innerWidth >= 768) {
                    toggle.classList.add('open');
                }
            });
            
            parent.addEventListener('mouseleave', function() {
                if (window.innerWidth >= 768) {
                    toggle.classList.remove('open');
                }
            });
            
            // Mobile: click
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other dropdowns
                dropdownToggles.forEach(otherToggle => {
                    if (otherToggle !== toggle) {
                        otherToggle.classList.remove('open');
                    }
                });
                
                toggle.classList.toggle('open');
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-item-dropdown')) {
                dropdownToggles.forEach(toggle => {
                    toggle.classList.remove('open');
                });
            }
        });
    }
    
    /**
     * Initialize mobile menu hamburger functionality
     */
    function initializeMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                const isClickInsideNav = event.target.closest('.navbar');
                if (!isClickInsideNav && navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
            
            // Close menu when clicking on a dropdown link
            const dropdownLinks = navMenu.querySelectorAll('.dropdown-link');
            dropdownLinks.forEach(link => {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }
    
    // Inject navigation when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectNavigation);
    } else {
        injectNavigation();
    }
})();
