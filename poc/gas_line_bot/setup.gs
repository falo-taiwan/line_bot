/**
 * Setup.gs - Initialize Google Sheets tables for Falo IM v2.x
 */

var MASTER_SPREADSHEET_ID = '1_Pfzg81jyXP--08G-65auMSc_61tHt6182BGxfxVy0Q';

function runSetup() {
  var ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
  
  // 1. Setup bot_configs (Official Accounts Config)
  var configSheet = ss.getSheetByName('bot_configs');
  if (!configSheet) {
    configSheet = ss.insertSheet('bot_configs');
  } else {
    configSheet.clear();
  }
  var configHeaders = ['bot_alias', 'bot_name', 'line_channel_token', 'associated_drive_folder_id', 'created_at'];
  configSheet.appendRow(configHeaders);
  
  // Populate extracted default official accounts config
  var defaultBots = [
    [
      'standard',
      'FALO IM Bot Test',
      'QbCFELbDXoDLB5tZJizJiD6OeRiCIcN4E0nXxz/HjJp6sg0he35nc+jSmSrqGIWgAI0BfuL+5TmJwRyhPUDXSjIexSiNdxq7P1Ht8qL7XX7UAHv9RwStmqMIzp6iPObE/Ah2szC12NJ2FU1QfT23qQdB04t89/1O/w1cDnyilFU=',
      '1ciVjy5WiIZXnnURb4nyar-v3R31VL4aG',
      formatDateToTaipeiIso_()
    ]
  ];
  defaultBots.forEach(function(bot) {
    configSheet.appendRow(bot);
  });
  
  // 2. Setup chat_events (Transaction Logs Database)
  var eventsSheet = ss.getSheetByName('chat_events');
  if (!eventsSheet) {
    eventsSheet = ss.insertSheet('chat_events');
  }
  var eventHeaders = ['id', 'bot_alias', 'chat_id', 'message_id', 'captured_at', 'sender_name', 'sender_role', 'message_type', 'text_content', 'media_file_id', 'media_file_url', 'media_error', 'metadata_json'];
  eventsSheet.getRange(1, 1, 1, eventHeaders.length).setValues([eventHeaders]);

  // 3. Setup ai_insights (AI analysis logs)
  var insightsSheet = ss.getSheetByName('ai_insights');
  if (!insightsSheet) {
    insightsSheet = ss.insertSheet('ai_insights');
  } else {
    if (insightsSheet.getLastRow() === 0) {
      var insightsHeaders = ['id', 'chat_id', 'analysis_type', 'time_range_start', 'time_range_end', 'summary_markdown', 'tasks_json', 'created_at'];
      insightsSheet.appendRow(insightsHeaders);
    }
  }

  // 4. Setup media_queue (Async Queue)
  var queueSheet = ss.getSheetByName('media_queue');
  if (!queueSheet) {
    queueSheet = ss.insertSheet('media_queue');
  }
  if (queueSheet.getLastRow() === 0) {
    var queueHeaders = ['queued_at', 'message_id', 'message_type', 'bot_alias', 'chat_id', 'user_id', 'line_timestamp', 'status', 'attempt_count', 'processing_started_at', 'last_attempt_at', 'last_error', 'drive_file_id', 'drive_file_url', 'raw_json'];
    queueSheet.appendRow(queueHeaders);
  }

  // 5. Setup media_files (Downloaded Media Cache)
  var filesSheet = ss.getSheetByName('media_files');
  if (!filesSheet) {
    filesSheet = ss.insertSheet('media_files');
  }
  if (filesSheet.getLastRow() === 0) {
    var filesHeaders = ['saved_at', 'message_id', 'message_type', 'stored_file_name', 'mime_type', 'drive_file_id', 'drive_file_url', 'drive_folder_id', 'bot_alias', 'chat_id', 'user_id', 'line_timestamp'];
    filesSheet.appendRow(filesHeaders);
  }
  
  // 6. Setup chat_registry (Group Friendly Mapping Registry)
  var registrySheet = ss.getSheetByName('chat_registry');
  if (!registrySheet) {
    registrySheet = ss.insertSheet('chat_registry');
  }
  var newChatHeaders = ['chat_id', 'bot_alias', 'default_name', 'custom_name', 'chat_type', 'updated_at'];
  if (registrySheet.getLastRow() === 0) {
    registrySheet.appendRow(newChatHeaders);
  } else {
    // Migration helper: upgrade existing registry to dual-name schema
    var lastCol = registrySheet.getLastColumn();
    var lastRow = registrySheet.getLastRow();
    var firstRowVals = lastCol > 0 ? registrySheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
    
    if (firstRowVals.indexOf('default_name') === -1 && firstRowVals.indexOf('friendly_name') !== -1) {
      if (lastRow > 1) {
        var oldRange = registrySheet.getRange(2, 1, lastRow - 1, 5);
        var oldValues = oldRange.getValues();
        var newValues = [];
        for (var i = 0; i < oldValues.length; i++) {
          var row = oldValues[i];
          newValues.push([
            row[0], // chat_id
            row[1], // bot_alias
            row[2], // default_name
            row[2], // custom_name
            row[3], // chat_type
            row[4]  // updated_at
          ]);
        }
        registrySheet.clear();
        registrySheet.getRange(1, 1, 1, newChatHeaders.length).setValues([newChatHeaders]);
        registrySheet.getRange(2, 1, newValues.length, newChatHeaders.length).setValues(newValues);
      } else {
        registrySheet.clear();
        registrySheet.getRange(1, 1, 1, newChatHeaders.length).setValues([newChatHeaders]);
      }
    } else if (firstRowVals.indexOf('default_name') === -1) {
      registrySheet.getRange(1, 1, 1, newChatHeaders.length).setValues([newChatHeaders]);
    }
  }
  
  // 6b. Setup dialogue_registry (Uploaded Files Registry)
  var dialogueRegistrySheet = ss.getSheetByName('dialogue_registry');
  if (!dialogueRegistrySheet) {
    dialogueRegistrySheet = ss.insertSheet('dialogue_registry');
  }
  if (dialogueRegistrySheet.getLastRow() === 0) {
    var dialogueRegistryHeaders = ['file_id', 'original_filename', 'alias_name', 'drive_url', 'file_size', 'uploaded_at'];
    dialogueRegistrySheet.appendRow(dialogueRegistryHeaders);
  }
  
  // 7. Initialize default script properties if not present
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty('MEDIA_WORKER_INTERVAL_MINUTES')) {
    props.setProperty('MEDIA_WORKER_INTERVAL_MINUTES', '1');
  }
  
  Logger.log('Falo DB setup finished successfully!');
}

