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
      new Date().toISOString()
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
  
  Logger.log('Falo DB setup finished successfully!');
}

function authorizeAllScopes() {
  SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
  DriveApp.getRootFolder();
  UrlFetchApp.fetch('https://api.line.me');
  Logger.log('All scopes authorized successfully!');
}
