/**
 * FALO IM GAS LINE Bot PoC
 *
 * GAS gateway version:
 * - Receives LINE Messaging API webhook events through doPost(e).
 * - Stores normalized events into Google Sheets.
 * - Exposes a small HTML monitor and JSON API proxy through doGet(e).
 *
 * Security note:
 * Apps Script web apps do not expose LINE's X-Line-Signature header to doPost(e).
 * For production, put Cloud Run / Cloudflare Worker / FALO cloud gateway in front
 * when strict signature verification is required.
 */

var EVENT_SHEET_NAME = 'line_events';
var CONFIG_SHEET_NAME = 'config';
var MEDIA_QUEUE_SHEET_NAME = 'media_queue';
var MEDIA_FILES_SHEET_NAME = 'media_files';
var REFERENCE_SHEET_NAME = 'reference_notes';
var DEFAULT_SPREADSHEET_ID = '1VWP34oZeUqcYdOfI042SDeHXNNhLKi2vQCYDzAOaDyo';
var DEFAULT_BOT_ALIAS = 'gas';
var DEFAULT_BOT_NAME = 'FALO IM Bot GAS Test';
var DEFAULT_BOT_BASIC_ID = '@415taurm';
var DEFAULT_MEDIA_SAVE_MODE = 'metadata';
var DEFAULT_MEDIA_SAVE_ENABLED = 'false';
var DEFAULT_MEDIA_FOLDER_ID = '1YMudlXzJYuBgK3gtJt2sPAUvcOc3kQwC';
var TIME_ZONE = 'Asia/Taipei';
var MEDIA_WORKER_FUNCTION = 'processMediaQueue';
var MEDIA_WORKER_INTERVAL_MINUTES = 5;
var MEDIA_WORKER_MAX_SECONDS = 240;
var MEDIA_WORKER_MAX_FILES = 50;
var MEDIA_WORKER_MAX_ATTEMPTS = 3;
var REPLY_ENDPOINT = 'https://api.line.me/v2/bot/message/reply';
var CONTENT_ENDPOINT = 'https://api-data.line.me/v2/bot/message/%s/content';
var DEV_SETUP_KEY = 'falo-force-dev-20260621';
var HEADERS = [
  'captured_at',
  'line_timestamp',
  'bot_alias',
  'bot_name',
  'bot_basic_id',
  'destination',
  'webhook_event_id',
  'is_redelivery',
  'source_type',
  'source_key',
  'user_id',
  'group_id',
  'room_id',
  'message_id',
  'message_type',
  'event_type',
  'text',
  'media_saved',
  'media_file_id',
  'media_file_url',
  'media_error',
  'raw_json'
];
var MEDIA_QUEUE_HEADERS = [
  'queued_at',
  'message_id',
  'message_type',
  'source_type',
  'source_id',
  'user_id',
  'group_id',
  'room_id',
  'line_timestamp',
  'status',
  'attempt_count',
  'processing_started_at',
  'last_attempt_at',
  'last_error',
  'drive_file_id',
  'drive_file_url',
  'raw_json'
];
var MEDIA_FILES_HEADERS = [
  'saved_at',
  'message_id',
  'message_type',
  'stored_file_name',
  'mime_type',
  'drive_file_id',
  'drive_file_url',
  'drive_folder_id',
  'source_type',
  'source_id',
  'user_id',
  'line_timestamp'
];
var REFERENCE_HEADERS = ['topic', 'summary', 'source_url', 'design_note', 'updated_at'];
var TAIPEI_TIME_FIELD_NAMES = {
  captured_at: true,
  queued_at: true,
  processing_started_at: true,
  last_attempt_at: true,
  saved_at: true,
  updated_at: true,
  time: true
};

function formatTaipeiIso_(date) {
  return Utilities.formatDate(date, TIME_ZONE, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

function nowTaipeiIso_() {
  return formatTaipeiIso_(new Date());
}

function normalizeTaipeiTimeValue_(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return formatTaipeiIso_(value);
  }

  var text = String(value);
  if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
    var parsed = new Date(text);
    if (!isNaN(parsed.getTime())) {
      return formatTaipeiIso_(parsed);
    }
  }
  return text;
}

function normalizeTimeFields_(record) {
  Object.keys(TAIPEI_TIME_FIELD_NAMES).forEach(function(field) {
    if (Object.prototype.hasOwnProperty.call(record, field)) {
      record[field] = normalizeTaipeiTimeValue_(record[field]);
    }
  });
  return record;
}

function sheetRowsToObjects_(headers, values) {
  return values.map(function(row) {
    var record = {};
    for (var i = 0; i < headers.length; i++) {
      record[headers[i]] = row[i];
    }
    return normalizeTimeFields_(record);
  });
}

