export function flattenMessages(node: unknown, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") out[path] = value;
    else Object.assign(out, flattenMessages(value, path));
  }
  return out;
}

export function findForbiddenWords(messages: Record<string, string>, words: string[]): string[] {
  const pattern = new RegExp(`(?<![\\p{L}])(${words.join("|")})(?![\\p{L}])`, "iu");
  return Object.entries(messages)
    .filter(([, value]) => pattern.test(value))
    .map(([key, value]) => `${key}: ${value}`);
}
