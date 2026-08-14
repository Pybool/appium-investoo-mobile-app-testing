import fs from 'fs';
import path from 'path';

const LOG_FILE = path.resolve(__dirname, '../../mitm/requests.jsonl');

export type CapturedRequest = {
  method: string;
  url: string;
  path: string;
  status: number;
  requestBody: string;
  responseBody: string;
  timestamp: number;
};

export function clearMitmLog(): void {
  fs.writeFileSync(LOG_FILE, '');
}

function readAll(): CapturedRequest[] {
  try {
    const raw = fs.readFileSync(LOG_FILE, 'utf-8');
    return raw
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch {
    return [];
  }
}

export function findRequest(method: string, path: string): CapturedRequest | undefined {
  return readAll().find((r) => r.method === method && r.path === path);
}

export async function waitForRequest(
  method: string,
  path: string,
  timeout = 10000,
): Promise<CapturedRequest | undefined> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const found = findRequest(method, path);
    if (found) return found;
    await new Promise((r) => setTimeout(r, 300));
  }
  return undefined;
}
