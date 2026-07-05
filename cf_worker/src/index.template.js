const INDEX_HTML = `__INDEX_HTML__`;
const POC_DEMO_HTML = `__POC_DEMO_HTML__`;
const MVP_HTML = `__MVP_HTML__`;
const MOBILE_HTML = `__MOBILE_HTML__`;
const PRODUCT_INTRO_HTML = `__PRODUCT_INTRO_HTML__`;
const PRODUCT_ANALYSIS_HTML = `__PRODUCT_ANALYSIS_HTML__`;
const LINE_PARSER_SPEC_HTML = `__LINE_PARSER_SPEC_HTML__`;
const GOOGLE_SHEETS_ACCESS_METHODS_HTML = `__GOOGLE_SHEETS_ACCESS_METHODS_HTML__`;
const MOBILE_PREVIEW_HTML = `__MOBILE_PREVIEW_HTML__`;

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
    if (path === "/mvp" || path === "/mvp.html") {
      return htmlResponse(MVP_HTML);
    }
    if (path === "/product-intro" || path === "/product-intro.html") {
      return htmlResponse(PRODUCT_INTRO_HTML);
    }
    if (path === "/product-analysis" || path === "/product-analysis.html") {
      return htmlResponse(PRODUCT_ANALYSIS_HTML);
    }
    if (path === "/line-parser-spec" || path === "/line-parser-spec.html" || path === "/docs/tutorials/line_parser_spec.html") {
      return htmlResponse(LINE_PARSER_SPEC_HTML);
    }
    if (path === "/google-sheets-access-methods" || path === "/google-sheets-access-methods.html") {
      return htmlResponse(GOOGLE_SHEETS_ACCESS_METHODS_HTML);
    }
    if (path === "/mobile" || path === "/mobile.html") {
      return htmlResponse(MOBILE_HTML);
    }
    if (path === "/mobile/preview" || path === "/mobile/preview.html") {
      return htmlResponse(MOBILE_PREVIEW_HTML);
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

    if (path === "/api/dialogue-files") {
      const params = new URLSearchParams();
      params.set("action", "list_files");
      return proxyToGas(params);
    }

    if (path === "/api/dialogue-content") {
      const params = new URLSearchParams(url.search);
      params.set("action", "get_file_content");
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

    // 4.5 Universal AI Analyze Route (supports Built-in Workers AI and custom Gemini Key)
    if (path === "/api/ai/analyze" && request.method === "POST") {
      try {
        const body = await request.json();
        const provider = body.provider || "builtin";
        const prompt = body.prompt || "";
        const customGeminiKey = body.gemini_key || "";

        if (!prompt.trim()) {
          return new Response(JSON.stringify({ ok: false, error: "Prompt context cannot be empty" }), {
            status: 400,
            headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }

        let aiResultText = "";

        if (provider === "builtin") {
          if (!env.AI) {
            return new Response(JSON.stringify({ ok: false, error: "Cloudflare Workers AI binding [ai] is missing in wrangler.toml!" }), {
              status: 500,
              headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
          }
          // Whitelist built-in models
          const allowedBuiltinModels = [
            "@cf/mistralai/mistral-small-3.1-24b-instruct",
            "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
            "@cf/meta/llama-3.2-3b-instruct"
          ];
          const selectedModel = allowedBuiltinModels.includes(body.model) ? body.model : "@cf/mistralai/mistral-small-3.1-24b-instruct";
          
          // Call Workers AI with selected model
          const response = await env.AI.run(selectedModel, {
            messages: [
              { role: "system", content: "You are a helpful AI assistant. Please respond in Traditional Chinese (zh-TW)." },
              { role: "user", content: prompt }
            ]
          });
          
          if (response && response.response) {
            aiResultText = response.response;
          } else {
            throw new Error("Empty response from Workers AI model");
          }
        } else if (provider === "gemini") {
          const apiKey = customGeminiKey.trim() || env.GEMINI_API_KEY;
          if (!apiKey || apiKey === "AIzaSyxxxx") {
            return new Response(JSON.stringify({ ok: false, error: "Gemini API key is not configured!" }), {
              status: 400,
              headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
          }

          // Whitelist Gemini models
          const allowedGeminiModels = [
            "gemini-3.1-flash-lite",
            "gemini-3.5-flash",
            "gemini-3.1-flash",
            "gemini-2.5-flash",
            "gemini-2.5-flash-lite"
          ];
          const selectedModel = allowedGeminiModels.includes(body.model) ? body.model : "gemini-3.1-flash-lite";

          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;
          const geminiPayload = {
            contents: [
              {
                parts: [
                  { text: prompt }
                ]
              }
            ]
          };

          const geminiResponse = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(geminiPayload)
          });

          if (!geminiResponse.ok) {
            const errorText = await geminiResponse.text();
            throw new Error(`Gemini API error (Status ${geminiResponse.status}): ${errorText}`);
          }

          const geminiJson = await geminiResponse.json();
          try {
            aiResultText = geminiJson.candidates[0].content.parts[0].text;
            globalThis.geminiLastUsage = geminiJson.usageMetadata || null;
          } catch (e) {
            throw new Error("Failed to parse response content from Gemini API JSON");
          }
        } else {
          return new Response(JSON.stringify({ ok: false, error: "Unsupported AI provider: " + provider }), {
            status: 400,
            headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }

        const usagePayload = (provider === "gemini") ? globalThis.geminiLastUsage : null;

        return new Response(JSON.stringify({ ok: true, result: aiResultText, usage: usagePayload }), {
          headers: {
            "content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }

    // 5. LINE Webhook Proxy Route (converts GAS 302 Found to direct 200 OK for LINE verification)
    if ((path === "/webhook" || path === "/api/webhook") && request.method === "POST") {
      try {
        const bodyText = await request.text();
        const signature = request.headers.get("X-Line-Signature") || "";

        // Forward to GAS Web App URL (support dynamic ?gas query parameter)
        const urlObj = new URL(request.url);
        const queryGas = urlObj.searchParams.get("gas");
        const gasUrl = queryGas ? new URL(decodeURIComponent(queryGas)) : new URL(env.GAS_WEB_APP_URL);
        
        const fetchOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Line-Signature": signature
          },
          body: bodyText,
          redirect: "follow" // Let fetch follow the 302 redirect automatically!
        };

        const gasResponse = await fetch(gasUrl.toString(), fetchOptions);
        const data = await gasResponse.text();
        
        return new Response(data, {
          status: 200, // Return a clean 200 OK back to LINE!
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
