// supabase/functions/ai-doubt-buddy/index.ts
// SRI SAI AI Doubt Buddy — Server-Side AI Edge Function
// All private API keys stay server-side. Never exposed to client.

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ─── Provider Configuration ─────────────────────────────────────────────────
// Default provider is Groq for lightning-fast ultra-low-latency responses
const AI_PROVIDER = (Deno.env.get("AI_PROVIDER") ?? "groq").toLowerCase();
const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY") ?? Deno.env.get("AI_API_KEY") ?? "";
const GROQ_TEXT_MODEL = Deno.env.get("GROQ_TEXT_MODEL") ?? "openai/gpt-oss-120b";
const GROQ_VISION_MODEL = Deno.env.get("GROQ_VISION_MODEL") ?? "qwen/qwen3.8-27b";

// Generic overrides
const AI_MODEL = Deno.env.get("AI_MODEL") ?? "";
const AI_API_KEY = Deno.env.get("AI_API_KEY") ?? GROQ_API_KEY;

// Limits
const MAX_DAILY_AI_REQUESTS = Number(Deno.env.get("MAX_DAILY_AI_REQUESTS") ?? "50");
const MAX_IMAGE_REQUESTS_DAILY = Number(Deno.env.get("MAX_IMAGE_REQUESTS") ?? "10");
const MAX_CONTEXT_MESSAGES = 20; // keep last N messages for context

// ─── Request Payload ─────────────────────────────────────────────────────────
interface DoubtBuddyRequest {
  conversationId?: string;
  userMessage: string;
  inputType: "text" | "image" | "voice" | "document";
  mode: "normal" | "explain_simply" | "step_by_step" | "hint" | "summarize" | "example" | "quiz_me";
  imageBase64?: string; // base64-encoded image for vision
  imageMimeType?: string;
  studentContext: {
    name?: string;
    className?: string;
    board?: string;
    subject?: string;
    chapter?: string;
  };
  historyMessages: Array<{ role: "user" | "assistant"; content: string }>;
}

// ─── System Prompt Builder ────────────────────────────────────────────────────
function buildSystemPrompt(ctx: DoubtBuddyRequest["studentContext"], mode: string): string {
  const classInfo = ctx.className ? `Class: ${ctx.className}` : "";
  const boardInfo = ctx.board ? `Board: ${ctx.board}` : "";
  const subjectInfo = ctx.subject ? `Subject: ${ctx.subject}` : "";
  const chapterInfo = ctx.chapter ? `Chapter: ${ctx.chapter}` : "";
  const contextStr = [classInfo, boardInfo, subjectInfo, chapterInfo].filter(Boolean).join(", ");

  const modeInstructions: Record<string, string> = {
    normal: "Give a clear, helpful explanation suitable for the student's level.",
    explain_simply: "Explain using very simple language, relatable examples, and avoid technical jargon. Assume the student needs the concept explained from scratch.",
    step_by_step: "Break the solution into numbered steps. Show each step clearly with reasoning. Do not skip steps.",
    hint: "Do NOT reveal the final answer. Give a helpful hint or guiding question that helps the student think through the problem themselves.",
    summarize: "Provide a concise summary with key points and important terms. Keep it easy to understand.",
    example: "Provide 2-3 clear, relatable examples that illustrate the concept. Use examples from everyday life where possible.",
    quiz_me: "Do NOT explain the concept yet. Instead, ask the student 1-2 questions to check their understanding. Wait for their response before giving explanations.",
  };

  return `You are SRI SAI Doubt Buddy, a friendly, patient, and encouraging AI tutor at SRI SAI Tuition & Learning Centre.

${contextStr ? `Student Context: ${contextStr}` : ""}

Your role:
- Help students understand academic concepts, solve Maths and Science problems, and simplify difficult topics
- Be warm, encouraging, and age-appropriate in your language
- Never be condescending or use unnecessary jargon
- For Maths/Science: Follow the structure: Concept → Given → Method → Step-by-step → Answer → Verify
- If a question is ambiguous or an image is unclear, ask for clarification rather than guessing
- Do NOT fabricate textbook references or specific page citations
- Do NOT claim certainty when you are uncertain
- If using general knowledge (not SRI SAI material), clearly distinguish it as a general explanation
- Support follow-up questions naturally

Current Mode: ${modeInstructions[mode] ?? modeInstructions.normal}

Format responses clearly. Use markdown for structure when helpful (headings, bullet points, bold for key terms, code blocks for equations if needed). Keep simple questions concise; give thorough explanations for complex ones.`;
}

