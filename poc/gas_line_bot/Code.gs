/**
 * Code.gs - Falo IM Gateway & DB Connector (v2.x SQL-mode)
 *
 * This Apps Script acts solely as a Relational Database + Object Storage driver,
 * plus an optional Webhook receiver. All business logic is decoupled to Cloudflare.
 */

var MASTER_SPREADSHEET_ID = '1_Pfzg81jyXP--08G-65auMSc_61tHt6182BGxfxVy0Q';
var SECURITY_TOKEN = 'falo_secure_token_12345';
var TIME_ZONE = 'Asia/Taipei';

// ----------------------------------------------------
// 1. HTTP GET ROUTER (Database Queries)
// ----------------------------------------------------
function doGet(e) {
  var action = e.parameter.action;
  var token = e.parameter.token;

  // Render Diagnostics Dashboard when no action parameter is provided (direct browser access)
  if (!action) {
    return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Falo IM v2.x Diagnostics Dashboard')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Simple token authentication for API requests
  if (token !== SECURITY_TOKEN) {
    return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
  }

  var ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
  ensureSetup(ss);

  // A. action=get_chats (Returns unique active chat groups)
  if (action === 'get_chats') {
    try {
      var sheet = ss.getSheetByName('chat_events');
      var values = sheet.getDataRange().getValues();
      var chatsMap = {};
      
      for (var i = 1; i < values.length; i++) {
        var bot_alias = values[i][1];
        var chat_id = values[i][2];
        var key = bot_alias + '/' + chat_id;
        chatsMap[key] = { bot_alias: bot_alias, chat_id: chat_id };
      }

      var chatsList = [];
      for (var k in chatsMap) {
        chatsList.push(chatsMap[k]);
      }
      return jsonResponse({ ok: true, data: chatsList });
    } catch (err) {
      return jsonResponse({ ok: false, error: err.message }, 500);
    }
  }

  // B. action=query (SQL-like range filter)
  if (action === 'query') {
    try {
      var tableName = e.parameter.table || 'chat_events';
      var chatId = e.parameter.chat_id;
      var botAlias = e.parameter.bot_alias;
      var startDate = e.parameter.start_date; // ISO string
      var endDate = e.parameter.end_date;     // ISO string
      var limit = parseInt(e.parameter.limit || '1000', 10);

      var sheet = ss.getSheetByName(tableName);
      if (!sheet) {
        return jsonResponse({ ok: false, error: 'Table ' + tableName + ' not found' }, 404);
      }

      var values = sheet.getDataRange().getValues();
      var headers = values[0];
      var results = [];

      var startMs = startDate ? new Date(startDate).getTime() : 0;
      var endMs = endDate ? new Date(endDate).getTime() : Infinity;

      // Filter rows (ignoring header)
      for (var i = 1; i < values.length; i++) {
        var row = values[i];
        var rowObj = {};
        for (var j = 0; j < headers.length; j++) {
          rowObj[headers[j]] = row[j];
        }

        // Apply filters
        if (botAlias && rowObj.bot_alias !== botAlias) continue;
        if (chatId && rowObj.chat_id !== chatId) continue;
        
        var capTime = new Date(rowObj.captured_at).getTime();
        if (startDate && capTime < startMs) continue;
        if (endDate && capTime > endMs) continue;

        results.push(rowObj);
      }

      // Handle limit
      if (results.length > limit) {
        results = results.slice(-limit); // get the latest ones
      }

      return jsonResponse({ ok: true, count: results.length, data: results });
    } catch (err) {
      return jsonResponse({ ok: false, error: err.message }, 500);
    }
  }

  // C. action=get_raw_file (Retrieve raw text log from Google Drive)
  if (action === 'get_raw_file') {
    try {
      var chatId = e.parameter.chat_id;
      var botAlias = e.parameter.bot_alias;
      if (!chatId || !botAlias) {
        return jsonResponse({ ok: false, error: 'Missing chat_id or bot_alias' }, 400);
      }

      // Lookup folder ID in configs
      var folderId = getBotDriveFolderId(ss, botAlias);
      var folder = folderId ? DriveApp.getFolderById(folderId) : DriveApp.getRootFolder();
      var filename = 'raw_' + botAlias + '_' + chatId + '.txt';
      var files = folder.getFilesByName(filename);

      if (files.hasNext()) {
        var file = files.next();
        var fileContent = file.getBlob().getDataAsString();
        return ContentService.createTextOutput(fileContent).setMimeType(ContentService.MimeType.TEXT);
      }

      return jsonResponse({ ok: false, error: 'Raw file not found' }, 404);
    } catch (err) {
      return jsonResponse({ ok: false, error: err.message }, 500);
    }
  }

  return jsonResponse({ ok: false, error: 'Unknown action' }, 400);
}

// ----------------------------------------------------
// 2. HTTP POST ROUTER (ETL Write / Webhook Ingress)
// ----------------------------------------------------
function doPost(e) {
  var ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
  ensureSetup(ss);

  // Simple authentication or LINE Webhook detection
  var token = e.parameter.token;
  
  // If no token is provided, verify if it's a LINE Webhook event
  if (!token) {
    return handleLineWebhook(e.postData.contents);
  }

  if (token !== SECURITY_TOKEN) {
    return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
  }

  var action = e.parameter.action;
  var ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);

  // A. action=upload_logs (Saves raw file to Drive, appends parsed events to Sheets)
  if (action === 'upload_logs') {
    try {
      var payload = JSON.parse(e.postData.contents);
      var chatId = payload.chat_id;
      var botAlias = payload.bot_alias;
      var rawText = payload.raw_text;
      var parsedEvents = payload.parsed_events || [];

      if (!chatId || !botAlias) {
        return jsonResponse({ ok: false, error: 'Missing chat_id or bot_alias' }, 400);
      }

      // Step 1: Save/overwrite raw text in Google Drive folder
      var folderId = getBotDriveFolderId(ss, botAlias);
      var folder = folderId ? DriveApp.getFolderById(folderId) : DriveApp.getRootFolder();
      var filename = 'raw_' + botAlias + '_' + chatId + '.txt';
      var files = folder.getFilesByName(filename);
      
      if (files.hasNext()) {
        // Overwrite
        var file = files.next();
        file.setContent(rawText);
      } else {
        // Create new
        folder.createFile(filename, rawText);
      }

      // Step 2: Append parsed events to chat_events Sheet tab in batch
      var sheet = ss.getSheetByName('chat_events');
      if (parsedEvents.length > 0) {
        var startRow = sheet.getLastRow() + 1;
        var startId = startRow - 1; // Auto ID mock
        
        var values = parsedEvents.map(function(evt, index) {
          return [
            startId + index, // id
            botAlias,
            chatId,
            evt.message_id || '',
            evt.captured_at || new Date().toISOString(),
            evt.sender_name || 'Anonymous',
            evt.sender_role || 'client',
            evt.message_type || 'text',
            evt.text_content || '',
            evt.metadata_json || '{}'
          ];
        });
        
        sheet.getRange(startRow, 1, values.length, 10).setValues(values);
      }

      return jsonResponse({ ok: true, saved_raw: true, saved_events_count: parsedEvents.length });
    } catch (err) {
      return jsonResponse({ ok: false, error: err.message }, 500);
    }
  }

  return jsonResponse({ ok: false, error: 'Unknown action' }, 400);
}

