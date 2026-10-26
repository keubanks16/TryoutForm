/**
 * GS Baseball Tryout Form — backend (Google Apps Script, bound to a Google Sheet)
 * Records every visit and every submission into the sheet, emails you on each
 * new registration, and serves stats to admin.html (protected by ADMIN_KEY).
 *
 * Setup: Extensions → Apps Script in your Google Sheet, paste this file, set
 * ADMIN_KEY below, run setup() once, then Deploy → New deployment → Web app
 * (Execute as: Me, Who has access: Anyone). Copy the /exec URL into config.js.
 */

const ADMIN_KEY = 'change-me-1234';   // the password for admin.html
const NOTIFY_EMAIL = '';              // leave blank to email the sheet owner

const SUB_HEADERS = ['Timestamp','Player First','Player Last','DOB','Age Group','Bats','Throws','Positions',
  'Current Team','Experience','Jersey Size','Parent Name','Phone','Email','City','Session','Notes',
  'Heard About Us','Waiver','Media OK','Visitor ID'];
const SUB_KEYS = ['playerFirst','playerLast','dob','ageGroup','bats','throws','positions','currentTeam',
  'experience','jerseySize','parentName','phone','email','city','session','notes','source','waiver','mediaOk'];
const VISIT_HEADERS = ['Timestamp','Visitor ID','Referrer','Source Tag','Device','Screen'];

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  sheet_('Submissions', SUB_HEADERS);
  sheet_('Visits', VISIT_HEADERS);
  const s1 = ss.getSheetByName('Sheet1');
  if (s1 && s1.getLastRow() === 0 && ss.getSheets().length > 2) ss.deleteSheet(s1);
}

function sheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f5c400');
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(v) {
  v = String(v == null ? '' : v).slice(0, 1000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;   // block spreadsheet formula injection
}

function device_(ua) {
  ua = ua || '';
  if (/iPhone|iPad/i.test(ua)) return 'iPhone/iPad';
  if (/Android/i.test(ua)) return 'Android';
  if (/Mac/i.test(ua)) return 'Mac';
  if (/Windows/i.test(ua)) return 'Windows';
  return 'Other';
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const body = JSON.parse(e.postData.contents || '{}');
    if (body.action === 'visit') {
      sheet_('Visits', VISIT_HEADERS).appendRow([new Date(), clean_(body.vid), clean_(body.ref),
        clean_(body.src), device_(body.ua), clean_(body.screen)]);
      return json_({ ok: true });
    }
    if (body.action === 'submit') {
      const d = body.data || {};
      if (!d.playerFirst || !d.playerLast || !d.parentName || !d.phone) return json_({ ok: false, error: 'Missing fields' });
      const row = [new Date()].concat(SUB_KEYS.map(k => clean_(d[k])), clean_(body.vid));
      sheet_('Submissions', SUB_HEADERS).appendRow(row);
      try {
        const to = NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
        MailApp.sendEmail(to, `New tryout signup: ${d.playerFirst} ${d.playerLast} (${d.ageGroup})`,
          SUB_KEYS.map((k, i) => `${SUB_HEADERS[i + 1]}: ${d[k] || ''}`).join('\n') +
          '\n\nSheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
      } catch (err) {}
      return json_({ ok: true });
    }
    return json_({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

// Admin stats: GET ?action=stats&key=ADMIN_KEY
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action !== 'stats') return json_({ ok: true, service: 'GS tryout form' });
  if (p.key !== ADMIN_KEY) return json_({ ok: false, error: 'Wrong password' });

  const visits = sheet_('Visits', VISIT_HEADERS).getDataRange().getValues().slice(1);
  const subs = sheet_('Submissions', SUB_HEADERS).getDataRange().getValues();
  const header = subs.shift();

  const tz = Session.getScriptTimeZone();
  const day = d => Utilities.formatDate(new Date(d), tz, 'yyyy-MM-dd');
  const byDay = {}, bySource = {}, byDevice = {}, uniq = new Set();
  visits.forEach(v => {
    const k = day(v[0]); byDay[k] = byDay[k] || { visits: 0, subs: 0 }; byDay[k].visits++;
    uniq.add(v[1]);
    let src = v[3] || (v[2] ? String(v[2]).replace(/^https?:\/\/(www\.)?/, '').split('/')[0] : 'Direct / text');
    bySource[src] = (bySource[src] || 0) + 1;
    byDevice[v[4]] = (byDevice[v[4]] || 0) + 1;
  });
  const byAge = {}, bySession = {};
  subs.forEach(s => {
    const k = day(s[0]); byDay[k] = byDay[k] || { visits: 0, subs: 0 }; byDay[k].subs++;
    byAge[s[4]] = (byAge[s[4]] || 0) + 1;
    bySession[s[15]] = (bySession[s[15]] || 0) + 1;
  });

  return json_({
    ok: true,
    totals: { visits: visits.length, uniqueVisitors: uniq.size, submissions: subs.length },
    byDay, bySource, byDevice, byAge, bySession,
    header,
    submissions: subs.map(r => r.map((c, i) => c instanceof Date ? Utilities.formatDate(c, tz, i === 3 ? 'MM/dd/yyyy' : 'MMM d, h:mm a') : c)).reverse(),
    sheetUrl: SpreadsheetApp.getActiveSpreadsheet().getUrl()
  });
}