// ─── RAG: Fetch relevant chunks from Supabase ─────────────────────────────────
async function fetchRelevantChunks(
  supabase: ReturnType<typeof createClient>,
  userMessage: string,
  ctx: DoubtBuddyRequest["studentContext"]
): Promise<Array<{ title: string; subject: string; chapter: string; snippet: string; materialId?: string }>> {
  try {
    let query = supabase
      .from("ai_document_chunks")
      .select("id, title, subject, chapter, chunk_text, material_id, class_name")
      .limit(5);

    if (ctx.className) query = query.ilike("class_name", `%${ctx.className}%`);
    if (ctx.subject) query = query.ilike("subject", `%${ctx.subject}%`);

    const { data, error } = await query;
    if (error || !data || data.length === 0) return [];

    // Simple keyword relevance: score chunks by keyword overlap with user message
    const keywords = userMessage.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const scored = (data as any[]).map((chunk) => {
      const text = (chunk.chunk_text ?? "").toLowerCase();
      const score = keywords.reduce((s: number, kw: string) => s + (text.includes(kw) ? 1 : 0), 0);
      return { ...chunk, score };
    });

    return scored
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((c) => ({
        title: c.title ?? "Study Material",
        subject: c.subject ?? "",
        chapter: c.chapter ?? "",
        snippet: (c.chunk_text ?? "").slice(0, 600),
        materialId: c.material_id,
      }));
  } catch {
    return [];
  }
}

// ─── Check daily usage limits ─────────────────────────────────────────────────
async function checkUsageLimit(supabase: ReturnType<typeof createClient>, userId: string, inputType: string): Promise<{ allowed: boolean; message?: string }> {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count: totalCount } = await supabase
      .from("ai_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", todayStart.toISOString());

    if ((totalCount ?? 0) >= MAX_DAILY_AI_REQUESTS) {
      return { allowed: false, message: "You've reached your daily AI request limit. Please try again tomorrow." };
    }

    if (inputType === "image") {
      const { count: imgCount } = await supabase
        .from("ai_usage")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("request_type", "image")
        .gte("created_at", todayStart.toISOString());

      if ((imgCount ?? 0) >= MAX_IMAGE_REQUESTS_DAILY) {
        return { allowed: false, message: "You've reached your daily image question limit." };
      }
    }

    return { allowed: true };
  } catch {
    return { allowed: true }; // Allow on error to avoid blocking students
  }
}

// ─── Groq Provider (Fast Reasoning & Vision) ─────────────────────────────────
async function callGroq(
  systemPrompt: string,
  history: Array<{ role: string; content: string }>,
  userMessage: string,
  imageBase64?: string,
  imageMimeType?: string,
  model?: string
): Promise<{ text: string; tokensIn?: number; tokensOut?: number; model: string }> {
  const apiKey = GROQ_API_KEY || AI_API_KEY;
  if (!apiKey) {
    throw new Error("AI_PROVIDER_NOT_CONFIGURED");
  }

  const hasImage = Boolean(imageBase64 && imageMimeType);
  // Default to openai/gpt-oss-120b for text/reasoning; qwen/qwen3.8-27b for vision/textbook images
  const targetModel =
    model ||
    (hasImage
      ? GROQ_VISION_MODEL || "qwen/qwen3.8-27b"
      : GROQ_TEXT_MODEL || "openai/gpt-oss-120b");

  const messages: any[] = [{ role: "system", content: systemPrompt }];

  // Add conversation history
  for (const msg of history.slice(-MAX_CONTEXT_MESSAGES)) {
    messages.push({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    });
  }

  // Current message (multimodal payload if image present)
  if (hasImage) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: userMessage },
        {
          type: "image_url",
          image_url: {
            url: `data:${imageMimeType};base64,${imageBase64}`,
          },
        },
      ],
    });
  } else {
    messages.push({ role: "user", content: userMessage });
  }

  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: targetModel,
      messages,
      max_tokens: 2048,
      temperature: 0.7,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Groq API error ${resp.status}: ${errText.slice(0, 300)}`);
  }

  const data = await resp.json();
  return {
    text: data.choices?.[0]?.message?.content ?? "",
    tokensIn: data.usage?.prompt_tokens,
    tokensOut: data.usage?.completion_tokens,
    model: data.model || targetModel,
  };
}

// ─── Gemini Provider ──────────────────────────────────────────────────────────
async function callGemini(
  systemPrompt: string,
  history: Array<{ role: string; content: string }>,
  userMessage: string,
  imageBase64?: string,
  imageMimeType?: string,
  model?: string
): Promise<{ text: string; tokensIn?: number; tokensOut?: number; model: string }> {
  const apiKey = AI_API_KEY;
  const modelName = model || AI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  // Build contents from history + current message
  const contents: any[] = [];

  // Add conversation history (skip system-role)
  for (const msg of history.slice(-MAX_CONTEXT_MESSAGES)) {
    contents.push({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    });
  }

  // Build current user turn
  const currentParts: any[] = [];
  if (imageBase64 && imageMimeType) {
    currentParts.push({
      inline_data: {
        mime_type: imageMimeType,
        data: imageBase64,
      },
    });
  }
  currentParts.push({ text: userMessage });

  contents.push({ role: "user", parts: currentParts });

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ],
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Gemini API error ${resp.status}: ${errText.slice(0, 200)}`);
  }

  const data = await resp.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const usage = data.usageMetadata;
  return {
    text,
    tokensIn: usage?.promptTokenCount,
    tokensOut: usage?.candidatesTokenCount,
    model: modelName,
  };
}

