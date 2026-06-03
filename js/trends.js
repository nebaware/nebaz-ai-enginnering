/**
 * Nebaz AI Academy — Real-Time AI Trends Radar
 * Fetches live data from GitHub (AI repos), arXiv (latest papers),
 * and Hugging Face (trending models). Falls back to curated offline data.
 */

(function () {
    'use strict';

    // ─── Fallback / Seed Data (2025-2026 breakthroughs) ─────────────────────
    const OFFLINE_FALLBACK = {
        github: [
            { name: 'ollama/ollama',        desc: 'Run LLMs locally on your machine (macOS, Windows, Linux)', stars: 112000, url: 'https://github.com/ollama/ollama',        lang: 'Go' },
            { name: 'langchain-ai/langchain',desc: 'Build context-aware reasoning applications with LLMs',   stars: 95000,  url: 'https://github.com/langchain-ai/langchain', lang: 'Python' },
            { name: 'ggerganov/llama.cpp',  desc: 'LLM inference in pure C/C++',                             stars: 71000,  url: 'https://github.com/ggerganov/llama.cpp',   lang: 'C++' },
            { name: 'huggingface/transformers', desc: 'State-of-the-art Machine Learning for JAX, PyTorch and TensorFlow', stars: 135000, url: 'https://github.com/huggingface/transformers', lang: 'Python' },
            { name: 'vllm-project/vllm',    desc: 'High-throughput and memory-efficient inference for LLMs', stars: 42000,  url: 'https://github.com/vllm-project/vllm',     lang: 'Python' },
            { name: 'microsoft/autogen',    desc: 'Multi-agent conversation framework for LLMs',             stars: 37000,  url: 'https://github.com/microsoft/autogen',     lang: 'Python' },
        ],
        arxiv: [
            { title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning', authors: 'DeepSeek AI', date: '2025-01', url: 'https://arxiv.org/abs/2501.12948', tag: 'Reasoning' },
            { title: 'Llama 3.3: Herd of Models',                                                           authors: 'Meta AI',       date: '2024-12', url: 'https://arxiv.org/abs/2407.21783', tag: 'Foundational' },
            { title: 'Gemini 2.0: Our New AI Model for the Agentic Era',                                    authors: 'Google DeepMind',date: '2025-02', url: 'https://deepmind.google/technologies/gemini/', tag: 'Multimodal' },
            { title: 'Constitutional AI: Harmlessness from AI Feedback',                                    authors: 'Anthropic',     date: '2022-12', url: 'https://arxiv.org/abs/2212.08073', tag: 'Alignment' },
            { title: 'Attention Is All You Need (Revisited: 2025 Applications)',                            authors: 'Google Brain',  date: '2017-06', url: 'https://arxiv.org/abs/1706.03762', tag: 'Architecture' },
            { title: 'RLHF: Training language models to follow instructions with human feedback',           authors: 'OpenAI',        date: '2022-03', url: 'https://arxiv.org/abs/2203.02155', tag: 'Training' },
        ],
        models: [
            { name: 'deepseek-ai/DeepSeek-R1',         desc: 'First-class reasoning model rivaling o1',               downloads: '8.2M',  tag: 'Reasoning' },
            { name: 'meta-llama/Llama-3.3-70B-Instruct',desc: 'Meta\'s latest open instruction-tuned model',           downloads: '12.1M', tag: 'Chat' },
            { name: 'mistralai/Mistral-7B-Instruct-v0.3',desc: 'Fast, compact, bilingual instruction model',          downloads: '19M',   tag: 'Efficient' },
            { name: 'google/gemma-3-9b-it',            desc: 'Google\'s lightweight open model, instruction-tuned',   downloads: '4.1M',  tag: 'Compact' },
            { name: 'Qwen/Qwen2.5-72B-Instruct',       desc: 'Alibaba\'s SOTA 72B multilingual model',                downloads: '7.8M',  tag: 'Multilingual' },
            { name: 'microsoft/Phi-3.5-mini-instruct', desc: 'Tiny but capable — 3.8B parameters, runs on phones',   downloads: '5.3M',  tag: 'Edge AI' },
        ]
    };

    // ─── Fetch helpers ────────────────────────────────────────────────────────

    async function fetchWithTimeout(url, opts = {}, ms = 5000) {
        const ctrl = new AbortController();
        const id = setTimeout(() => ctrl.abort(), ms);
        try {
            const res = await fetch(url, { ...opts, signal: ctrl.signal });
            return res;
        } finally { clearTimeout(id); }
    }

    async function fetchGitHub() {
        try {
            const res = await fetchWithTimeout(
                'https://api.github.com/search/repositories?q=topic:llm+topic:artificial-intelligence&sort=stars&order=desc&per_page=6',
                { headers: { Accept: 'application/vnd.github.v3+json' } }
            );
            const data = await res.json();
            return (data.items || []).map(r => ({
                name: r.full_name,
                desc: r.description || '',
                stars: r.stargazers_count,
                url: r.html_url,
                lang: r.language || '—'
            }));
        } catch { return null; }
    }

    async function fetchArxiv() {
        try {
            const res = await fetchWithTimeout(
                'https://export.arxiv.org/api/query?search_query=cat:cs.AI+AND+cat:cs.LG&sortBy=submittedDate&sortOrder=descending&max_results=6',
                {}, 6000
            );
            const xml = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(xml, 'application/xml');
            const entries = doc.querySelectorAll('entry');
            return Array.from(entries).map(e => ({
                title: e.querySelector('title')?.textContent?.trim() || 'Untitled',
                authors: e.querySelector('author name')?.textContent?.trim() || 'Unknown',
                date: e.querySelector('published')?.textContent?.slice(0, 7) || '2026',
                url: e.querySelector('id')?.textContent?.trim() || '#',
                tag: 'Latest'
            }));
        } catch { return null; }
    }

    async function fetchHuggingFace() {
        try {
            const res = await fetchWithTimeout(
                'https://huggingface.co/api/models?sort=downloads&direction=-1&limit=6',
                {}, 5000
            );
            const data = await res.json();
            return (Array.isArray(data) ? data : []).map(m => ({
                name: m.id || m.modelId || 'Unknown',
                desc: (m.cardData?.tags || []).join(', ') || 'Trending model',
                downloads: m.downloads ? (m.downloads / 1e6).toFixed(1) + 'M' : '—',
                tag: (m.pipeline_tag || 'AI').replace(/-/g, ' ')
            }));
        } catch { return null; }
    }

    // ─── Rendering ────────────────────────────────────────────────────────────

    function renderGitHub(repos, container) {
        container.innerHTML = repos.map(r => `
            <a href="${r.url}" target="_blank" rel="noopener" class="trend-card github-card">
                <div class="trend-tag">${r.lang}</div>
                <div class="trend-name">${r.name}</div>
                <div class="trend-desc">${r.desc.slice(0, 90)}${r.desc.length > 90 ? '…' : ''}</div>
                <div class="trend-meta">⭐ ${(r.stars / 1000).toFixed(1)}k stars</div>
            </a>
        `).join('');
    }

    function renderArxiv(papers, container) {
        container.innerHTML = papers.map(p => `
            <a href="${p.url}" target="_blank" rel="noopener" class="trend-card arxiv-card">
                <div class="trend-tag">${p.tag}</div>
                <div class="trend-name">${p.title.slice(0, 75)}${p.title.length > 75 ? '…' : ''}</div>
                <div class="trend-desc">${p.authors}</div>
                <div class="trend-meta">📅 ${p.date}</div>
            </a>
        `).join('');
    }

    function renderModels(models, container) {
        container.innerHTML = models.map(m => `
            <a href="https://huggingface.co/${m.name}" target="_blank" rel="noopener" class="trend-card hf-card">
                <div class="trend-tag">${m.tag}</div>
                <div class="trend-name">${m.name}</div>
                <div class="trend-desc">${m.desc.slice(0, 80)}${m.desc.length > 80 ? '…' : ''}</div>
                <div class="trend-meta">⬇️ ${m.downloads} downloads</div>
            </a>
        `).join('');
    }

    function renderSkeleton(container, n = 6) {
        container.innerHTML = Array(n).fill(`
            <div class="trend-card skeleton-card">
                <div class="skel skel-tag"></div>
                <div class="skel skel-title"></div>
                <div class="skel skel-desc"></div>
                <div class="skel skel-meta"></div>
            </div>
        `).join('');
    }

    // ─── Main section builder ─────────────────────────────────────────────────

    function buildTrendsSection() {
        const section = document.createElement('section');
        section.id = 'trends-radar';
        section.className = 'trends-radar-section';
        section.innerHTML = `
            <div class="container">
                <div class="trends-header">
                    <h2 class="trends-title">
                        <span class="trends-pulse"></span>
                        Real-Time AI Engineering Trends Radar
                    </h2>
                    <p class="trends-subtitle">
                        Live insights from GitHub, arXiv research papers &amp; Hugging Face — curated for Ethiopian AI engineers
                    </p>
                    <div class="trends-tabs" id="trends-tabs">
                        <button class="trends-tab active" data-tab="github">🔥 GitHub Repos</button>
                        <button class="trends-tab" data-tab="arxiv">📄 Latest Research</button>
                        <button class="trends-tab" data-tab="models">🤗 Trending Models</button>
                    </div>
                </div>

                <div class="trends-panel" id="trends-github">
                    <div class="trends-grid" id="github-grid"></div>
                </div>
                <div class="trends-panel" id="trends-arxiv" style="display:none;">
                    <div class="trends-grid" id="arxiv-grid"></div>
                </div>
                <div class="trends-panel" id="trends-models" style="display:none;">
                    <div class="trends-grid" id="models-grid"></div>
                </div>

                <div class="trends-footer">
                    <span id="trends-status" class="trends-status">🔄 Loading live data…</span>
                    <span style="float:right;font-size:0.8rem;opacity:0.6;">Updated every page load</span>
                </div>
            </div>

            <style>
                .trends-radar-section {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%);
                    padding: 5rem 0 4rem;
                    margin: 3rem 0;
                    position: relative;
                    overflow: hidden;
                }
                .trends-radar-section::before {
                    content: '';
                    position: absolute;
                    top: -50%; left: -20%;
                    width: 60%; height: 200%;
                    background: radial-gradient(ellipse, rgba(59,130,246,.12) 0%, transparent 70%);
                    pointer-events: none;
                }
                .trends-header { text-align: center; margin-bottom: 2.5rem; }
                .trends-title {
                    font-size: clamp(1.5rem, 3vw, 2.2rem);
                    color: #f1f5f9;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: .75rem;
                    margin-bottom: .75rem;
                }
                .trends-pulse {
                    display: inline-block;
                    width: 12px; height: 12px;
                    border-radius: 50%;
                    background: #22c55e;
                    box-shadow: 0 0 0 0 rgba(34,197,94,.5);
                    animation: pulse-ring 1.8s ease-out infinite;
                }
                @keyframes pulse-ring {
                    0%   { box-shadow: 0 0 0 0 rgba(34,197,94,.5); }
                    70%  { box-shadow: 0 0 0 10px rgba(34,197,94,0); }
                    100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
                }
                .trends-subtitle { color: #94a3b8; font-size: 1rem; margin-bottom: 2rem; }
                .trends-tabs { display: flex; justify-content: center; gap: .5rem; flex-wrap: wrap; }
                .trends-tab {
                    padding: .45rem 1.1rem;
                    border: 1px solid rgba(99,102,241,.4);
                    border-radius: 50px;
                    background: transparent;
                    color: #94a3b8;
                    font-size: .88rem;
                    cursor: pointer;
                    transition: all .2s;
                }
                .trends-tab:hover   { border-color: #6366f1; color: #c7d2fe; }
                .trends-tab.active  { background: #6366f1; border-color: #6366f1; color: #fff; }
                .trends-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 1.25rem;
                }
                .trend-card {
                    background: rgba(30,41,59,.7);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(99,102,241,.2);
                    border-radius: 12px;
                    padding: 1.2rem 1.4rem;
                    text-decoration: none;
                    transition: transform .2s, border-color .2s, box-shadow .2s;
                    display: block;
                }
                .trend-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(99,102,241,.7);
                    box-shadow: 0 8px 24px rgba(99,102,241,.2);
                }
                .trend-tag {
                    display: inline-block;
                    padding: .18rem .55rem;
                    border-radius: 20px;
                    font-size: .72rem;
                    font-weight: 600;
                    margin-bottom: .6rem;
                    text-transform: uppercase;
                    letter-spacing: .05em;
                }
                .github-card .trend-tag { background: rgba(34,197,94,.15); color: #4ade80; }
                .arxiv-card  .trend-tag { background: rgba(245,158,11,.15); color: #fbbf24; }
                .hf-card     .trend-tag { background: rgba(239,68,68,.15);  color: #f87171; }
                .trend-name  { color: #e2e8f0; font-size: .92rem; font-weight: 600; margin-bottom: .4rem; line-height: 1.35; }
                .trend-desc  { color: #94a3b8; font-size: .8rem; margin-bottom: .6rem; line-height: 1.45; }
                .trend-meta  { color: #64748b; font-size: .78rem; }
                /* Skeleton */
                .skeleton-card { cursor: default; }
                .skel { background: linear-gradient(90deg,rgba(51,65,85,.6) 25%,rgba(71,85,105,.6) 50%,rgba(51,65,85,.6) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; margin-bottom: .5rem; }
                .skel-tag   { height: 18px; width: 60px; }
                .skel-title { height: 16px; width: 90%; }
                .skel-desc  { height: 12px; width: 80%; }
                .skel-meta  { height: 12px; width: 50%; }
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
                /* Footer status */
                .trends-footer { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(99,102,241,.15); }
                .trends-status { font-size: .82rem; color: #64748b; }
            </style>
        `;
        return section;
    }

    function initTabs(section) {
        section.querySelectorAll('.trends-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                section.querySelectorAll('.trends-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                section.querySelectorAll('.trends-panel').forEach(p => p.style.display = 'none');
                const target = section.querySelector(`#trends-${tab.dataset.tab}`);
                if (target) target.style.display = 'block';
            });
        });
    }

    // ─── Bootstrap ────────────────────────────────────────────────────────────

    async function init() {
        // Only inject on the homepage / index.html
        const isHome = window.location.pathname.endsWith('index.html') ||
                       window.location.pathname.endsWith('/') ||
                       window.location.pathname === '';
        if (!isHome) return;

        const section = buildTrendsSection();
        const coursesSection = document.getElementById('courses') || document.querySelector('.featured-topics');
        if (!coursesSection) return;
        coursesSection.parentNode.insertBefore(section, coursesSection);
        initTabs(section);

        const ghGrid   = section.querySelector('#github-grid');
        const axGrid   = section.querySelector('#arxiv-grid');
        const hfGrid   = section.querySelector('#models-grid');
        const status   = section.querySelector('#trends-status');

        // Show skeletons immediately
        renderSkeleton(ghGrid); renderSkeleton(axGrid); renderSkeleton(hfGrid);

        const [ghData, axData, hfData] = await Promise.all([fetchGitHub(), fetchArxiv(), fetchHuggingFace()]);

        let src = '✅ Live data';
        if (!ghData && !axData && !hfData) src = '📴 Offline – showing curated data';

        renderGitHub(ghData || OFFLINE_FALLBACK.github,  ghGrid);
        renderArxiv (axData || OFFLINE_FALLBACK.arxiv,   axGrid);
        renderModels(hfData || OFFLINE_FALLBACK.models,  hfGrid);
        status.textContent = `${src} · ${new Date().toLocaleTimeString()}`;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
