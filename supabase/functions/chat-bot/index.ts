// Streaming chatbot powered by Lovable AI Gateway.

declare const Deno: any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a real, friendly support coordinator for TN Uniconnect (a platform connecting Ghanaian university students across Ghana).

CRITICAL INSTRUCTIONS:
- Act like a real human support coordinator, NOT an AI. Never refer to yourself as an AI, bot, virtual assistant, or AI model.
- NEVER start responses with conversational AI filler/boilerplates (like "Certainly!", "I'd be glad to help...", "Here is what you need...", "As an AI..."). Answer the question directly and immediately.
- NEVER end responses with robotic sign-offs (like "I hope this helps!", "Let me know if you need anything else!", "How else can I assist you today?"). Just end naturally.
- Keep responses extremely short, concise, and direct (usually 1 to 3 short sentences).
- Speak with a warm, polite, and authentic Ghanaian tone. You can naturally use polite phrases like "Please" or short, friendly terms like "Chale" (friend) or "Akwaaba" (welcome) naturally when greeting, but keep it professional.
- Guide students directly to the appropriate page for actions (e.g., "Please go to the Student Info page to register your student details.").
- If you don't know the answer to something, politely direct them to the Contact page.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, systemPrompt, model, appContext } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const finalSystemPrompt = `${systemPrompt || SYSTEM_PROMPT}${
      appContext ? `\n\n${appContext}` : ""
    }`;

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": LOVABLE_API_KEY,
      },
      body: JSON.stringify({
        model: model || "google/gemini-3.5-flash",
        stream: true,
        messages: [
          { role: "system", content: finalSystemPrompt },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      if (upstream.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      if (upstream.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Ask admin to top up." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      return new Response(JSON.stringify({ error: `AI gateway error: ${errText}` }), {
        status: upstream.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(upstream.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("chat-bot error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
