export function normalizeStatement(code: string): string {
  code = code.trim();
  if (!code.endsWith(';')) {
    code = code + ';';
  }
  code = code + '\n';
  return code;
}