// ─── OpenAI Provider ──────────────────────────────────────────────────────────
async function callOpenAI(
  systemPrompt: string,
  history: Array<{ role: string; content: string }>,
  userMessage: string,
  imageBase64?: string,
  imageMimeType?: string,
  model?: string
): Promise<{ text: string; tokensIn?: number; tokensOut?: number; model: string }> {
  const modelName = model || AI_MODEL || "gpt-4o-mini";
  const messages: any[] = [{ role: "system", content: systemPrompt }];

  // Add history
  for (const msg of history.slice(-MAX_CONTEXT_MESSAGES)) {
    messages.push({ role: msg.role === "assistant" ? "assistant" : "user", content: msg.content });
  }

  // Current message
  if (imageBase64 && imageMimeType) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: userMessage },
        {
          type: "image_url",
          image_url: { url: `data:${imageMimeType};base64,${imageBase64}` },
        },
      ],
    });
  } else {
    messages.push({ role: "user", content: userMessage });
  }

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({ model: modelName, messages, max_tokens: 2048, temperature: 0.7 }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`OpenAI API error ${resp.status}: ${errText.slice(0, 200)}`);
  }

  const data = await resp.json();
  return {
    text: data.choices?.[0]?.message?.content ?? "",
    tokensIn: data.usage?.prompt_tokens,
    tokensOut: data.usage?.completion_tokens,
    model: modelName,
  };
}

// ─── Claude Provider ──────────────────────────────────────────────────────────
async function callClaude(
  systemPrompt: string,
  history: Array<{ role: string; content: string }>,
  userMessage: string,
  imageBase64?: string,
  imageMimeType?: string,
  model?: string
): Promise<{ text: string; tokensIn?: number; tokensOut?: number; model: string }> {
  const modelName = model || AI_MODEL || "claude-3-5-haiku-20241022";
  const messages: any[] = [];

  for (const msg of history.slice(-MAX_CONTEXT_MESSAGES)) {
    messages.push({ role: msg.role === "assistant" ? "assistant" : "user", content: msg.content });
  }

  if (imageBase64 && imageMimeType) {
    messages.push({
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: imageMimeType, data: imageBase64 } },
        { type: "text", text: userMessage },
      ],
    });
  } else {
    messages.push({ role: "user", content: userMessage });
  }

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": AI_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: modelName, system: systemPrompt, messages, max_tokens: 2048 }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Claude API error ${resp.status}: ${errText.slice(0, 200)}`);
  }

  const data = await resp.json();
  return {
    text: data.content?.[0]?.text ?? "",
    tokensIn: data.usage?.input_tokens,
    tokensOut: data.usage?.output_tokens,
    model: modelName,
  };
}

