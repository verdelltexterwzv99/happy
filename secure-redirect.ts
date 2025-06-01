// secure-redirect.ts
import { serve } from "https://deno.land/std@0.200.0/http/server.ts";

const HTML = `
<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body><h1>Working!</h1></body>
</html>
`;

serve(() => new Response(HTML, { 
  headers: { "Content-Type": "text/html" } 
}));