// ----------------------------------------------------
// 3. LINE WEBHOOK HANDLER
// ----------------------------------------------------
function handleLineWebhook(webhookPayload) {
  try {
    var eventData = JSON.parse(webhookPayload);
    var events = eventData.events || [];
    if (events.length === 0) {
      return jsonResponse({ ok: true });
    }

    var ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    var botConfigs = getBotConfigsMap(ss);

    // Identify which bot this webhook belongs to (using destination basic ID)
    var destination = eventData.destination;
    var matchedBot = null;
    
    // Look up in configurations
    for (var alias in botConfigs) {
      var cfg = botConfigs[alias];
      // In PoC, standard token maps to standard bot, gas token maps to gas bot
      if (destination && destination.indexOf(alias) !== -1) {
        matchedBot = cfg;
        break;
      }
    }
    
    // Fallback to gas bot if not matched
    if (!matchedBot) {
      matchedBot = botConfigs['gas'] || { bot_alias: 'gas', bot_name: 'FALO IM Bot GAS Test', line_channel_token: '' };
    }

    var sheet = ss.getSheetByName('chat_events');
    var startRow = sheet.getLastRow() + 1;
    var startId = startRow - 1;
    var valuesToAppend = [];

    events.forEach(function(evt) {
      if (evt.type !== 'message') return; // Only log messages for now

      var source = evt.source || {};
      var chatId = source.groupId || source.roomId || source.userId || '';
      var userId = source.userId || '';
      var message = evt.message || {};

      var textContent = message.text || '';
      if (message.type !== 'text') {
        textContent = '[' + message.type.toUpperCase() + ']';
      }

      // Fetch user profile display name if token is available
      var senderName = 'User_' + userId.substring(0, 4);
      if (userId && matchedBot.line_channel_token) {
        var profileName = fetchLineProfileName(userId, matchedBot.line_channel_token);
        if (profileName) senderName = profileName;
      }

      valuesToAppend.push([
        startId + valuesToAppend.length, // id
        matchedBot.bot_alias,
        chatId,
        message.id || '',
        new Date(evt.timestamp).toISOString(),
        senderName,
        'client', // webhook incoming message is always client role
        message.type || 'text',
        textContent,
        JSON.stringify(evt)
      ]);
    });

    if (valuesToAppend.length > 0) {
      sheet.getRange(startRow, 1, valuesToAppend.length, 10).setValues(valuesToAppend);
    }

    return jsonResponse({ ok: true, logged_count: valuesToAppend.length });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
}

// ----------------------------------------------------
// 4. HELPER FUNCTIONS
// ----------------------------------------------------
function jsonResponse(data, status) {
  var output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

function getBotDriveFolderId(ss, botAlias) {
  var sheet = ss.getSheetByName('bot_configs');
  var values = sheet.getDataRange().getValues();
  var rowIndex = -1;
  var folderId = '';
  
  for (var i = 1; i < values.length; i++) {
    if (values[i][0] === botAlias) {
      rowIndex = i + 1; // 1-indexed + skipping header
      folderId = values[i][3];
      break;
    }
  }
  
  if (rowIndex === -1) return ''; // Bot config not found
  
  // If the folder ID is blank, execute dynamic location following & auto-creation
  if (!folderId || folderId === '') {
    try {
      // 1. Get the parent folder containing the active spreadsheet file
      var currentFile = DriveApp.getFileById(ss.getId());
      var parents = currentFile.getParents();
      var parentFolder;
      if (parents.hasNext()) {
        parentFolder = parents.next();
      } else {
        parentFolder = DriveApp.getRootFolder();
      }
      
      // 2. Search for or create the bot subfolder inside this parent folder
      var subFolderName = 'Bot_' + botAlias;
      var subFolders = parentFolder.getFoldersByName(subFolderName);
      var targetFolder;
      if (subFolders.hasNext()) {
        targetFolder = subFolders.next();
      } else {
        // Inherits permissions automatically from the parent folder
        targetFolder = parentFolder.createFolder(subFolderName);
      }
      
      folderId = targetFolder.getId();
      
      // 3. Write the new folder ID back to bot_configs Sheet (4th column: associated_drive_folder_id)
      sheet.getRange(rowIndex, 4).setValue(folderId);
    } catch (e) {
      Logger.log('Error creating/following folder: ' + e.message);
    }
  }
  
  return folderId;
}

function getBotConfigsMap(ss) {
  var sheet = ss.getSheetByName('bot_configs');
  var values = sheet.getDataRange().getValues();
  var configs = {};
  for (var i = 1; i < values.length; i++) {
    var alias = values[i][0];
    configs[alias] = {
      bot_alias: alias,
      bot_name: values[i][1],
      line_channel_token: values[i][2],
      associated_drive_folder_id: values[i][3]
    };
  }
  return configs;
}

function fetchLineProfileName(userId, channelToken) {
  try {
    var url = 'https://api.line.me/v2/bot/profile/' + userId;
    var response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + channelToken
      },
      muteHttpExceptions: true
    });
    if (response.getResponseCode() === 200) {
      var data = JSON.parse(response.getContentText());
      return data.displayName;
    }
  } catch (e) {}
  return '';
}

