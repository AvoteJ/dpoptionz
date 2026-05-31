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
            const separator = '\u00a0\u00a0\u00a0|\u00a0\u00a0\u00a0';
            const text = lines.join(separator);

            bannerEl.innerHTML = `
                <div style="display:flex;align-items:center;width:100%;padding:0 16px;box-sizing:border-box;gap:12px;">
                    ${ label ? `<span style="color:rgba(220,150,30,1);font-weight:bold;white-space:nowrap;flex-shrink:0;">${label}</span>` : '' }
                    <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${text}</span>
                </div>
            `;
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

        // ── 3. Player Bar (nav 아래, how2use 위) ──
        const session = (typeof checkSession === 'function') ? checkSession() : null;

        const how2useWrap = document.getElementById('how2use-link');
        if (how2useWrap) {
            // Player Bar 생성
            const playerBar = document.createElement('div');
            playerBar.id = 'player-bar';

            if (session) {
                // 로그인 상태: 진한 파란~하늘색 그라디언트
                playerBar.style.cssText = [
                    'background: linear-gradient(90deg, #1a3870, #4aabcf)',
                    'color: white',
                    'text-align: center',
                    'padding: 5px 16px',
                    'font-size: 10pt',
                    'letter-spacing: 0.04em',
                    'cursor: pointer',
                    'user-select: none',
                ].join(';');
                playerBar.textContent = `Player,  ${session.id}`;
                playerBar.title = 'Log Out';
                playerBar.onclick = () => {
                    if (confirm('Log out?')) {
                        if (typeof clearSession === 'function') clearSession();
                        location.href = 'login.html';
                    }
                };
            } else if (current !== 'login.html' && current !== 'signup.html') {
                // 비로그인 상태: 진한 분홍 배경
                playerBar.style.cssText = [
                    'background: #b5285a',
                    'color: white',
                    'text-align: center',
                    'padding: 5px 16px',
                    'font-size: 10pt',
                    'letter-spacing: 0.04em',
                    'cursor: pointer',
                    'user-select: none',
                ].join(';');
                playerBar.textContent = 'Please Log-In here';
                playerBar.onclick = () => {
                    sessionStorage.setItem('dpopz_returnTo', location.href);
                    location.href = 'login.html';
                };
            }

            if (playerBar.textContent) {
                how2useWrap.parentElement.insertBefore(playerBar, how2useWrap);
            }

            // How to use 링크
            const a = document.createElement('a');
            a.href        = 'how2use.html';
            a.textContent = 'How to use DPOPz?';
            a.style.cssText = 'color:rgba(255,165,0,0.9); text-decoration:underline; font-size:10pt; cursor:pointer;';
            a.onmouseover = () => { a.style.color = 'rgba(255,140,0,1)'; };
            a.onmouseout  = () => { a.style.color = 'rgba(255,165,0,0.9)'; };
            how2useWrap.appendChild(a);
        }
    }

    // ── 4. 버전 표시 ─────────────────────────
    const verEl = document.getElementById('version-display');
    if (verEl && typeof APP_VERSION !== 'undefined') {
        verEl.textContent = 'ver. ' + APP_VERSION;
    }
});
