// =============================================
// config.js - DPOPz 전역 설정
// =============================================
// 이 파일 하나만 수정하면 모든 페이지에 반영됩니다.
// =============================================

// ── Apps Script URL ──────────────────────────
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx2jkXI1gPWUK9ojQ7CQD4GnLPiHGQ5Zov9kvhc0wEmEUyVxZB8KV7X1VrfT7KpQNba/exec';

// ── 버전 정보 ────────────────────────────────
// version.js 대신 여기서 관리합니다.
const APP_VERSION = '26.05.02[BETA]';

// ── 상단 배너 설정 ────────────────────────────
// BANNER_LABEL : 배너 왼쪽 라벨 (빈 문자열이면 라벨 숨김)
// BANNER_LINES : 배너 문장 배열 (빈 배열 [] 이면 배너 전체 숨김)
const BANNER_LABEL = '<CLOSED TEST>';
const BANNER_LINES = [
    '모든 페이지가 정상적으로 작동하지 않을 우려가 있습니다. 만약 오류가 발생할 경우, 「Report」 메뉴를 통해 제보해주시면 감사드리겠습니다.',
    'まだ未完成のため、エラーが発生する恐れがあります。もしエラーが発生した場合「Report」メニューでご報告のご協力お願いします。',
    'Currently, errors may occur in all functions. If an error occurs, please report it through the 「Report」 menu.',
];
