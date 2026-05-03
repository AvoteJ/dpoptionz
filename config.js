// =============================================
// config.js - DPOPz 전역 설정
// =============================================
// 이 파일 하나만 수정하면 모든 페이지에 반영됩니다.
// =============================================

// ── Apps Script URL ──────────────────────────
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxeHNt0NVV-0ikbU0PSAixpNMKB97jv7o8EqnJMBGZhyJOMcnn6oCkY4C9WRSOx4iwi/exec';

// ── 버전 정보 (version.js 대체) ──────────────
const APP_VERSION = '26.05.02[BETA]';

// ── 상단 배너 설정 ────────────────────────────
// BANNER_LABEL : 배너 왼쪽 라벨 텍스트
// BANNER_LINES : 배너 문장 배열 (빈 배열이면 배너 숨김)
const BANNER_LABEL = '\x3cCLOSED TEST\x3e';
const BANNER_LINES = [
    '모든 페이지가 정상적으로 작동하지 않을 우려가 있습니다. 만약 오류가 발생할 경우, \x3cReport\x3e 메뉴를 통해 제보해주시면 감사드리겠습니다.',
    'まだ未完成のため、エラーが発生する恐れがあります。もしエラーが発生した場合\uff1cReport\uff1eメニューでご報告のご協力お願いします。',
    'Currently, errors may occur in all functions. If an error occurs, please report it through the \x3cReport\x3e menu.',
];
