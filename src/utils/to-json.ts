export function toJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}