// ─── Route to configured provider ────────────────────────────────────────────
async function callAI(
  systemPrompt: string,
  history: Array<{ role: string; content: string }>,
  userMessage: string,
  imageBase64?: string,
  imageMimeType?: string
): Promise<{ text: string; tokensIn?: number; tokensOut?: number; model: string }> {
  const provider = (AI_PROVIDER || (GROQ_API_KEY ? "groq" : "")).toLowerCase();
  const model = AI_MODEL;

  if (provider === "groq" || (!provider && GROQ_API_KEY)) {
    return await callGroq(systemPrompt, history, userMessage, imageBase64, imageMimeType, model);
  }
  if (provider === "gemini") {
    return await callGemini(systemPrompt, history, userMessage, imageBase64, imageMimeType, model);
  }
  if (provider === "openai") {
    return await callOpenAI(systemPrompt, history, userMessage, imageBase64, imageMimeType, model);
  }
  if (provider === "claude") {
    return await callClaude(systemPrompt, history, userMessage, imageBase64, imageMimeType, model);
  }

  throw new Error("AI_PROVIDER_NOT_CONFIGURED");
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Authenticate request
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Check AI provider configuration (Groq or other supported provider)
  const hasValidKey = Boolean(GROQ_API_KEY || AI_API_KEY);
  if (!hasValidKey) {
    return new Response(
      JSON.stringify({
        error: "AI_PROVIDER_NOT_CONFIGURED",
        message: "The AI provider (Groq) is not configured yet. Please configure GROQ_API_KEY in Supabase Edge Function Secrets.",
        providerConfigured: false,
      }),
      {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const startTime = Date.now();
  let requestBody: DoubtBuddyRequest;

  try {
    requestBody = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const {
    conversationId,
    userMessage,
    inputType = "text",
    mode = "normal",
    imageBase64,
    imageMimeType,
    studentContext,
    historyMessages = [],
  } = requestBody;

  // Validate
  if (!userMessage || userMessage.trim().length === 0) {
    return new Response(JSON.stringify({ error: "Empty message" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (userMessage.length > 5000) {
    return new Response(JSON.stringify({ error: "Message too long. Please keep your question under 5000 characters." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Check usage limits
  const limitCheck = await checkUsageLimit(supabaseAdmin, user.id, inputType);
  if (!limitCheck.allowed) {
    return new Response(JSON.stringify({ error: "USAGE_LIMIT", message: limitCheck.message }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let aiText = "";
  let tokensIn = 0;
  let tokensOut = 0;
  let modelUsed = AI_MODEL || AI_PROVIDER;
  let success = true;
  let errorMessage: string | undefined;
  let sourceType: "SRI_SAI_MATERIAL" | "GENERAL_AI" = "GENERAL_AI";
  let ragSources: Array<{ title: string; subject: string; chapter: string; snippet: string; materialId?: string }> = [];

  try {
    // 1. RAG: Fetch relevant SRI SAI material chunks
    ragSources = await fetchRelevantChunks(supabaseAdmin, userMessage, studentContext);

    // 2. Build system prompt
    const systemPrompt = buildSystemPrompt(studentContext, mode);

    // 3. Augment user message with RAG context if available
    let augmentedMessage = userMessage;
    if (ragSources.length > 0) {
      sourceType = "SRI_SAI_MATERIAL";
      const contextBlock = ragSources
        .map((src, i) => `[SRI SAI Material ${i + 1}: ${src.title} — ${src.subject} / ${src.chapter}]\n${src.snippet}`)
        .join("\n\n---\n\n");
      augmentedMessage = `The following is relevant content from SRI SAI study material:\n\n${contextBlock}\n\n---\n\nStudent question: ${userMessage}\n\nAnswer based on the above material where relevant. If the material directly answers the question, reference it. If not, supplement with your general knowledge and clearly distinguish it.`;
    }

    // 4. Call AI
    const result = await callAI(systemPrompt, historyMessages, augmentedMessage, imageBase64, imageMimeType);
    aiText = result.text;
    tokensIn = result.tokensIn ?? 0;
    tokensOut = result.tokensOut ?? 0;
    modelUsed = result.model;
  } catch (err: any) {
    success = false;
    errorMessage = err.message;

    if (err.message === "AI_PROVIDER_NOT_CONFIGURED") {
      return new Response(
        JSON.stringify({
          error: "AI_PROVIDER_NOT_CONFIGURED",
          message: "AI provider credentials are not configured yet.",
          providerConfigured: false,
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log failure usage
    await supabaseAdmin.from("ai_usage").insert({
      user_id: user.id,
      conversation_id: conversationId ?? null,
      request_type: inputType,
      input_type: inputType,
      model_used: modelUsed,
      success: false,
      error_message: errorMessage?.slice(0, 500),
      latency_ms: Date.now() - startTime,
    });

    return new Response(
      JSON.stringify({
        error: "AI_ERROR",
        message: "Sorry, I couldn't process that right now. Please try again in a moment. 😊",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // 5. Log successful usage
  await supabaseAdmin.from("ai_usage").insert({
    user_id: user.id,
    conversation_id: conversationId ?? null,
    request_type: inputType,
    input_type: inputType,
    model_used: modelUsed,
    tokens_input: tokensIn,
    tokens_output: tokensOut,
    success: true,
    latency_ms: Date.now() - startTime,
  });

  return new Response(
    JSON.stringify({
      reply: aiText,
      sourceType,
      sources: ragSources.map((s) => ({
        title: s.title,
        subject: s.subject,
        chapter: s.chapter,
        materialId: s.materialId,
      })),
      model: modelUsed,
      providerConfigured: true,
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
