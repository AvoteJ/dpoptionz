// =============================================
// banner.js - DPOPz 공통 배너 & 네비게이션 처리
// =============================================
// config.js, session.js 로드 후 실행됩니다.
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // ── 상단 배너 렌더링 ─────────────────────
    const bannerEl = document.getElementById('site-banner');
    if (bannerEl) {
        if (typeof BANNER_LINES !== 'undefined' && BANNER_LINES.length > 0) {
            bannerEl.style.display = '';

            // 라벨 + 문장들 조합
            let html = '<div style="display:flex; align-items:flex-start; justify-content:center; gap:16px; flex-wrap:wrap; padding: 0 16px;">';

            // 왼쪽 라벨
            html += `<span style="color:rgba(255,180,60,1); font-weight:bold; white-space:nowrap; flex-shrink:0;">${BANNER_LABEL}</span>`;

            // 오른쪽 문장들
            html += '<div style="text-align:left; line-height:1.9;">';
            BANNER_LINES.forEach(line => {
                html += `<div>${line}</div>`;
            });
            html += '</div></div>';

            bannerEl.innerHTML = html;
        } else {
            bannerEl.style.display = 'none';
        }
    }

    // ── Logout 버튼 렌더링 ───────────────────
    const logoutEl = document.getElementById('logout-btn-container');
    if (logoutEl) {
        const session = (typeof checkSession === 'function') ? checkSession() : null;
        if (session) {
            const btn = document.createElement('button');
            btn.textContent = 'Logout';
            btn.className   = 'logout-btn';
            btn.onclick     = () => {
                if (typeof clearSession === 'function') clearSession();
                location.href = 'login.html';
            };
            logoutEl.appendChild(btn);
        }
    }

    // ── 버전 표시 ────────────────────────────
    const verEl = document.getElementById('version-display');
    if (verEl && typeof APP_VERSION !== 'undefined') {
        verEl.textContent = 'ver. ' + APP_VERSION;
    }
});
