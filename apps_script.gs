// =============================================
// Double Play Optionz - Apps Script
// =============================================
// 시트 구성:
//   Sheet1 : 투표 데이터 (Timestamp, Title, Difficulty, Option#1, Option#2, Option#3)
//
// 사용 방법:
// 1. Google Sheets 새 파일 생성
// 2. 확장 프로그램 > Apps Script 열기
// 3. 이 코드 전체를 붙여넣고 저장
// 4. [배포] > [새 배포] > 종류: 웹 앱 / 액세스: 모든 사용자
// 5. 배포 후 생성된 URL을 config.js에 붙여넣기
// =============================================

var CACHE_SECONDS = 21600; // 캐시 유지 시간 (초) - 기본 6시간

function doGet(e) {
  try {
    const ss     = SpreadsheetApp.getActiveSpreadsheet();
    const sheet1 = ss.getSheetByName('Sheet1'); // 투표 데이터
    const cache  = CacheService.getScriptCache();

    // Sheet1 헤더 초기화
    if (sheet1.getLastRow() === 0) {
      sheet1.appendRow(['Timestamp', 'Title', 'Difficulty', 'Option#1', 'Option#2', 'Option#3']);
    }

    const p = e.parameter;

    // action=vote : 투표 데이터 저장 (Sheet1)
    if (p.action === 'vote') {
      sheet1.appendRow([
        p.timestamp  || '',
        p.title      || '',
        p.difficulty || '',
        p.option1    || '',
        p.option2    || '',
        p.option3    || '',
      ]);

      // 투표 저장 시 results 캐시 초기화 (최신 집계 반영)
      cache.remove('resultsData');

      return ContentService
        .createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // action=results : 투표 집계 결과 반환 (Sheet1) - 캐시 적용
    if (p.action === 'results') {
      const cachedResults = cache.get('resultsData');
      if (cachedResults) {
        return ContentService
          .createTextOutput(cachedResults)
          .setMimeType(ContentService.MimeType.JSON);
      }

      const data = sheet1.getDataRange().getValues();
      const tally = {};

      for (let i = 1; i < data.length; i++) {
        const row   = data[i];
        const title = String(row[1]).trim();
        const opt1  = String(row[3]).trim();
        const opt2  = String(row[4]).trim();
        const opt3  = String(row[5]).trim();

        if (!title) continue;
        if (!tally[title]) tally[title] = { opt1: {}, opt2: {}, opt3: {} };

        if (opt1) tally[title].opt1[opt1] = (tally[title].opt1[opt1] || 0) + 1;
        if (opt2) tally[title].opt2[opt2] = (tally[title].opt2[opt2] || 0) + 1;
        if (opt3) tally[title].opt3[opt3] = (tally[title].opt3[opt3] || 0) + 1;
      }

      const results = {};
      for (const title in tally) {
        results[title] = {
          opt1: topVote(tally[title].opt1),
          opt2: topVote(tally[title].opt2),
          opt3: topVote(tally[title].opt3),
        };
      }

      const output = JSON.stringify({ status: 'success', results: results });
      cache.put('resultsData', output, CACHE_SECONDS);

      return ContentService
        .createTextOutput(output)
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'action parameter required (vote | results)' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 캐시 전체 초기화 - Sheet2 데이터 수정 후 Apps Script 편집기에서 직접 실행
function clearCache() {
  CacheService.getScriptCache().remove('resultsData');
  Logger.log('캐시가 초기화되었습니다.');
}

// 득표수가 가장 많은 값 반환 (동률이면 먼저 나온 값)
function topVote(counter) {
  let topKey = '';
  let topVal = 0;
  for (const key in counter) {
    if (counter[key] > topVal) {
      topVal = counter[key];
      topKey = key;
    }
  }
  return topKey;
}
