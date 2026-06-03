/**
 * Renders curriculum changelog on index and progress pages.
 */
(function () {
    'use strict';

    async function loadChangelog() {
        const depth = window.location.pathname.includes('/courses/') || window.location.pathname.includes('/tutorials/') ? '../' : '';
        try {
            const res = await fetch(`${depth}content/changelog.json`);
            if (!res.ok) throw new Error('fetch failed');
            return await res.json();
        } catch {
            return { version: '2026.06', entries: [{ date: '2026-06-03', title: 'Nebaz AI Academy', items: ['Curriculum live'] }] };
        }
    }

    function render(container, data) {
        if (!container) return;
        const html = data.entries.slice(0, 3).map(e => `
            <div class="changelog-entry" style="margin-bottom:1.25rem;">
                <div style="font-weight:700;color:#0f766e;">${e.date} — ${e.title}</div>
                <ul style="margin:0.5rem 0 0 1.25rem;color:#475569;">${(e.items || []).map(i => `<li>${i}</li>`).join('')}</ul>
            </div>`).join('');
        container.innerHTML = `
            <h2 class="section-title">What's new in AI engineering</h2>
            <p class="section-subtitle">Curriculum v${data.version} · Updated ${data.updated || ''}</p>
            ${html}`;
    }

    document.addEventListener('DOMContentLoaded', async () => {
        const el = document.getElementById('changelog-widget');
        if (el) render(el, await loadChangelog());
        const badge = document.getElementById('curriculum-version-badge');
        if (badge && typeof SITE_CONFIG !== 'undefined') {
            badge.textContent = `Curriculum v${SITE_CONFIG.curriculumVersion}`;
        }
    });
})();