function doGet(e) {
  var action = getParam_(e, 'api') || getParam_(e, 'action');

  if (action === 'health') {
    return jsonOutput_(healthPayload_());
  }
  if (action === 'events') {
    if (!isViewerAuthorized_(e)) {
      return jsonOutput_({ok: false, error: 'unauthorized viewer token'});
    }
    var limit = parseLimit_(getParam_(e, 'limit'), 2000);
    var sourceKey = getParam_(e, 'source_key') || getParam_(e, 'chat_id');
    var start = getParam_(e, 'start') || getParam_(e, 'startDate');
    var end = getParam_(e, 'end') || getParam_(e, 'endDate');
    return jsonOutput_(listEvents_(limit, sourceKey, start, end));
  }
  if (action === 'config') {
    if (!isViewerAuthorized_(e)) {
      return jsonOutput_({ok: false, error: 'unauthorized viewer token'});
    }
    return jsonOutput_(publicConfig_());
  }
  if (action === 'controls') {
    if (!isViewerAuthorized_(e)) {
      return jsonOutput_({ok: false, error: 'unauthorized viewer token'});
    }
    return jsonOutput_(controlStatus_());
  }
  if (action === 'media-queue') {
    if (!isViewerAuthorized_(e)) {
      return jsonOutput_({ok: false, error: 'unauthorized viewer token'});
    }
    return jsonOutput_(listMediaQueue_(parseLimit_(getParam_(e, 'limit'), 30)));
  }
  if (action === 'set-media-save') {
    if (!isViewerAuthorized_(e)) {
      return jsonOutput_({ok: false, error: 'unauthorized viewer token'});
    }
    return jsonOutput_(setMediaSaveEnabled_(getParam_(e, 'enabled')));
  }
  if (action === 'set-media-trigger') {
    if (!isViewerAuthorized_(e)) {
      return jsonOutput_({ok: false, error: 'unauthorized viewer token'});
    }
    return jsonOutput_(setMediaWorkerTriggerEnabled_(getParam_(e, 'enabled')));
  }
  if (action === 'run-media-worker') {
    if (!isViewerAuthorized_(e)) {
      return jsonOutput_({ok: false, error: 'unauthorized viewer token'});
    }
    return jsonOutput_(processMediaQueue());
  }
  if (action === 'setup') {
    if (!isViewerAuthorized_(e)) {
      return jsonOutput_({ok: false, error: 'unauthorized viewer token'});
    }
    return jsonOutput_(setupSecondWebhookDefaults());
  }
  if (action === 'dev-set-runtime-config') {
    return jsonOutput_(devSetRuntimeConfig_(e));
  }

  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('FALO GAS LINE Bot Monitor')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function doPost(e) {
  var payload;
  try {
    payload = handleWebhook_(e);
  } catch (err) {
    payload = {
      ok: true,
      service: 'falo-gas-line-bot',
      received: 0,
      handled_error: String(err)
    };
  }

  return htmlPostAck_(payload);
}

function setupSecondWebhookDefaults() {
  var props = PropertiesService.getScriptProperties();
  setDefaultProperty_(props, 'SPREADSHEET_ID', DEFAULT_SPREADSHEET_ID);
  setDefaultProperty_(props, 'BOT_ALIAS', DEFAULT_BOT_ALIAS);
  setDefaultProperty_(props, 'BOT_NAME', DEFAULT_BOT_NAME);
  setDefaultProperty_(props, 'BOT_BASIC_ID', DEFAULT_BOT_BASIC_ID);
  setDefaultProperty_(props, 'AUTO_REPLY', 'false');
  setDefaultProperty_(props, 'MEDIA_SAVE_MODE', DEFAULT_MEDIA_SAVE_MODE);
  setDefaultProperty_(props, 'MEDIA_SAVE_ENABLED', DEFAULT_MEDIA_SAVE_ENABLED);
  setDefaultProperty_(props, 'MEDIA_FOLDER_ID', DEFAULT_MEDIA_FOLDER_ID);
  getEventSheet_();
  getMediaQueueSheet_();
  getMediaFilesSheet_();
  writeConfigSheet_();
  writeReferenceSheet_();
  return healthPayload_();
}

function setScriptPropertiesForDeploy(updates) {
  var props = PropertiesService.getScriptProperties();
  var input = updates || {};
  var allowedKeys = [
    'SPREADSHEET_ID',
    'MEDIA_FOLDER_ID',
    'LINE_CHANNEL_ACCESS_TOKEN',
    'LINE_CHANNEL_SECRET',
    'BOT_ALIAS',
    'BOT_NAME',
    'BOT_BASIC_ID',
    'AUTO_REPLY',
    'MEDIA_SAVE_ENABLED',
    'MEDIA_SAVE_MODE',
    'WEBHOOK_TOKEN',
    'VIEWER_TOKEN'
  ];
  var saved = [];

  allowedKeys.forEach(function(key) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      props.setProperty(key, String(input[key]));
      saved.push(key);
    }
  });

  return {
    ok: true,
    saved_keys: saved,
    saved_count: saved.length
  };
}

function devSetRuntimeConfig_(e) {
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty('LINE_CHANNEL_ACCESS_TOKEN')) {
    return {
      ok: false,
      reason: 'LINE_CHANNEL_ACCESS_TOKEN already exists; dev setup endpoint is locked'
    };
  }
  if (getParam_(e, 'setup_key') !== DEV_SETUP_KEY) {
    return {
      ok: false,
      reason: 'invalid setup key'
    };
  }

  var accessToken = getParam_(e, 'line_access_token');
  if (!accessToken) {
    return {
      ok: false,
      reason: 'line_access_token is required'
    };
  }

  props.setProperty('LINE_CHANNEL_ACCESS_TOKEN', accessToken);
  var channelSecret = getParam_(e, 'line_channel_secret');
  if (channelSecret) {
    props.setProperty('LINE_CHANNEL_SECRET', channelSecret);
  }
  props.setProperty('MEDIA_SAVE_ENABLED', 'true');
  props.setProperty('MEDIA_SAVE_MODE', 'all');
  props.setProperty('MEDIA_FOLDER_ID', getParam_(e, 'media_folder_id') || DEFAULT_MEDIA_FOLDER_ID);

  return {
    ok: true,
    saved_keys: [
      'LINE_CHANNEL_ACCESS_TOKEN',
      channelSecret ? 'LINE_CHANNEL_SECRET' : '',
      'MEDIA_SAVE_ENABLED',
      'MEDIA_SAVE_MODE',
      'MEDIA_FOLDER_ID'
    ].filter(Boolean)
  };
}

function authorizeRuntime() {
  setupSecondWebhookDefaults();

  var spreadsheet = SpreadsheetApp.openById(getSpreadsheetId_());
  var folder = DriveApp.getFolderById(getMediaFolderId_());
  var triggers = ScriptApp.getProjectTriggers();

  return {
    ok: true,
    service: 'falo-gas-line-bot',
    purpose: 'one-time authorization warmup',
    spreadsheet_id: spreadsheet.getId(),
    spreadsheet_name: spreadsheet.getName(),
    media_folder_id: folder.getId(),
    media_folder_name: folder.getName(),
    script_trigger_count: triggers.length,
    media_worker_trigger_enabled: hasMediaWorkerTrigger_(triggers),
    note: 'Authorization is complete. Use the monitor page buttons to enable media upload or the 5-minute trigger.'
  };
}

