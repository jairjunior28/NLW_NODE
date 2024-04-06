export function generateSlug(params: string): string {
  return params
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, "")
    .replace(/\s+/g, "-");
}
