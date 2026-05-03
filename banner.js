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
            let html = '<div style="display:flex; align-items:flex-start; justify-content:center; gap:16px; flex-wrap:wrap; padding: 0 16px;">';
            html += `<span style="color:rgba(255,180,60,1); font-weight:bold; white-space:nowrap; flex-shrink:0;">${BANNER_LABEL}</span>`;
            html += '<div style="text-align:left; line-height:1.9;">';
            BANNER_LINES.forEach(line => { html += `<div>${line}</div>`; });
            html += '</div></div>';
            bannerEl.innerHTML = html;
        } else {
            bannerEl.style.display = 'none';
        }
    }

    // ── 오른쪽 상단 Login / Logout 버튼 ─────
    const authEl = document.getElementById('auth-btn-container');
    if (authEl) {
        const session = (typeof checkSession === 'function') ? checkSession() : null;
        const btn = document.createElement('button');

        if (session) {
            // 로그인 상태 → Logout
            btn.textContent = 'Logout';
            btn.className   = 'auth-corner-btn logout';
            btn.onclick     = () => {
                if (typeof clearSession === 'function') clearSession();
                location.href = 'login.html';
            };
        } else {
            // 미로그인 상태 → Login (login/signup 페이지에서는 숨김)
            const currentPage = location.pathname.split('/').pop();
            if (currentPage === 'login.html' || currentPage === 'signup.html') return;
            btn.textContent = 'Login';
            btn.className   = 'auth-corner-btn login';
            btn.onclick     = () => { location.href = 'login.html'; };
        }

        authEl.appendChild(btn);
    }

    // ── 버전 표시 ────────────────────────────
    const verEl = document.getElementById('version-display');
    if (verEl && typeof APP_VERSION !== 'undefined') {
        verEl.textContent = 'ver. ' + APP_VERSION;
    }
});
