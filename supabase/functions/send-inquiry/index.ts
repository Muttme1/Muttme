
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
type InquiryPayload = { dogName?: string; dogId?: string; adopterName?: string; adopterEmail?: string; message?: string; test?: boolean; };
serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const body: InquiryPayload = await req.json();
  const smtpHost = Deno.env.get("SMTP_HOST")!;
  const smtpPort = Number(Deno.env.get("SMTP_PORT") ?? "587");
  const smtpUser = Deno.env.get("SMTP_USER")!;
  const smtpPass = Deno.env.get("SMTP_PASS")!;
  const toEmail  = "muttmeadoptablepets@gmail.com";
  const { SmtpClient } = await import("https://esm.sh/denomailer@1.6.0/mod.ts");
  const client = new SmtpClient();
  try {
    await client.connectTLS({ hostname: smtpHost, port: smtpPort, username: smtpUser, password: smtpPass });
    const subject = body.test ? "✅ MuttMe SMTP Test (Supabase Edge)" : `New MuttMe Inquiry: ${body.dogName ?? "Unknown Dog"}`;
    const html = body.test ? `<h2>Test Email</h2><p>This is a test sent via Supabase Edge using Gmail SMTP.</p>` :
      `<h2>New Adoption Inquiry</h2>
       <p><b>Dog:</b> ${body.dogName} (${body.dogId})</p>
       <p><b>From:</b> ${body.adopterName} &lt;${body.adopterEmail}&gt;</p>
       <p><b>Message:</b></p><p>${(body.message ?? "").replace(/\n/g, "<br/>")}</p>`;
    await client.send({ from: `MuttMe Inquiries <${smtpUser}>`, to: toEmail, subject, content: html });
    await client.close();
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    try { await client.close(); } catch {}
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
});