function authorizeAllScopes() {
  SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
  DriveApp.getRootFolder();
  UrlFetchApp.fetch('https://api.line.me');
  Logger.log('All scopes authorized successfully!');
}

function clearAllDataAndFiles() {
  var ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
  Logger.log('=== STARTING CLEANUP PRE-CHECK ===');
  
  var beforeStatus = {};
  
  // Check chat_events
  var eventsSheet = ss.getSheetByName('chat_events');
  beforeStatus.chat_events_rows = eventsSheet ? eventsSheet.getLastRow() : 0;
  
  // Check dialogue_registry
  var registrySheet = ss.getSheetByName('dialogue_registry');
  beforeStatus.dialogue_registry_rows = registrySheet ? registrySheet.getLastRow() : 0;
  
  // Check media_queue
  var queueSheet = ss.getSheetByName('media_queue');
  beforeStatus.media_queue_rows = queueSheet ? queueSheet.getLastRow() : 0;
  
  // Check media_files
  var filesSheet = ss.getSheetByName('media_files');
  beforeStatus.media_files_rows = filesSheet ? filesSheet.getLastRow() : 0;
  
  // Check Drive files
  var parents = DriveApp.getFileById(ss.getId()).getParents();
  var parentFolder = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();
  
  var exportsCount = 0;
  var exportsSubFolders = parentFolder.getFoldersByName('exports');
  if (exportsSubFolders.hasNext()) {
    exportsCount = countFiles_(exportsSubFolders.next());
  }
  beforeStatus.exports_files = exportsCount;
  
  var mediaCount = 0;
  var mediaFolders = parentFolder.getFoldersByName('system_media');
  if (mediaFolders.hasNext()) {
    mediaCount = countFiles_(mediaFolders.next());
  }
  beforeStatus.media_files = mediaCount;
  
  var mediaCountAlt = 0;
  var mediaFoldersAlt = parentFolder.getFoldersByName('media');
  if (mediaFoldersAlt.hasNext()) {
    mediaCountAlt = countFiles_(mediaFoldersAlt.next());
  }
  beforeStatus.media_files_alt = mediaCountAlt;
  
  var rawCount = 0;
  var rawSubFolders = parentFolder.getFoldersByName('system_raw');
  if (rawSubFolders.hasNext()) {
    var rawFolder = rawSubFolders.next();
    rawCount += countFiles_(rawFolder);
    var botFolders = rawFolder.getFolders();
    while (botFolders.hasNext()) {
      rawCount += countFiles_(botFolders.next());
    }
  }
  beforeStatus.raw_files = rawCount;
  
  // Specific media folder ID cleanup
  var specificMediaCount = 0;
  try {
    var specificMediaFolder = DriveApp.getFolderById("1z18RohlV9kbiQsBR78H78_fJHAdShC9C");
    specificMediaCount = countFiles_(specificMediaFolder);
  } catch(e) {
    Logger.log('Could not read specific media folder: ' + e.message);
  }
  beforeStatus.specific_media_files = specificMediaCount;
  
  Logger.log('Status BEFORE cleanup: ' + JSON.stringify(beforeStatus));
  
  // Execute cleanup
  // 1. chat_events
  if (eventsSheet && eventsSheet.getLastRow() > 1) {
    eventsSheet.deleteRows(2, eventsSheet.getLastRow() - 1);
  }
  // 2. dialogue_registry
  if (registrySheet && registrySheet.getLastRow() > 1) {
    registrySheet.deleteRows(2, registrySheet.getLastRow() - 1);
  }
  // 3. media_queue
  if (queueSheet && queueSheet.getLastRow() > 1) {
    queueSheet.deleteRows(2, queueSheet.getLastRow() - 1);
  }
  // 4. media_files
  if (filesSheet && filesSheet.getLastRow() > 1) {
    filesSheet.deleteRows(2, filesSheet.getLastRow() - 1);
  }
  
  // 5. Clear Drive Folders
  // exports
  var exportsSubFolders2 = parentFolder.getFoldersByName('exports');
  if (exportsSubFolders2.hasNext()) {
    trashFiles_(exportsSubFolders2.next());
  }
  // system_media
  var mediaFolders2 = parentFolder.getFoldersByName('system_media');
  if (mediaFolders2.hasNext()) {
    trashFiles_(mediaFolders2.next());
  }
  // system_raw
  var rawSubFolders2 = parentFolder.getFoldersByName('system_raw');
  if (rawSubFolders2.hasNext()) {
    var rawFolder = rawSubFolders2.next();
    var botFolders = rawFolder.getFolders();
    while (botFolders.hasNext()) {
      trashFiles_(botFolders.next());
    }
    trashFiles_(rawFolder);
  }
  
  // Specific media folder ID cleanup
  try {
    var specificMediaFolder = DriveApp.getFolderById("1z18RohlV9kbiQsBR78H78_fJHAdShC9C");
    trashFiles_(specificMediaFolder);
  } catch(e) {
    Logger.log('Could not trash specific media folder: ' + e.message);
  }
  
  Logger.log('=== CLEANUP EXECUTED ===');
  
  // Check status AFTER cleanup
  var afterStatus = {};
  afterStatus.chat_events_rows = eventsSheet ? eventsSheet.getLastRow() : 0;
  afterStatus.dialogue_registry_rows = registrySheet ? registrySheet.getLastRow() : 0;
  afterStatus.media_queue_rows = queueSheet ? queueSheet.getLastRow() : 0;
  afterStatus.media_files_rows = filesSheet ? filesSheet.getLastRow() : 0;
  
  var exportsCountAfter = 0;
  var exportsSubFolders3 = parentFolder.getFoldersByName('exports');
  if (exportsSubFolders3.hasNext()) {
    exportsCountAfter = countFiles_(exportsSubFolders3.next());
  }
  afterStatus.exports_files = exportsCountAfter;
  
  var mediaCountAfter = 0;
  var mediaFolders3 = parentFolder.getFoldersByName('system_media');
  if (mediaFolders3.hasNext()) {
    mediaCountAfter = countFiles_(mediaFolders3.next());
  }
  afterStatus.media_files = mediaCountAfter;
  
  var rawCountAfter = 0;
  var rawSubFolders3 = parentFolder.getFoldersByName('system_raw');
  if (rawSubFolders3.hasNext()) {
    var rawFolder = rawSubFolders3.next();
    rawCountAfter += countFiles_(rawFolder);
    var botFolders = rawFolder.getFolders();
    while (botFolders.hasNext()) {
      rawCountAfter += countFiles_(botFolders.next());
    }
  }
  afterStatus.raw_files = rawCountAfter;
  
  var specificMediaCountAfter = 0;
  try {
    var specificMediaFolder = DriveApp.getFolderById("1z18RohlV9kbiQsBR78H78_fJHAdShC9C");
    specificMediaCountAfter = countFiles_(specificMediaFolder);
  } catch(e) {
    Logger.log('Could not read specific media folder after: ' + e.message);
  }
  afterStatus.specific_media_files = specificMediaCountAfter;
  
  Logger.log('Status AFTER cleanup: ' + JSON.stringify(afterStatus));
  
  var msg = '【試算表數據行數 (前 ➔ 後)】\\n' +
            '• chat_events: ' + beforeStatus.chat_events_rows + ' ➔ ' + afterStatus.chat_events_rows + '\\n' +
            '• dialogue_registry: ' + beforeStatus.dialogue_registry_rows + ' ➔ ' + afterStatus.dialogue_registry_rows + '\\n' +
            '• media_queue: ' + beforeStatus.media_queue_rows + ' ➔ ' + afterStatus.media_queue_rows + '\\n' +
            '• media_files: ' + beforeStatus.media_files_rows + ' ➔ ' + afterStatus.media_files_rows + '\\n\\n' +
            '【雲端硬碟檔案數 (前 ➔ 後)】\\n' +
            '• exports/: ' + beforeStatus.exports_files + ' ➔ ' + afterStatus.exports_files + '\\n' +
            '• system_media/: ' + beforeStatus.media_files + ' ➔ ' + afterStatus.media_files + '\\n' +
            '• system_raw/: ' + beforeStatus.raw_files + ' ➔ ' + afterStatus.raw_files + '\\n' +
            '• media/ (特定媒體庫): ' + beforeStatus.specific_media_files + ' ➔ ' + afterStatus.specific_media_files;
            
  try {
    Browser.msgBox('FALO 大腦清理自我檢查報告', msg, Browser.Buttons.OK);
  } catch(e) {
    Logger.log('Browser.msgBox is only available in container UI contexts.');
  }
  return msg;
}

function countFiles_(folder) {
  var count = 0;
  var files = folder.getFiles();
  while (files.hasNext()) {
    files.next();
    count++;
  }
  return count;
}

function trashFiles_(folder) {
  var files = folder.getFiles();
  while (files.hasNext()) {
    files.next().setTrashed(true);
  }
}