function authorizeMediaWorkerTriggerAccess() {
  return authorizeRuntime();
}

function getMonitorEvents() {
  return listEvents_(200);
}

function getMonitorControls() {
  return controlStatus_();
}

function getMonitorMediaQueue() {
  return listMediaQueue_(30);
}

function monitorSetMediaSave(enabled) {
  return setMediaSaveEnabled_(enabled ? 'true' : 'false');
}

function monitorSetMediaTrigger(enabled) {
  return setMediaWorkerTriggerEnabled_(enabled ? 'true' : 'false');
}

function monitorRunMediaWorker() {
  return processMediaQueue();
}

function htmlPostAck_(payload) {
  var safePayload = JSON.stringify(payload || {ok: true})
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // LINE Developers Verify only requires the webhook POST to return HTTP 200.
  // ContentService responses from Apps Script can be served through a 302
  // redirect, which LINE treats as failure. HtmlService is used here as a
  // practical GAS-only acknowledgement surface.
  return HtmlService
    .createHtmlOutput(
      '<!doctype html><html><head><meta charset="utf-8"></head>' +
      '<body>OK<script type="application/json" id="falo-result">' +
      safePayload +
      '</script></body></html>'
    )
    .setTitle('FALO GAS LINE Bot Webhook OK')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function manualTestTextEvent() {
  var now = new Date();
  var fakeEvent = {
    type: 'message',
    mode: 'active',
    timestamp: now.getTime(),
    webhookEventId: 'manual-test-' + now.getTime(),
    deliveryContext: {isRedelivery: false},
    source: {type: 'user', userId: 'U_MANUAL_TEST_USER'},
    replyToken: 'manual-test-reply-token',
    message: {
      id: 'manual-test-message-' + now.getTime(),
      type: 'text',
      text: 'manual gas test'
    }
  };

  return handleWebhook_({
    parameter: {},
    postData: {
      contents: JSON.stringify({
        destination: 'U_MANUAL_TEST_BOT',
        events: [fakeEvent]
      })
    }
  });
}

function handleWebhook_(e) {
  var props = PropertiesService.getScriptProperties();
  var expectedToken = props.getProperty('WEBHOOK_TOKEN') || '';
  var suppliedToken = getParam_(e, 'token');

  if (expectedToken && suppliedToken !== expectedToken) {
    return {
      ok: true,
      dropped: true,
      reason: 'invalid webhook token',
      received: 0
    };
  }

  var body = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
  var payload;
  try {
    payload = JSON.parse(body);
  } catch (err) {
    return {
      ok: true,
      dropped: true,
      reason: 'invalid json: ' + err,
      received: 0
    };
  }

  var events = Array.isArray(payload.events) ? payload.events : [];
  if (!events.length || isLineVerifyPayload_(payload)) {
    return {
      ok: true,
      service: 'falo-gas-line-bot',
      verify_only: true,
      received: 0,
      destination: payload.destination || ''
    };
  }

  var sheet = getEventSheet_();
  var headers = ensureHeaders_(sheet);
  var rows = [];
  var received = 0;
  var skippedDuplicate = 0;
  var destination = payload.destination || '';

  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    var normalized = normalizeEvent_(event, destination);
    if (!normalized) {
      continue;
    }
    if (isDuplicate_(normalized.dedupe_key)) {
      skippedDuplicate++;
      continue;
    }

    enqueueMediaIfNeeded_(normalized);
    rows.push(toRow_(normalized, headers));
    received++;

    if (shouldAutoReply_() && event.replyToken) {
      replyText_(event.replyToken, acknowledgementText_(normalized));
    }
  }

  if (rows.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, headers.length).setValues(rows);
  }

  return {
    ok: true,
    service: 'falo-gas-line-bot',
    received: received,
    skipped_duplicate: skippedDuplicate,
    destination: destination,
    spreadsheet_id: getSpreadsheetId_()
  };
}

function isLineVerifyPayload_(payload) {
  var events = payload && Array.isArray(payload.events) ? payload.events : [];
  if (events.length !== 1) {
    return false;
  }

  var event = events[0] || {};
  var replyToken = String(event.replyToken || '');

  // LINE Developers Verify sends a synthetic webhook event. It commonly uses an
  // all-zero reply token and may include placeholder text. Return 200 quickly so
  // the console can validate the URL without waiting for Sheets I/O.
  if (/^0{16,}$/.test(replyToken)) {
    return true;
  }
  return false;
}

function normalizeEvent_(event, destination) {
  if (!event || !event.type) {
    return null;
  }

  var message = event.message || {};
  var source = event.source || {};
  var messageType = message.type || '';
  var text = messageType === 'text' ? (message.text || '') : '';
  var sourceKey = source.groupId || source.roomId || source.userId || '';
  var eventType = event.type === 'message' ? classifyMessage_(messageType, text) : 'line_' + event.type;

  return {
    captured_at: nowTaipeiIso_(),
    line_timestamp: event.timestamp || '',
    bot_alias: getBotAlias_(),
    bot_name: getBotName_(),
    bot_basic_id: getBotBasicId_(),
    destination: destination || '',
    webhook_event_id: event.webhookEventId || '',
    is_redelivery: !!(event.deliveryContext && event.deliveryContext.isRedelivery),
    source_type: source.type || '',
    source_key: sourceKey,
    user_id: source.userId || '',
    group_id: source.groupId || '',
    room_id: source.roomId || '',
    message_id: message.id || '',
    message_type: messageType,
    event_type: eventType,
    text: text,
    media_saved: false,
    media_file_id: '',
    media_file_url: '',
    media_error: '',
    raw_json: JSON.stringify(event),
    dedupe_key: event.webhookEventId || message.id || String(event.timestamp || '') + ':' + sourceKey + ':' + text
  };
}

