import { getCsrfToken, BASE_URL } from './api';

export interface StreamOptions {
  endpoint: string;
  payload: Record<string, any>;
  onToken: (token: string, accumulated: string) => void;
  onDiscipline?: (data: any) => void;
  onComplete?: (fullText: string, metadata?: any) => void;
  onError?: (error: Error) => void;
  signal?: AbortSignal;
}

/**
 * Production-grade Server-Sent Events (SSE) / Web Stream reader client.
 * Parses multi-event SSE streams (chunk, discipline, done, heartbeat).
 */
export async function streamAIInference({
  endpoint,
  payload,
  onToken,
  onDiscipline,
  onComplete,
  onError,
  signal,
}: StreamOptions): Promise<string> {
  let accumulatedText = '';
  let completedMetadata: any = null;
  const baseUrl = endpoint.startsWith('/api') ? endpoint : `${BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token') || '';
  const csrf = await getCsrfToken();

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        ...(csrf ? { 'CSRF-Token': csrf } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Accept': 'text/event-stream, application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
      signal,
    });

    if (!response.ok) {
      let errDetail = `HTTP ${response.status}`;
      try {
        const json = await response.json();
        if (json?.error) errDetail = json.error;
      } catch {
        const text = await response.text().catch(() => '');
        if (text) errDetail = text;
      }
      throw new Error(errDetail);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json') && !response.body) {
      const json = await response.json();
      const text = json.message || json.insight || JSON.stringify(json);
      accumulatedText = text;
      onToken(text, accumulatedText);
      onComplete?.(accumulatedText);
      return accumulatedText;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('ReadableStream not supported by backend response.');
    }

    const decoder = new TextDecoder('utf-8');
    let done = false;
    let currentEvent = 'chunk';
    let lineBuffer = '';

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        lineBuffer += decoder.decode(value, { stream: !done });
        const lines = lineBuffer.split('\n');
        // Keep the last incomplete line in lineBuffer
        lineBuffer = lines.pop() || '';

        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line || line.startsWith(':')) {
            // Heartbeat comment or empty line
            continue;
          }

          if (line.startsWith('event:')) {
            currentEvent = line.substring(6).trim();
            continue;
          }

          if (line.startsWith('data:')) {
            const dataStr = line.substring(5).trim();
            if (dataStr === '[DONE]') {
              done = true;
              break;
            }

            try {
              const parsed = JSON.parse(dataStr);

              if (currentEvent === 'chunk') {
                const tokenContent = parsed.text || parsed.chunk || parsed.token || parsed.content || '';
                accumulatedText += tokenContent;
                onToken(tokenContent, accumulatedText);
              } else if (currentEvent === 'discipline') {
                onDiscipline?.(parsed);
              } else if (currentEvent === 'done') {
                completedMetadata = parsed;
                done = true;
              } else if (currentEvent === 'error') {
                throw new Error(parsed.error || 'Stream error');
              }
            } catch (parseErr) {
              if (currentEvent === 'chunk') {
                accumulatedText += dataStr;
                onToken(dataStr, accumulatedText);
              }
            }
          }
        }
      }
    }

    onComplete?.(accumulatedText.trim(), completedMetadata);
    return accumulatedText.trim();
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return accumulatedText;
    }
    onError?.(error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}
