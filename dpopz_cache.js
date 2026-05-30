// ─────────────────────────────────────────────
//  DPOPz Shared Data Cache  (dpopz_cache.js)
//  · 파싱된 시트 데이터 / results / trust 를
//    localStorage 에 10분간 보관
//  · USER DATA 관련 액션(login/signup/vote/report)
//    은 캐시 대상에서 완전히 제외
// ─────────────────────────────────────────────

const DPOPZ_CACHE_TTL = 10 * 60 * 1000; // 10분 (ms)

const DPOPzCache = (() => {
    const KEYS = {
        SHEETS   : 'dpopz_c_sheets',
        RESULTS  : 'dpopz_c_results',
        TRUST    : 'dpopz_c_trust',
        TS       : 'dpopz_c_ts'
    };

    // ── 만료 여부 ──
    function isExpired() {
        const ts = localStorage.getItem(KEYS.TS);
        if (!ts) return true;
        return (Date.now() - parseInt(ts, 10)) > DPOPZ_CACHE_TTL;
    }

    // ── 저장 ──
    function save(sheets, results, trust) {
        try {
            localStorage.setItem(KEYS.SHEETS,  JSON.stringify(sheets));
            localStorage.setItem(KEYS.RESULTS, JSON.stringify(results));
            localStorage.setItem(KEYS.TRUST,   JSON.stringify(trust));
            localStorage.setItem(KEYS.TS,      String(Date.now()));
        } catch (e) {
            // localStorage 용량 초과 등 → 캐시 없이 동작
            console.warn('[DPOPzCache] save failed:', e);
            clear();
        }
    }

    // ── 불러오기 ──
    function load() {
        try {
            const sheets  = JSON.parse(localStorage.getItem(KEYS.SHEETS));
            const results = JSON.parse(localStorage.getItem(KEYS.RESULTS));
            const trust   = JSON.parse(localStorage.getItem(KEYS.TRUST));
            if (!sheets || !results) return null;
            return { sheets, results, trust: trust || {} };
        } catch (e) {
            return null;
        }
    }

    // ── 전체 삭제 ──
    function clear() {
        Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    }

    // ── 남은 캐시 시간(초) 반환 ──
    function remainingSec() {
        const ts = localStorage.getItem(KEYS.TS);
        if (!ts) return 0;
        const rem = DPOPZ_CACHE_TTL - (Date.now() - parseInt(ts, 10));
        return rem > 0 ? Math.ceil(rem / 1000) : 0;
    }

    // ── 메인: 캐시 HIT 이면 즉시 반환, MISS 면 fetch 후 캐시 저장 ──
    // 반환값: Promise<{ sheets, results, trust }>
    //   sheets  = { s1: rows[][], s2: rows[][], s3: rows[][] }
    //   results = voteData.results  (action=results 응답)
    //   trust   = trustRes.trust    (action=trust 응답)
    async function get(appsScriptUrl) {
        if (!isExpired()) {
            const cached = load();
            if (cached) {
                console.log(`[DPOPzCache] HIT (${remainingSec()}s 남음)`);
                return cached;
            }
        }

        console.log('[DPOPzCache] MISS — fetching...');

        const [xlsxBuf, voteData, trustRes] = await Promise.all([
            fetch('DPOPz_DATABASE.xlsx').then(r => r.arrayBuffer()),
            fetch(`${appsScriptUrl}?action=results`)
                .then(r => r.json())
                .catch(() => ({ results: {} })),
            fetch(`${appsScriptUrl}?action=trust`)
                .then(r => r.json())
                .catch(() => ({ status: 'error', trust: {} }))
        ]);

        // XLSX 파싱 (XLSX 라이브러리가 이미 로드돼 있어야 함)
        const wb = XLSX.read(xlsxBuf, { type: 'array' });
        const sheets = {
            s1: XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 }),
            s2: XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[1]], { header: 1 }),
            s3: XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[2]], { header: 1 })
        };

        const results = voteData.results  || {};
        const trust   = (trustRes.status === 'success') ? (trustRes.trust || {}) : {};

        save(sheets, results, trust);
        return { sheets, results, trust };
    }

    return { get, clear, isExpired, remainingSec };
})();