function classifyMessage_(messageType, text) {
  if (messageType !== 'text') {
    return messageType ? 'message_' + messageType : 'message_unknown';
  }
  var normalized = String(text || '').trim().replace(/\s+/g, ' ');
  if (/^(#task|task|任務|待辦)/i.test(normalized)) {
    return 'task_candidate';
  }
  if (/^(#risk|risk|風險)/i.test(normalized)) {
    return 'risk_candidate';
  }
  if (/^(#note|note|知識|筆記)/i.test(normalized)) {
    return 'knowledge_candidate';
  }
  return 'message_text';
}

function toRow_(item, headers) {
  return headers.map(function(header) {
    return Object.prototype.hasOwnProperty.call(item, header) ? item[header] : '';
  });
}

function getEventSheet_() {
  var spreadsheet = SpreadsheetApp.openById(getSpreadsheetId_());
  var sheet = spreadsheet.getSheetByName(EVENT_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(EVENT_SHEET_NAME);
  }
  ensureHeaders_(sheet);
  return sheet;
}

function ensureHeaders_(sheet) {
  var lastColumn = Math.max(sheet.getLastColumn(), HEADERS.length);
  var existing = [];
  if (sheet.getLastRow() >= 1 && sheet.getLastColumn() > 0) {
    existing = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(function(value) {
      return String(value || '').trim();
    }).filter(function(value) {
      return value;
    });
  }

  if (!existing.length) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    return HEADERS.slice();
  }

  var changed = false;
  for (var i = 0; i < HEADERS.length; i++) {
    if (existing.indexOf(HEADERS[i]) === -1) {
      existing.push(HEADERS[i]);
      changed = true;
    }
  }
  if (changed) {
    sheet.getRange(1, 1, 1, existing.length).setValues([existing]);
  }
  sheet.setFrozenRows(1);
  return existing;
}

function listEvents_(limit, sourceKey, startDateStr, endDateStr) {
  var sheet = getEventSheet_();
  var headers = ensureHeaders_(sheet);
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return {
      ok: true,
      service: 'falo-gas-line-bot',
      spreadsheet_id: getSpreadsheetId_(),
      count: 0,
      events: []
    };
  }

  // Load all values to filter them in memory
  var values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  var events = sheetRowsToObjects_(headers, values).reverse();

  // Filter by chat ID (source_key) if provided
  if (sourceKey) {
    events = events.filter(function(evt) {
      return String(evt.source_key) === String(sourceKey);
    });
  }

  // Filter by start date if provided
  if (startDateStr) {
    var startDate = new Date(startDateStr);
    events = events.filter(function(evt) {
      var ts = evt.line_timestamp || evt.captured_at;
      if (!ts) return false;
      return new Date(ts) >= startDate;
    });
  }

  // Filter by end date if provided
  if (endDateStr) {
    var endDate = new Date(endDateStr);
    events = events.filter(function(evt) {
      var ts = evt.line_timestamp || evt.captured_at;
      if (!ts) return false;
      return new Date(ts) <= endDate;
    });
  }

  // Apply limit
  if (limit && events.length > limit) {
    events = events.slice(0, limit);
  }

  return {
    ok: true,
    service: 'falo-gas-line-bot',
    spreadsheet_id: getSpreadsheetId_(),
    count: events.length,
    events: events
  };
}

function listMediaQueue_(limit) {
  var sheet = getMediaQueueSheet_();
  var headers = getSheetWithHeaders_(MEDIA_QUEUE_SHEET_NAME, MEDIA_QUEUE_HEADERS)
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map(String);
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return {
      ok: true,
      service: 'falo-gas-line-bot',
      count: 0,
      media_queue: []
    };
  }

  var startRow = Math.max(2, lastRow - limit + 1);
  var numRows = lastRow - startRow + 1;
  var values = sheet.getRange(startRow, 1, numRows, headers.length).getValues();
  var queue = sheetRowsToObjects_(headers, values).reverse();

  return {
    ok: true,
    service: 'falo-gas-line-bot',
    count: queue.length,
    media_queue: queue
  };
}

function maybeSaveMedia_(item) {
  if (!item || !item.message_id || item.message_type === 'text') {
    return;
  }

  var mode = getMediaSaveMode_();
  if (mode === 'none' || mode === 'metadata') {
    return;
  }
  if (mode === 'important' && !isImportantContext_(item)) {
    return;
  }

  try {
    var accessToken = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN') || '';
    if (!accessToken) {
      item.media_error = 'LINE_CHANNEL_ACCESS_TOKEN not set';
      return;
    }

    var response = UrlFetchApp.fetch(Utilities.formatString(CONTENT_ENDPOINT, item.message_id), {
      method: 'get',
      headers: {Authorization: 'Bearer ' + accessToken},
      muteHttpExceptions: true
    });

    var code = response.getResponseCode();
    if (code < 200 || code >= 300) {
      item.media_error = describeLineContentHttpError_(code, response);
      return;
    }

    var blob = response.getBlob();
    if (!blob || blob.getBytes().length === 0) {
      item.media_error = 'content api returned 200 but the media blob is empty';
      return;
    }
    var contentType = blob.getContentType() || 'application/octet-stream';
    var filename = buildMediaFilename_(item, contentType);

    blob.setName(filename);
    var folder = getMediaFolder_();
    var file = folder.createFile(blob);
    item.media_saved = true;
    item.media_file_id = file.getId();
    item.media_file_url = file.getUrl();
  } catch (err) {
    item.media_error = String(err);
  }
}

function enqueueMediaIfNeeded_(item) {
  if (!item || !item.message_id || item.message_type === 'text') {
    return;
  }
  if (['image', 'video', 'audio', 'file'].indexOf(item.message_type) === -1) {
    return;
  }

  var mode = getMediaSaveMode_();
  if (mode === 'none') {
    item.media_error = 'media queue skipped: MEDIA_SAVE_MODE=none';
    return;
  }

  var sheet = getMediaQueueSheet_();
  if (findMediaQueueRowByMessageId_(sheet, item.message_id) > 0) {
    item.media_error = 'media already queued';
    return;
  }

  var row = toRow_({
    queued_at: nowTaipeiIso_(),
    message_id: item.message_id,
    message_type: item.message_type,
    source_type: item.source_type,
    source_id: item.source_key,
    user_id: item.user_id,
    group_id: item.group_id,
    room_id: item.room_id,
    line_timestamp: item.line_timestamp,
    status: 'pending',
    attempt_count: 0,
    processing_started_at: '',
    last_attempt_at: '',
    last_error: '',
    drive_file_id: '',
    drive_file_url: '',
    raw_json: item.raw_json
  }, MEDIA_QUEUE_HEADERS);
  sheet.appendRow(row);
  item.media_error = isMediaSaveEnabled_()
    ? 'media queued for scheduled Drive upload'
    : 'media queued; upload disabled';
}

