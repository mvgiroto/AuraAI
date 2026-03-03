import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type AdviceRequest = {
  message?: string;
  locale?: string;
};

type OpenAIChoice = {
  message?: {
    content?: string;
  };
};

type OpenAIResponse = {
  choices?: OpenAIChoice[];
  error?: {
    message?: string;
    type?: string;
  };
};

const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' };

const jsonResponse = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  });

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed. Use POST.' });
  }

  try {
    let requestBody: AdviceRequest;
    try {
      requestBody = (await req.json()) as AdviceRequest;
    } catch {
      return jsonResponse(400, { error: 'Invalid JSON payload.' });
    }

    const { message, locale = 'pt' } = requestBody;
    const normalizedMessage = message?.trim();

    if (!normalizedMessage || normalizedMessage.length < 12) {
      return jsonResponse(400, { error: 'Message must contain at least 12 characters.' });
    }

    const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
    const openAiModel = Deno.env.get('OPENAI_MODEL') ?? 'gpt-4o-mini';

    if (!openAiApiKey) {
      return jsonResponse(500, { error: 'OPENAI_API_KEY is not configured.' });
    }

    const systemPrompt =
      locale.toLowerCase().startsWith('en')
        ? 'You are a relationship coach. Reply with one practical, empathetic suggestion in up to 90 words.'
        : 'Você é um coach de relacionamento. Responda com uma sugestão prática e empática em até 90 palavras.';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: openAiModel,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: normalizedMessage },
        ],
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    const payload = (await response.json().catch(() => ({}))) as OpenAIResponse;

    if (!response.ok) {
      return jsonResponse(502, {
        error: 'AI provider request failed.',
        details: payload.error?.message ?? `HTTP ${response.status}`,
        type: payload.error?.type,
      });
    }

    const suggestion = payload.choices?.[0]?.message?.content?.trim();

    if (!suggestion) {
      return jsonResponse(502, { error: 'AI provider returned an empty suggestion.' });
    }

    return jsonResponse(200, { suggestion });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error.';
    return jsonResponse(500, { error: message });
  }
});
