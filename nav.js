// =============================================
// nav.js - DPOPz 공통 헤더
// =============================================
// 역할: 배너 렌더링 / 네비게이션 탭 생성 /
//       Login·Logout 버튼 / 버전 표시
//
// 로드 순서: config.js → session.js → nav.js
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. 상단 배너 ─────────────────────────
    const bannerEl = document.getElementById('site-banner');
    if (bannerEl) {
        const lines = (typeof BANNER_LINES !== 'undefined') ? BANNER_LINES : [];
        const label = (typeof BANNER_LABEL !== 'undefined') ? BANNER_LABEL : '';

        if (lines.length > 0) {
            let html = '<div style="display:flex;align-items:flex-start;justify-content:center;gap:20px;flex-wrap:wrap;padding:0 20px;">';

            // 왼쪽 라벨 (진한 색)
            if (label) {
                html += `<span style="color:rgba(220,150,30,1);font-weight:bold;white-space:nowrap;flex-shrink:0;padding-top:1px;">${label}</span>`;
            }

            // 오른쪽 문장들
            html += '<div style="text-align:left;line-height:2.0;">';
            lines.forEach(line => {
                html += `<div>${line}</div>`;
            });
            html += '</div></div>';

            bannerEl.innerHTML = html;
            bannerEl.style.display = '';
        } else {
            bannerEl.style.display = 'none';
        }
    }

    // ── 2. 네비게이션 탭 ─────────────────────
    const navEl = document.getElementById('site-nav');
    if (navEl) {
        const current = location.pathname.split('/').pop() || 'index.html';
        const links = [
            { href: 'index.html',  label: 'Top'    },
            { href: 'table.html',  label: 'Table'  },
            { href: 'about.html',  label: 'About'  },
            { href: 'report.html', label: 'Report' },
        ];
        links.forEach(({ href, label }) => {
            const a = document.createElement('a');
            a.href        = href;
            a.textContent = label;
            a.className   = 'nav-link' + (href === current ? ' nav-link-active' : '');
            navEl.appendChild(a);
        });
    }

    // ── 3. Login / Logout 버튼 ───────────────
    const authEl = document.getElementById('auth-btn-container');
    if (authEl) {
        const session = (typeof checkSession === 'function') ? checkSession() : null;
        const current = location.pathname.split('/').pop() || 'index.html';
        const btn = document.createElement('button');

        if (session) {
            // 로그인 상태 → Logout
            btn.textContent = 'Log Out';
            btn.className   = 'auth-corner-btn logout';
            btn.onclick     = () => {
                if (typeof clearSession === 'function') clearSession();
                location.href = 'login.html';
            };
            authEl.appendChild(btn);
        } else {
            // 미로그인 상태 → Login
            // login / signup 페이지에서는 버튼 표시 안 함
            if (current !== 'login.html' && current !== 'signup.html') {
                btn.textContent = 'Log In';
                btn.className   = 'auth-corner-btn login';
                btn.onclick     = () => {
                    sessionStorage.setItem('dpopz_returnTo', location.href);
                    location.href = 'login.html';
                };
                authEl.appendChild(btn);
            }
        }
    }

    // ── 4. 버전 표시 ─────────────────────────
    const verEl = document.getElementById('version-display');
    if (verEl && typeof APP_VERSION !== 'undefined') {
        verEl.textContent = 'ver. ' + APP_VERSION;
    }

    // ── 5. 푸터 텍스트 ───────────────────────
    const footerEl = document.getElementById('site-footer');
    if (footerEl) {
        const l1 = (typeof FOOTER_LINE1 !== 'undefined') ? FOOTER_LINE1 : '';
        const l2 = (typeof FOOTER_LINE2 !== 'undefined') ? FOOTER_LINE2 : '';
        footerEl.innerHTML =
            `<p style="text-align:center;font-size:10pt;color:#888888;margin:0;padding:12px 0 4px;">${l1}</p>` +
            `<p style="text-align:center;font-size:10pt;color:#888888;margin:0;padding:4px 0 12px;">${l2}</p>`;
    }
});