function processMediaQueue() {
  var started = Date.now();
  var result = {
    ok: true,
    service: 'falo-gas-line-bot',
    worker: MEDIA_WORKER_FUNCTION,
    media_save_enabled: isMediaSaveEnabled_(),
    processed: 0,
    saved: 0,
    failed: 0,
    retried: 0,
    skipped: 0,
    errors: [],
    files: [],
    stopped_reason: '',
    time: nowTaipeiIso_()
  };

  if (!isMediaSaveEnabled_()) {
    result.stopped_reason = 'MEDIA_SAVE_ENABLED=false';
    return result;
  }

  var sheet = getMediaQueueSheet_();
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) {
    result.stopped_reason = 'queue empty';
    return result;
  }

  var headers = values[0].map(String);
  var index = headerIndexMap_(headers);

  for (var r = 1; r < values.length; r++) {
    if (result.processed >= MEDIA_WORKER_MAX_FILES) {
      result.stopped_reason = 'max files per run reached';
      break;
    }
    if ((Date.now() - started) / 1000 > MEDIA_WORKER_MAX_SECONDS) {
      result.stopped_reason = 'max worker seconds reached';
      break;
    }

    var row = values[r];
    var status = String(row[index.status] || '');
    var attempts = Number(row[index.attempt_count] || 0);
    if (status !== 'pending' && status !== 'retry') {
      continue;
    }
    if (attempts >= MEDIA_WORKER_MAX_ATTEMPTS) {
      updateQueueRow_(sheet, r + 1, index, {
        status: 'failed',
        last_attempt_at: nowTaipeiIso_(),
        last_error: 'max attempts reached'
      });
      result.failed++;
      continue;
    }

    var messageId = String(row[index.message_id] || '');
    var messageType = String(row[index.message_type] || 'media');
    var lineTimestamp = row[index.line_timestamp] || '';
    var sourceType = String(row[index.source_type] || '');
    var sourceId = String(row[index.source_id] || '');
    var userId = String(row[index.user_id] || '');
    var rawJson = String(row[index.raw_json] || '');
    var originalFileName = originalFilenameFromRawJson_(rawJson);

    updateQueueRow_(sheet, r + 1, index, {
      status: 'processing',
      processing_started_at: nowTaipeiIso_(),
      attempt_count: attempts + 1,
      last_error: ''
    });

    try {
      var blob = fetchLineContentBlob_(messageId);
      var contentType = blob.getContentType() || 'application/octet-stream';
      var filename = buildMediaFilename_({
        line_timestamp: lineTimestamp,
        bot_alias: getBotAlias_(),
        source_key: sourceId,
        user_id: userId,
        message_type: messageType,
        message_id: messageId,
        original_file_name: originalFileName
      }, contentType);

      blob.setName(filename);
      var folder = getMediaFolder_();
      var file = folder.createFile(blob);
      var fileUrl = file.getUrl();
      appendMediaFileRecord_({
        saved_at: nowTaipeiIso_(),
        message_id: messageId,
        message_type: messageType,
        stored_file_name: filename,
        mime_type: contentType,
        drive_file_id: file.getId(),
        drive_file_url: fileUrl,
        drive_folder_id: folder.getId(),
        source_type: sourceType,
        source_id: sourceId,
        user_id: userId,
        line_timestamp: lineTimestamp
      });
      updateQueueRow_(sheet, r + 1, index, {
        status: 'saved',
        last_attempt_at: nowTaipeiIso_(),
        last_error: '',
        drive_file_id: file.getId(),
        drive_file_url: fileUrl
      });
      result.saved++;
      result.files.push({
        message_id: messageId,
        file_name: filename,
        drive_file_url: fileUrl
      });
    } catch (err) {
      var errorText = String(err).slice(0, 500);
      var nextStatus = attempts + 1 >= MEDIA_WORKER_MAX_ATTEMPTS ? 'failed' : 'retry';
      updateQueueRow_(sheet, r + 1, index, {
        status: nextStatus,
        last_attempt_at: nowTaipeiIso_(),
        last_error: errorText
      });
      result.errors.push({
        message_id: messageId,
        status: nextStatus,
        error: errorText
      });
      if (nextStatus === 'failed') {
        result.failed++;
      } else {
        result.retried++;
      }
    }
    result.processed++;
  }

  if (!result.stopped_reason) {
    result.stopped_reason = 'queue scan finished';
  }
  return result;
}

function fetchLineContentBlob_(messageId) {
  var accessToken = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN') || '';
  if (!accessToken) {
    throw new Error('LINE_CHANNEL_ACCESS_TOKEN not set');
  }
  var response = UrlFetchApp.fetch(Utilities.formatString(CONTENT_ENDPOINT, messageId), {
    method: 'get',
    headers: {Authorization: 'Bearer ' + accessToken},
    muteHttpExceptions: true
  });
  var code = response.getResponseCode();
  if (code < 200 || code >= 300) {
    throw new Error(describeLineContentHttpError_(code, response));
  }
  var blob = response.getBlob();
  if (!blob || blob.getBytes().length === 0) {
    throw new Error('content api returned 200 but the media blob is empty');
  }
  return blob;
}

