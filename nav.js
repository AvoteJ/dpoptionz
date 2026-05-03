// =============================================
// nav.js - DPOPz 공통 헤더
// =============================================
// 역할: 배너 렌더링 / 네비게이션 탭 생성 /
//       Login·Logout 버튼 / 버전 표시
//
// 로드 순서: config.js → session.js → nav.js
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. 상단 배너 (스크롤 마퀴) ──────────
    const bannerEl = document.getElementById('site-banner');
    if (bannerEl) {
        const lines = (typeof BANNER_LINES !== 'undefined') ? BANNER_LINES : [];
        const label = (typeof BANNER_LABEL !== 'undefined') ? BANNER_LABEL : '';

        if (lines.length > 0) {
            // 문장들을 구분자로 이어붙임 (2벌 반복으로 끊김 없이 순환)
            const separator = '\u00a0\u00a0\u00a0\u00a0\u00a0|\u00a0\u00a0\u00a0\u00a0\u00a0';
            const text = lines.join(separator);
            const doubled = text + separator + text;

            bannerEl.innerHTML = `
                <div style="display:flex;align-items:center;overflow:hidden;width:100%;height:100%;padding:0;">
                    ${ label ? `<span style="color:rgba(220,150,30,1);font-weight:bold;white-space:nowrap;flex-shrink:0;padding:0 14px 0 16px;">${label}</span><span style="color:rgba(255,200,100,0.5);flex-shrink:0;padding-right:10px;">|</span>` : '' }
                    <div style="overflow:hidden;flex:1;position:relative;">
                        <div id="banner-scroll-track" style="
                            display:inline-block;
                            white-space:nowrap;
                            animation: bannerScroll 38s linear infinite;
                            padding-left:40px;
                        ">${doubled}</div>
                    </div>
                </div>
            `;

            // CSS 애니메이션 주입 (한 번만)
            if (!document.getElementById('banner-scroll-style')) {
                const style = document.createElement('style');
                style.id = 'banner-scroll-style';
                style.textContent = `
                    @keyframes bannerScroll {
                        0%   { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    #banner-scroll-track:hover {
                        animation-play-state: paused;
                    }
                `;
                document.head.appendChild(style);
            }

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

        // How to use 링크 (nav 아래 별도 줄)
        const how2useWrap = document.getElementById('how2use-link');
        if (how2useWrap) {
            const a = document.createElement('a');
            a.href      = 'how2use.html';
            a.textContent = 'How to use DPOPz?';
            a.style.cssText = 'color:rgba(255,165,0,0.9); text-decoration:underline; font-size:10pt; cursor:pointer;';
            a.onmouseover = () => { a.style.color = 'rgba(255,140,0,1)'; };
            a.onmouseout  = () => { a.style.color = 'rgba(255,165,0,0.9)'; };
            how2useWrap.appendChild(a);
        }
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
});
