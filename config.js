// === Game Configuration ===
// 優先讀取遠端 (Google Sheets Config)，fallback 到 localStorage
const CONFIG = {
    _remote: {},
    _loaded: false,

    gameId: 'dicechef',

    get secretMessage() {
        return this._remote.secretMessage
            || localStorage.getItem('dc_secret')
            || 'openthedoor';
    },
    get passThreshold() {
        const remote = parseInt(this._remote.passThreshold);
        if (!isNaN(remote) && remote > 0) return remote;
        return parseInt(localStorage.getItem('dc_threshold')) || 200;
    },
    get apiUrl() {
        return localStorage.getItem('dc_api_url') || 'https://script.google.com/macros/s/AKfycbwAhuS5A02qLzdvUIzgCabG0FhTJdxlLpQBmAcJzIOgO3GvzMBEzilIzeblsPCnzi-m/exec';
    },

    async loadRemoteConfig() {
        const url = this.apiUrl;
        if (!url) return;
        try {
            const res = await fetch(`${url}?action=getConfig&game=${this.gameId}`);
            const data = await res.json();
            if (data && typeof data === 'object' && !data.error) {
                this._remote = data;
                this._loaded = true;
            }
        } catch (e) {
            console.warn('Failed to load remote config:', e);
        }
    },

    async saveRemoteConfig(key, value) {
        const url = this.apiUrl;
        if (!url) return;
        try {
            await fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'setConfig', game: this.gameId, key, value }),
            });
            this._remote[key] = value;
        } catch (e) {
            console.warn('Failed to save remote config:', e);
        }
    },
};

// === Leaderboard Module ===
const Leaderboard = {
    STORAGE_KEY: 'dc_scores',

    getLocal() {
        try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]'); }
        catch { return []; }
    },

    saveLocal(name, score) {
        const scores = this.getLocal();
        const existing = scores.find(s => s.name === name);
        if (existing) {
            if (score > existing.score) {
                existing.score = score;
                existing.date = new Date().toISOString().slice(0, 10);
            }
        } else {
            scores.push({ name, score, date: new Date().toISOString().slice(0, 10) });
        }
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scores.slice(0, 10)));
    },

    async submit(name, score) {
        this.saveLocal(name, score);
        const url = CONFIG.apiUrl;
        if (!url) return;
        try {
            await fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'addScore', game: CONFIG.gameId, name, score }),
            });
        } catch (e) { console.warn('Score submit failed:', e); }
    },

    async load() {
        let remote = [];
        const url = CONFIG.apiUrl;
        if (url) {
            try {
                const res = await fetch(`${url}?action=getScores&game=${CONFIG.gameId}`);
                remote = await res.json();
                if (!Array.isArray(remote)) remote = [];
            } catch (e) { console.warn('Remote load failed:', e); }
        }
        const byName = new Map();
        for (const s of [...remote, ...this.getLocal()]) {
            const prev = byName.get(s.name);
            if (!prev || s.score > prev.score) byName.set(s.name, s);
        }
        return [...byName.values()].sort((a, b) => b.score - a.score).slice(0, 10);
    },
};