function describeLineContentHttpError_(code, response) {
  var body = '';
  var location = '';
  try {
    body = response.getContentText().slice(0, 200);
  } catch (err) {
    body = '[binary or unreadable response body]';
  }
  try {
    var headers = response.getAllHeaders ? response.getAllHeaders() : {};
    location = headers.Location || headers.location || '';
  } catch (err2) {
    location = '';
  }

  var hint = '';
  if (code === 301 || code === 302 || code === 303 || code === 307 || code === 308) {
    hint = ' Redirect returned instead of media binary. Check that the worker is calling LINE Content API directly with the matching official account access token; do not use a browser/proxy URL for media download.';
    if (location) {
      hint += ' Location=' + location;
    }
  } else if (code === 401 || code === 403) {
    hint = ' Authorization failed. Check LINE_CHANNEL_ACCESS_TOKEN and make sure it belongs to the same bot that received the message.';
  } else if (code === 404 || code === 410) {
    hint = ' Media may be expired, deleted by LINE, or the messageId may not belong to this bot.';
  } else if (code >= 500) {
    hint = ' LINE Content API or network service may be temporarily unavailable; retry later.';
  }

  return 'LINE Content API returned HTTP ' + code + '.' + hint + ' Body=' + body;
}

function getMediaQueueSheet_() {
  return getSheetWithHeaders_(MEDIA_QUEUE_SHEET_NAME, MEDIA_QUEUE_HEADERS);
}

function getMediaFilesSheet_() {
  return getSheetWithHeaders_(MEDIA_FILES_SHEET_NAME, MEDIA_FILES_HEADERS);
}

function getReferenceSheet_() {
  return getSheetWithHeaders_(REFERENCE_SHEET_NAME, REFERENCE_HEADERS);
}

function getSheetWithHeaders_(sheetName, headers) {
  var spreadsheet = SpreadsheetApp.openById(getSpreadsheetId_());
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  ensureCustomHeaders_(sheet, headers);
  return sheet;
}

function ensureCustomHeaders_(sheet, headers) {
  if (sheet.getLastRow() < 1 || sheet.getLastColumn() < 1) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    return headers.slice();
  }
  var lastColumn = Math.max(sheet.getLastColumn(), headers.length);
  var existing = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(function(value) {
    return String(value || '').trim();
  }).filter(Boolean);
  var changed = false;
  for (var i = 0; i < headers.length; i++) {
    if (existing.indexOf(headers[i]) === -1) {
      existing.push(headers[i]);
      changed = true;
    }
  }
  if (changed) {
    sheet.getRange(1, 1, 1, existing.length).setValues([existing]);
  }
  sheet.setFrozenRows(1);
  return existing;
}

function findMediaQueueRowByMessageId_(sheet, messageId) {
  if (!messageId || sheet.getLastRow() <= 1) {
    return -1;
  }
  var values = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0] || '') === String(messageId)) {
      return i + 2;
    }
  }
  return -1;
}

function appendMediaFileRecord_(record) {
  getMediaFilesSheet_().appendRow(toRow_(record, MEDIA_FILES_HEADERS));
}

function headerIndexMap_(headers) {
  var map = {};
  for (var i = 0; i < headers.length; i++) {
    map[headers[i]] = i;
  }
  return map;
}

function updateQueueRow_(sheet, rowNumber, index, patch) {
  var headers = Object.keys(index);
  var row = sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0];
  Object.keys(patch).forEach(function(key) {
    if (Object.prototype.hasOwnProperty.call(index, key)) {
      row[index[key]] = patch[key];
    }
  });
  sheet.getRange(rowNumber, 1, 1, headers.length).setValues([row]);
}

function isMediaSaveEnabled_() {
  var value = PropertiesService.getScriptProperties().getProperty('MEDIA_SAVE_ENABLED') || DEFAULT_MEDIA_SAVE_ENABLED;
  return /^(1|true|yes|on)$/i.test(value);
}

function setMediaSaveEnabled_(enabled) {
  var normalized = /^(1|true|yes|on)$/i.test(String(enabled || '')) ? 'true' : 'false';
  PropertiesService.getScriptProperties().setProperty('MEDIA_SAVE_ENABLED', normalized);
  if (normalized === 'true' && getMediaSaveMode_() === 'metadata') {
    PropertiesService.getScriptProperties().setProperty('MEDIA_SAVE_MODE', 'all');
  }
  writeConfigSheet_();
  return controlStatus_();
}

function setMediaWorkerTriggerEnabled_(enabled) {
  var turnOn = /^(1|true|yes|on)$/i.test(String(enabled || ''));
  deleteMediaWorkerTriggers_();
  if (turnOn) {
    ScriptApp.newTrigger(MEDIA_WORKER_FUNCTION)
      .timeBased()
      .everyMinutes(MEDIA_WORKER_INTERVAL_MINUTES)
      .create();
  }
  writeConfigSheet_();
  return controlStatus_();
}

function deleteMediaWorkerTriggers_() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction && triggers[i].getHandlerFunction() === MEDIA_WORKER_FUNCTION) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

function isMediaWorkerTriggerEnabled_() {
  var triggers = getMediaWorkerTriggersSafely_().triggers;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction && triggers[i].getHandlerFunction() === MEDIA_WORKER_FUNCTION) {
      return true;
    }
  }
  return false;
}

function getMediaWorkerTriggersSafely_() {
  try {
    return {
      triggers: ScriptApp.getProjectTriggers(),
      error: ''
    };
  } catch (err) {
    return {
      triggers: [],
      error: String(err && err.message ? err.message : err)
    };
  }
}

function controlStatus_() {
  var queueSheet = getMediaQueueSheet_();
  var filesSheet = getMediaFilesSheet_();
  var queueCounts = countQueueStatuses_(queueSheet);
  var spreadsheetId = getSpreadsheetId_();
  var folderId = getMediaFolderId_();
  var triggerProbe = getMediaWorkerTriggersSafely_();
  return {
    ok: true,
    service: 'falo-gas-line-bot',
    web_app_url: getWebAppUrl_(),
    spreadsheet_id: spreadsheetId,
    spreadsheet_url: 'https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/edit',
    media_folder_id: folderId,
    media_folder_url: 'https://drive.google.com/drive/folders/' + folderId,
    media_save_enabled: isMediaSaveEnabled_(),
    media_save_mode: getMediaSaveMode_(),
    media_worker_trigger_enabled: hasMediaWorkerTrigger_(triggerProbe.triggers),
    media_worker_trigger_error: triggerProbe.error,
    worker_interval_minutes: MEDIA_WORKER_INTERVAL_MINUTES,
    pending_media: queueCounts.pending || 0,
    retry_media: queueCounts.retry || 0,
    failed_media: queueCounts.failed || 0,
    saved_media: Math.max(0, filesSheet.getLastRow() - 1),
    time: nowTaipeiIso_()
  };
}

