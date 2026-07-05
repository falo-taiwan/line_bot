/**
 * Setup.gs - Initialize Google Sheets tables for Falo IM v2.x
 */

var MASTER_SPREADSHEET_ID = '1DQScN8JrRrHiqtPoVeEPJQXC17GZP7GKFPiQdCbaVNI';

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
    ],
    [
      'gas',
      'FALO IM Bot GAS Test',
      'g4tFjr+oBbmqD0RF6Dst1jZCZ8XjKxZM6tl0T97pj4bel7/q/M3kPWKB2vYQBuH4GiMa1GU0hrM6XEEQz6fDq97VtJQfXIeGDzYwWaccrGKst/kQAw/+SpCnK5hW4OhQvSHJwkkQBqxK0QBdiZcUDgdB04t89/1O/w1cDnyilFU=',
      '1YMudlXzJYuBgK3gtJt2sPAUvcOc3kQwC',
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
  } else {
    // Only write headers if sheet is empty to prevent data wipe
    if (eventsSheet.getLastRow() === 0) {
      var eventHeaders = ['id', 'bot_alias', 'chat_id', 'message_id', 'captured_at', 'sender_name', 'sender_role', 'message_type', 'text_content', 'metadata_json'];
      eventsSheet.appendRow(eventHeaders);
    }
  }

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
  
  Logger.log('Falo DB setup finished successfully!');
}