function ensureSetup(ss) {
  if (!ss.getSheetByName('bot_configs') || !ss.getSheetByName('chat_events')) {
    runSetup();
  }
}

// ----------------------------------------------------
// 5. SERVER-SIDE DIAGNOSTICS & CONTROL (For HTML Dashboard)
// ----------------------------------------------------
function getDiagnosticsData() {
  try {
    var ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    
    // A. Spreadsheet Info
    var ssName = ss.getName();
    var ssUrl = ss.getUrl();
    
    // B. Sheets & Row Counts
    var sheetsList = [];
    var sheets = ss.getSheets();
    for (var i = 0; i < sheets.length; i++) {
      var s = sheets[i];
      sheetsList.push({
        name: s.getName(),
        rows: s.getLastRow()
      });
    }
    
    // C. Drive Folder Info
    var currentFile = DriveApp.getFileById(MASTER_SPREADSHEET_ID);
    var parents = currentFile.getParents();
    var parentFolder = parents.hasNext() ? parents.next() : null;
    var parentFolderInfo = parentFolder ? {
      id: parentFolder.getId(),
      name: parentFolder.getName(),
      url: parentFolder.getUrl()
    } : { id: 'root', name: 'My Drive Root', url: 'https://drive.google.com' };

    // D. Bot Configurations
    var configsList = [];
    var configSheet = ss.getSheetByName('bot_configs');
    if (configSheet) {
      var vals = configSheet.getDataRange().getValues();
      for (var i = 1; i < vals.length; i++) {
        var subFolderId = vals[i][3];
        var subFolderUrl = '';
        if (subFolderId) {
          try {
            subFolderUrl = DriveApp.getFolderById(subFolderId).getUrl();
          } catch(err) {}
        }
        
        configsList.push({
          bot_alias: vals[i][0],
          bot_name: vals[i][1],
          line_channel_token: vals[i][2],
          associated_drive_folder_id: subFolderId,
          associated_drive_folder_url: subFolderUrl,
          created_at: vals[i][4]
        });
      }
    }

    // E. General Script Environment Info
    var scriptUrl = ScriptApp.getService().getUrl();

    return {
      ok: true,
      spreadsheet: { id: MASTER_SPREADSHEET_ID, name: ssName, url: ssUrl },
      sheets: sheetsList,
      parentFolder: parentFolderInfo,
      bots: configsList,
      scriptUrl: scriptUrl,
      securityToken: SECURITY_TOKEN
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function runSetupManual() {
  try {
    runSetup();
    return { ok: true, message: 'Setup completed successfully!' };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function testDriveWrite() {
  try {
    var ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    var currentFile = DriveApp.getFileById(ss.getId());
    var parents = currentFile.getParents();
    var parentFolder = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();
    
    var fileName = 'falo_test_write.txt';
    var testFile = parentFolder.createFile(fileName, 'Falo Write Permission Test. Created at: ' + new Date().toISOString());
    var fileId = testFile.getId();
    
    // Delete immediately to clean up
    parentFolder.removeFile(testFile);
    
    return { ok: true, message: 'Drive Write OK. File created (ID: ' + fileId + ') and deleted successfully.' };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function testLineApi(botAlias) {
  try {
    var ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    var configs = getBotConfigsMap(ss);
    var cfg = configs[botAlias];
    if (!cfg || !cfg.line_channel_token) {
      return { ok: false, error: 'No token configured for bot_alias: ' + botAlias };
    }
    
    var url = 'https://api.line.me/v2/bot/info';
    var response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + cfg.line_channel_token
      },
      muteHttpExceptions: true
    });
    
    var resCode = response.getResponseCode();
    var resText = response.getContentText();
    
    if (resCode === 200) {
      var botInfo = JSON.parse(resText);
      return { ok: true, message: 'LINE API OK. Connected as bot basic ID: ' + botInfo.basicId + ' (' + botInfo.displayName + ')' };
    } else {
      return { ok: false, error: 'LINE API returned HTTP ' + resCode + ': ' + resText };
    }
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