function hasMediaWorkerTrigger_(triggers) {
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction && triggers[i].getHandlerFunction() === MEDIA_WORKER_FUNCTION) {
      return true;
    }
  }
  return false;
}

function countQueueStatuses_(sheet) {
  var counts = {};
  if (sheet.getLastRow() <= 1) {
    return counts;
  }
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  var index = headers.indexOf('status') + 1;
  if (index <= 0) {
    return counts;
  }
  var values = sheet.getRange(2, index, sheet.getLastRow() - 1, 1).getValues();
  values.forEach(function(row) {
    var status = String(row[0] || 'empty');
    counts[status] = (counts[status] || 0) + 1;
  });
  return counts;
}

function getMediaFolderId_() {
  return PropertiesService.getScriptProperties().getProperty('MEDIA_FOLDER_ID') || DEFAULT_MEDIA_FOLDER_ID;
}

function buildMediaFilename_(item, contentType) {
  var originalName = item.original_file_name || '';
  var originalBase = originalName ? stripFilenameExtension_(originalName) : '';
  var extension = extensionForContentType_(contentType);
  if (extension === '.bin') {
    extension = extensionFromFilename_(originalName) || extension;
  }
  var parts = [
    formatDateForFilename_(new Date(Number(item.line_timestamp) || new Date())),
    safeFilenamePart_(item.bot_alias || 'bot'),
    safeFilenamePart_(item.source_key || 'unknown-source'),
    safeFilenamePart_(item.user_id || 'nouser'),
    safeFilenamePart_(item.message_type || 'media')
  ];
  if (originalBase) {
    parts.push(safeFilenamePart_(originalBase));
  }
  parts.push(
    safeFilenamePart_(item.message_id || 'nomsg')
  );
  return parts.join('_') + extension;
}

function getMediaSaveMode_() {
  var value = PropertiesService.getScriptProperties().getProperty('MEDIA_SAVE_MODE') || DEFAULT_MEDIA_SAVE_MODE;
  value = value.toLowerCase();
  if (['all', 'important', 'metadata', 'none'].indexOf(value) === -1) {
    return DEFAULT_MEDIA_SAVE_MODE;
  }
  return value;
}

function isImportantContext_(item) {
  var keywords = PropertiesService.getScriptProperties().getProperty('IMPORTANT_KEYWORDS') || '';
  if (!keywords.trim()) {
    return false;
  }
  var parts = keywords.split(',').map(function(part) {
    return part.trim();
  }).filter(Boolean);
  var raw = item.raw_json || '';
  for (var i = 0; i < parts.length; i++) {
    if (raw.indexOf(parts[i]) !== -1) {
      return true;
    }
  }
  return false;
}

function getMediaFolder_() {
  var props = PropertiesService.getScriptProperties();
  var folderId = props.getProperty('MEDIA_FOLDER_ID') || DEFAULT_MEDIA_FOLDER_ID;
  if (folderId) {
    if (!props.getProperty('MEDIA_FOLDER_ID')) {
      props.setProperty('MEDIA_FOLDER_ID', folderId);
    }
    return DriveApp.getFolderById(folderId);
  }
  var folder = DriveApp.createFolder('FALO GAS LINE Bot Media');
  props.setProperty('MEDIA_FOLDER_ID', folder.getId());
  return folder;
}

function extensionForContentType_(contentType) {
  var map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'video/mp4': '.mp4',
    'audio/mpeg': '.mp3',
    'audio/mp4': '.m4a',
    'application/pdf': '.pdf',
    'application/zip': '.zip',
    'application/x-zip': '.zip',
    'application/x-zip-compressed': '.zip',
    'multipart/x-zip': '.zip',
    'application/x-7z-compressed': '.7z',
    'application/vnd.rar': '.rar',
    'text/plain': '.txt',
    'text/csv': '.csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx'
  };
  return map[String(contentType || '').split(';')[0]] || '.bin';
}

function extensionFromFilename_(filename) {
  var match = String(filename || '').match(/(\.[A-Za-z0-9]{1,12})$/);
  return match ? match[1].toLowerCase() : '';
}

function stripFilenameExtension_(filename) {
  return String(filename || '').replace(/(\.[A-Za-z0-9]{1,12})$/, '');
}

function originalFilenameFromRawJson_(rawJson) {
  try {
    var parsed = JSON.parse(rawJson || '{}');
    var message = parsed && parsed.message ? parsed.message : {};
    return message.fileName || message.file_name || '';
  } catch (err) {
    return '';
  }
}

function formatDateForFilename_(date) {
  return Utilities.formatDate(date, TIME_ZONE, 'yyyyMMdd-HHmmss');
}

function safeFilenamePart_(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32) || 'unknown';
}

function isDuplicate_(dedupeKey) {
  if (!dedupeKey) {
    return false;
  }
  var cache = CacheService.getScriptCache();
  if (cache.get(dedupeKey)) {
    return true;
  }
  cache.put(dedupeKey, '1', 21600);
  return false;
}

function shouldAutoReply_() {
  var value = PropertiesService.getScriptProperties().getProperty('AUTO_REPLY') || 'false';
  return /^(1|true|yes|on)$/i.test(value);
}

function acknowledgementText_(item) {
  if (item.text) {
    return '已收到文字：' + item.text.replace(/\s+/g, ' ').slice(0, 80);
  }
  return '已收到事件。';
}

