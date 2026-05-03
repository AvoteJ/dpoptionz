// =============================================
// session.js - DPOPz 세션 관리
// =============================================
// 모든 페이지에서 공통으로 사용합니다.
// 세션은 로그인한 날의 다음날 오전 5시 (KST)에 만료됩니다.
// =============================================

const SESSION_KEY = 'dpopz_session';

// 세션 만료 시각 계산 (KST 다음날 오전 5시)
function calcSessionExpiry() {
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstNow    = new Date(Date.now() + kstOffset);

    // KST 기준 다음날 오전 5시 → UTC 변환
    const kstNextDay5am = Date.UTC(
        kstNow.getUTCFullYear(),
        kstNow.getUTCMonth(),
        kstNow.getUTCDate() + 1,
        5, 0, 0, 0
    ) - kstOffset;

    return kstNextDay5am;
}

// 세션 저장
function saveSession(id) {
    const session = { id, expiry: calcSessionExpiry() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// 세션 확인 → 유효하면 { id, expiry } 반환, 만료/없으면 null
function checkSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const session = JSON.parse(raw);
        if (Date.now() > session.expiry) {
            localStorage.removeItem(SESSION_KEY);
            return null;
        }
        return session;
    } catch (e) {
        localStorage.removeItem(SESSION_KEY);
        return null;
    }
}

// 세션 삭제 (로그아웃)
function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

// 로그인 필요 페이지에서 호출 → 세션 없으면 login.html로 이동
// returnTo 생략 시 현재 페이지 URL을 저장
function requireLogin(returnTo) {
    const session = checkSession();
    if (!session) {
        sessionStorage.setItem('dpopz_returnTo', returnTo || location.href);
        location.href = 'login.html';
        return null;
    }
    return session;
}
