const INDEX_HTML = `__INDEX_HTML__`;
const POC_DEMO_HTML = `__POC_DEMO_HTML__`;
const PRODUCT_INTRO_HTML = `__PRODUCT_INTRO_HTML__`;
const PRODUCT_ANALYSIS_HTML = `__PRODUCT_ANALYSIS_HTML__`;
const LINE_PARSER_SPEC_HTML = `__LINE_PARSER_SPEC_HTML__`;
const GOOGLE_SHEETS_ACCESS_METHODS_HTML = `__GOOGLE_SHEETS_ACCESS_METHODS_HTML__`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Helper: Return HTML Response
    const htmlResponse = (html) => {
      return new Response(html, {
        headers: { "content-type": "text/html;charset=UTF-8" }
      });
    };

    // Helper: Proxy request to GAS
    const proxyToGas = async (queryParams, method = "GET", bodyData = null) => {
      const gasUrl = new URL(env.GAS_WEB_APP_URL);
      // Append query parameters
      for (const [key, val] of queryParams.entries()) {
        gasUrl.searchParams.set(key, val);
      }
      // Add secure token
      gasUrl.searchParams.set("token", env.VIEWER_TOKEN);

      const fetchOptions = {
        method: method,
        headers: {
          "Accept": "application/json"
        }
      };

      if (method === "POST" && bodyData) {
        fetchOptions.headers["Content-Type"] = "application/json";
        fetchOptions.body = JSON.stringify(bodyData);
      }

      try {
        const gasResponse = await fetch(gasUrl.toString(), fetchOptions);
        const data = await gasResponse.text();
        return new Response(data, {
          headers: {
            "content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { "content-type": "application/json" }
        });
      }
    };

    // 1. Static Routes
    if (path === "/" || path === "/index.html") {
      return htmlResponse(INDEX_HTML);
    }
    if (path === "/poc-demo" || path === "/poc-demo.html") {
      return htmlResponse(POC_DEMO_HTML);
    }
    if (path === "/product-intro" || path === "/product-intro.html") {
      return htmlResponse(PRODUCT_INTRO_HTML);
    }
    if (path === "/product-analysis" || path === "/product-analysis.html") {
      return htmlResponse(PRODUCT_ANALYSIS_HTML);
    }
    if (path === "/line-parser-spec" || path === "/line-parser-spec.html") {
      return htmlResponse(LINE_PARSER_SPEC_HTML);
    }
    if (path === "/google-sheets-access-methods" || path === "/google-sheets-access-methods.html") {
      return htmlResponse(GOOGLE_SHEETS_ACCESS_METHODS_HTML);
    }

    // 2. API Proxy Routes
    if (path === "/api/chats") {
      // Fetch active chats list from GAS
      const params = new URLSearchParams();
      params.set("action", "get_chats");
      return proxyToGas(params);
    }

    if (path === "/api/chat-events") {
      // Query specific chat history log from GAS in SQL-like format
      const params = new URLSearchParams(url.search);
      params.set("action", "query");
      params.set("table", "chat_events");
      return proxyToGas(params);
    }

    // 3. API Upload / Save Routes
    if (path === "/api/upload" && request.method === "POST") {
      try {
        const body = await request.json();
        // Body expected: { chat_id: "...", bot_alias: "...", raw_text: "...", parsed_events: [...] }
        // Forward raw text to GAS to save in Google Drive, and parsed events to Sheets
        const params = new URLSearchParams();
        params.set("action", "upload_logs");
        return proxyToGas(params, "POST", body);
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: "Invalid JSON payload" }), {
          status: 400,
          headers: { "content-type": "application/json" }
        });
      }
    }

    // 4. API Gemini Query Route
    if (path === "/api/query" && request.method === "POST") {
      try {
        const body = await request.json();
        // Body expected: { prompt: "...", chat_id: "...", start_date: "...", end_date: "..." }
        // Step 1: Fetch events from GAS for this time range
        const gasUrl = new URL(env.GAS_WEB_APP_URL);
        gasUrl.searchParams.set("action", "query");
        gasUrl.searchParams.set("table", "chat_events");
        gasUrl.searchParams.set("chat_id", body.chat_id);
        if (body.start_date) gasUrl.searchParams.set("start_date", body.start_date);
        if (body.end_date) gasUrl.searchParams.set("end_date", body.end_date);
        gasUrl.searchParams.set("token", env.VIEWER_TOKEN);

        const gasResponse = await fetch(gasUrl.toString());
        const gasJson = await gasResponse.json();

        if (!gasJson.ok) {
          return new Response(JSON.stringify({ ok: false, error: "Failed to fetch events from database" }), {
            status: 500,
            headers: { "content-type": "application/json" }
          });
        }

        // Format conversation context for Gemini
        const events = gasJson.data || [];
        let context = "";
        events.forEach(evt => {
          const roleLabel = evt.sender_role === "host" ? "[主/服務方]" : "[從/客戶]";
          context += `${evt.captured_at} ${evt.sender_name}${roleLabel}: ${evt.text_content}\n`;
        });

        // Step 2: Call Gemini API using GEMINI_API_KEY from environment vars
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_API_KEY}`;
        const geminiPayload = {
          contents: [
            {
              parts: [
                {
                  text: `${body.prompt}\n\n以下是雙方的實際對話紀錄，請依據主從角色關係進行分析摘要：\n${context}`
                }
              ]
            }
          ]
        };

        const geminiResponse = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiPayload)
        });

        const geminiJson = await geminiResponse.json();
        
        // Extract text response
        let textResult = "AI 分析失敗，無法取得回應。";
        try {
          textResult = geminiJson.candidates[0].content.parts[0].text;
        } catch (e) {}

        return new Response(JSON.stringify({ ok: true, result: textResult }), {
          headers: {
            "content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*"
          }
        });

      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { "content-type": "application/json" }
        });
      }
    }

    // CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    return new Response("Not Found", { status: 404 });
  }
};