function replyText_(replyToken, text) {
  var accessToken = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN') || '';
  if (!accessToken) {
    return;
  }
  UrlFetchApp.fetch(REPLY_ENDPOINT, {
    method: 'post',
    contentType: 'application/json',
    headers: {Authorization: 'Bearer ' + accessToken},
    payload: JSON.stringify({
      replyToken: replyToken,
      messages: [{type: 'text', text: text.slice(0, 5000)}]
    }),
    muteHttpExceptions: true
  });
}

function writeConfigSheet_() {
  var spreadsheet = SpreadsheetApp.openById(getSpreadsheetId_());
  var sheet = spreadsheet.getSheetByName(CONFIG_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG_SHEET_NAME);
  }
  sheet.clear();
  sheet.appendRow(['key', 'value', 'note']);
  var config = publicConfig_();
  var rows = [
    ['service', config.service, 'GAS gateway service name'],
    ['bot_alias', config.bot.alias, 'Internal alias for AI commander'],
    ['bot_name', config.bot.name, 'LINE official account display name'],
    ['bot_basic_id', config.bot.basic_id, 'LINE official account basic ID'],
    ['web_app_url', config.web_app_url, 'Current GAS Web App exec URL when available'],
    ['spreadsheet_id', config.spreadsheet_id, 'Storage target'],
    ['spreadsheet_url', config.spreadsheet_url, 'Open Sheet directly'],
    ['media_folder_id', config.media_folder_id, 'Drive folder for queued media upload'],
    ['media_folder_url', config.media_folder_url, 'Open Drive folder directly'],
    ['media_save_enabled', config.media_save_enabled, 'true means scheduled worker may upload media to Drive'],
    ['media_save_mode', config.media_save_mode, 'all / important / metadata / none'],
    ['media_worker_trigger_enabled', config.media_worker_trigger_enabled, 'true means Apps Script time trigger is installed'],
    ['auto_reply', config.auto_reply, 'Keep false for collection-only mode']
  ];
  sheet.getRange(2, 1, rows.length, 3).setValues(rows);
  sheet.setFrozenRows(1);
}

function writeReferenceSheet_() {
  var sheet = getReferenceSheet_();
  if (sheet.getLastRow() > 1) {
    return;
  }
  var now = nowTaipeiIso_();
  var rows = [
    [
      'LINE media retention',
      'LINE message media content can be downloaded by messageId through the content API, but LINE states that content is automatically deleted after a certain period and does not guarantee how long it is stored.',
      'https://developers.line.biz/en/reference/messaging-api/#get-content',
      'Do not wait too long before downloading media. This PoC uses a fast webhook ack plus a 5-minute queue worker so LINE Verify and real webhooks stay responsive while media is still collected soon enough.',
      now
    ],
    [
      'Trigger safety',
      'Apps Script time triggers can keep running quietly if not explicitly removed.',
      '',
      'Expose trigger status and start/stop buttons in the monitor UI. The operator should see whether processMediaQueue is installed before leaving the project idle.',
      now
    ],
    [
      'Collection-only default',
      'The default mode is to collect events and queue media metadata. Auto reply is disabled.',
      '',
      'This avoids consuming LINE official account message quota during pure monitoring and data collection.',
      now
    ]
  ];
  sheet.getRange(2, 1, rows.length, REFERENCE_HEADERS.length).setValues(rows);
}

function publicConfig_() {
  var controls = controlStatus_();
  return {
    ok: true,
    service: 'falo-gas-line-bot',
    web_app_url: controls.web_app_url,
    spreadsheet_id: getSpreadsheetId_(),
    spreadsheet_url: controls.spreadsheet_url,
    media_folder_id: controls.media_folder_id,
    media_folder_url: controls.media_folder_url,
    bot: {
      alias: getBotAlias_(),
      name: getBotName_(),
      basic_id: getBotBasicId_()
    },
    media_save_enabled: controls.media_save_enabled,
    media_save_mode: getMediaSaveMode_(),
    media_worker_trigger_enabled: controls.media_worker_trigger_enabled,
    auto_reply: shouldAutoReply_(),
    time: nowTaipeiIso_()
  };
}

function publicConfigJson_() {
  return JSON.stringify(publicConfig_());
}

function healthPayload_() {
  var sheet = getEventSheet_();
  return {
    ok: true,
    service: 'falo-gas-line-bot',
    spreadsheet_id: getSpreadsheetId_(),
    sheet_name: EVENT_SHEET_NAME,
    stored_rows: Math.max(0, sheet.getLastRow() - 1),
    bot: {
      alias: getBotAlias_(),
      name: getBotName_(),
      basic_id: getBotBasicId_()
    },
    time: nowTaipeiIso_()
  };
}

function getSpreadsheetId_() {
  return PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || DEFAULT_SPREADSHEET_ID;
}

function getBotAlias_() {
  return PropertiesService.getScriptProperties().getProperty('BOT_ALIAS') || DEFAULT_BOT_ALIAS;
}

function getBotName_() {
  return PropertiesService.getScriptProperties().getProperty('BOT_NAME') || DEFAULT_BOT_NAME;
}

function getBotBasicId_() {
  return PropertiesService.getScriptProperties().getProperty('BOT_BASIC_ID') || DEFAULT_BOT_BASIC_ID;
}

function getWebAppUrl_() {
  try {
    return ScriptApp.getService().getUrl() || '';
  } catch (err) {
    return '';
  }
}

function setDefaultProperty_(props, key, value) {
  if (!props.getProperty(key)) {
    props.setProperty(key, value);
  }
}

function isViewerAuthorized_(e) {
  var expectedToken = PropertiesService.getScriptProperties().getProperty('VIEWER_TOKEN') || '';
  return !expectedToken || getParam_(e, 'token') === expectedToken;
}

function getParam_(e, key) {
  return e && e.parameter && e.parameter[key] ? String(e.parameter[key]) : '';
}

function parseLimit_(value, defaultValue) {
  var parsed = Number(value || defaultValue);
  if (!isFinite(parsed) || parsed < 1) {
    return defaultValue;
  }
  return Math.min(Math.floor(parsed), 500);
}

function jsonOutput_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
