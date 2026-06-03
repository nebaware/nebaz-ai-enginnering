/**
 * Injects Bootcamp+ banner and Ethiopia context on course/tutorial pages.
 */
(function () {
    'use strict';

    const BOOTCAMP = {
        llmops: {
            title: 'Bootcamp+ LLMOps',
            modules: ['RAG evals (RAGAS-style)', 'Prompt versioning', 'Guardrails', 'Agent tool use', 'ETB cost/latency']
        },
        llms: {
            title: 'Bootcamp+ LLMs',
            modules: ['RAG grounding', 'Fine-tuning adapters', 'Inference on edge', 'Multilingual Amharic+EN']
        },
        agents: {
            title: 'Bootcamp+ AI Agents',
            modules: ['Tool calling', 'Human-in-the-loop', 'Multi-agent patterns', 'Safety evals']
        },
        mlops: {
            title: 'Bootcamp+ MLOps',
            modules: ['CI for ML', 'Model cards', 'Rollback', 'Monitoring on modest hardware']
        },
        'ai-engineer-path': {
            title: 'Bootcamp+ AI Engineer Capstone',
            modules: ['Capstone 1: RAG app', 'Capstone 2: Fine-tune small LM', 'Capstone 3: Agent workflow']
        },
        python: { title: 'Bootcamp+ Python', modules: ['uv tooling', 'Typing', 'Async intro', 'Ethiopia datasets'] },
        'machine-learning': { title: 'Bootcamp+ ML', modules: ['Experiment tracking', 'Leakage', 'sklearn→torch bridge'] },
        'feature-engineering': { title: 'Bootcamp+ FE', modules: ['Pipeline design', 'Telebirr/teff datasets', 'Leakage checks'] }
    };

    const ETHIOPIA_BLURB = 'Examples use Ethiopia-relevant data: Telebirr fraud, teff yield, Amharic RAG, Addis traffic, and ETB-aware deployment.';

    function injectBanner() {
        const el = document.querySelector('.bootcamp-plus-banner[data-course]');
        if (!el) return;
        const key = el.getAttribute('data-course');
        const cfg = BOOTCAMP[key];
        if (!cfg) return;
        const ver = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG.curriculumVersion : '2026.06';
        el.innerHTML = `
            <div style="background:linear-gradient(135deg,#064e3b,#0f766e);color:#ecfdf5;padding:1.25rem 1.5rem;border-radius:12px;margin-bottom:2rem;">
                <div style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;opacity:0.9;">${cfg.title} · v${ver}</div>
                <p style="margin:0.5rem 0 0.75rem;font-size:1.05rem;">${ETHIOPIA_BLURB}</p>
                <ul style="margin:0;padding-left:1.25rem;line-height:1.7;">
                    ${cfg.modules.map(m => `<li>${m}</li>`).join('')}
                </ul>
            </div>`;
    }

    function injectTutorialCallout() {
        if (!window.location.pathname.includes('/tutorials/')) return;
        const h1 = document.querySelector('h1');
        if (!h1 || document.querySelector('.bootcamp-tutorial-callout')) return;
        const path = window.location.pathname;
        let track = '';
        if (path.includes('/llms/')) track = 'llms';
        else if (path.includes('/ai-agents/')) track = 'agents';
        else if (path.includes('/mlops/')) track = 'mlops';
        else if (path.includes('/python/')) track = 'python';
        else if (path.includes('/machine-learning/')) track = 'machine-learning';
        else if (path.includes('/feature-engineering/')) track = 'feature-engineering';
        if (!track || !BOOTCAMP[track]) return;
        const div = document.createElement('div');
        div.className = 'bootcamp-tutorial-callout';
        div.style.cssText = 'background:#ecfdf5;border-left:4px solid #059669;padding:1rem 1.25rem;margin:1rem 0 1.5rem;border-radius:0 8px 8px 0;';
        div.innerHTML = `<strong>Bootcamp+</strong> — ${BOOTCAMP[track].title}. ${ETHIOPIA_BLURB}`;
        h1.parentNode.insertBefore(div, h1.nextSibling);
    }

    document.addEventListener('DOMContentLoaded', () => {
        injectBanner();
        injectTutorialCallout();
    });
})();
