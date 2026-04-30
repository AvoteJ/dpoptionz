// =============================================
// optionbits.js - DPOPz Option Bit Definitions
// =============================================
// 비트 구조 (총 11비트)
// [ OPT1: 1bit ][ OPT2: 5bit ][ OPT3: 5bit ]
//
// Option#1 : FLIP (bit 10)
//   0 = OFF
//   1 = FLIP
//
// Option#2 : 1P(LEFT) (bit 9~5)
//   0 = OFF      → 00000
//   1 = MIRROR   → 00001
//   2 = RANDOM   → 00010
//   3 = R-RANDOM → 00011
//   4 = S-RANDOM → 00100
//
// Option#3 : 2P(RIGHT) (bit 4~0)
//   0 = OFF      → 00000
//   1 = MIRROR   → 00001
//   2 = RANDOM   → 00010
//   3 = R-RANDOM → 00011
//   4 = S-RANDOM → 00100
//
// 예시) FLIP | RANDOM | R-RANDOM
//   = 1 | 00010 | 00011
//   = 10001000011 (2진수)
//   = 1091 (10진수)
// =============================================

const OptionBits = {

    // 문자열 → 코드값
    OPT1_ENCODE: { 'OFF': 0, 'FLIP': 1 },
    OPT2_ENCODE: { 'OFF': 0, 'MIRROR': 1, 'RANDOM': 2, 'R-RANDOM': 3, 'S-RANDOM': 4 },
    OPT3_ENCODE: { 'OFF': 0, 'MIRROR': 1, 'RANDOM': 2, 'R-RANDOM': 3, 'S-RANDOM': 4 },

    // 코드값 → 문자열
    OPT1_DECODE: { 0: 'OFF', 1: 'FLIP' },
    OPT2_DECODE: { 0: 'OFF', 1: 'MIRROR', 2: 'RANDOM', 3: 'R-RANDOM', 4: 'S-RANDOM' },
    OPT3_DECODE: { 0: 'OFF', 1: 'MIRROR', 2: 'RANDOM', 3: 'R-RANDOM', 4: 'S-RANDOM' },

    /**
     * 세 옵션 문자열 → 10진수 정수로 인코딩
     * @param {string} opt1 - FLIP 옵션 ('OFF' | 'FLIP')
     * @param {string} opt2 - 1P(LEFT) 옵션
     * @param {string} opt3 - 2P(RIGHT) 옵션
     * @returns {number} 10진수 정수
     *
     * 예시) encode('FLIP', 'RANDOM', 'R-RANDOM')
     *   = 1 | 00010 | 00011 = 10001000011 = 1091
     */
    encode(opt1, opt2, opt3) {
        const v1 = this.OPT1_ENCODE[opt1] ?? 0;
        const v2 = this.OPT2_ENCODE[opt2] ?? 0;
        const v3 = this.OPT3_ENCODE[opt3] ?? 0;
        return (v1 << 10) | (v2 << 5) | v3;
    },

    /**
     * 10진수 정수 → 세 옵션 문자열로 디코딩
     * @param {number} value - 인코딩된 10진수 정수
     * @returns {{ opt1: string, opt2: string, opt3: string }}
     *
     * 예시) decode(1091)
     *   = { opt1: 'FLIP', opt2: 'RANDOM', opt3: 'R-RANDOM' }
     */
    decode(value) {
        const v3 = value & 0b11111;
        const v2 = (value >> 5) & 0b11111;
        const v1 = (value >> 10) & 0b1;
        return {
            opt1: this.OPT1_DECODE[v1] ?? 'OFF',
            opt2: this.OPT2_DECODE[v2] ?? 'OFF',
            opt3: this.OPT3_DECODE[v3] ?? 'OFF',
        };
    },

    /**
     * 10진수 → 11자리 2진수 문자열 변환 (디버그용)
     * @param {number} value
     * @returns {string}
     */
    toBinary(value) {
        return value.toString(2).padStart(11, '0');
    },
};
