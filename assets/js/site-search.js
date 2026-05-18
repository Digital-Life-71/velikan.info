(function () {
    const script = document.currentScript;
    const siteRoot = script?.dataset.siteRoot || '';
    let searchIndexPromise;

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function loadIndex() {
        if (!searchIndexPromise) {
            searchIndexPromise = fetch(`${siteRoot}assets/search-index.json`)
                .then((response) => response.ok ? response.json() : [])
                .catch(() => []);
        }

        return searchIndexPromise;
    }

    function score(item, query, tokens) {
        const title = item.title.toLowerCase();
        const text = item.text.toLowerCase();
        let value = 0;

        if (title.includes(query)) value += 10;
        if (text.includes(query)) value += 3;

        tokens.forEach((token) => {
            if (title.includes(token)) value += 4;
            if (text.includes(token)) value += 1;
        });

        return value;
    }

    function render(container, results, query) {
        if (!query) {
            container.innerHTML = '';
            return;
        }

        if (!results.length) {
            container.innerHTML = '<div class="velikan-search-empty">Ничего не найдено. Попробуйте другой запрос.</div>';
            return;
        }

        container.innerHTML = results.slice(0, 8).map((item) => `
            <a class="velikan-search-result" href="${siteRoot}${item.url}">
                <span class="velikan-search-result-title">${escapeHtml(item.title)}</span>
                <span class="velikan-search-result-text">${escapeHtml(item.text.slice(0, 180))}...</span>
            </a>
        `).join('');
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.ul-search-form').forEach((form) => {
            const input = form.querySelector('input[type="search"]');
            const container = form.querySelector('.velikan-search-results');
            if (!input || !container) return;

            async function runSearch() {
                const query = input.value.trim().toLowerCase();
                if (query.length < 2) {
                    render(container, [], '');
                    return;
                }

                const tokens = query.split(/\s+/).filter(Boolean);
                const index = await loadIndex();
                const results = index
                    .map((item) => ({ ...item, score: score(item, query, tokens) }))
                    .filter((item) => item.score > 0)
                    .sort((a, b) => b.score - a.score);

                render(container, results, query);
            }

            input.addEventListener('input', runSearch);
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                runSearch();
            });
        });
    });
})();
