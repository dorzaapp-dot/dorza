export async function submitForm(
  endpoint: string,
  data: Record<string, unknown>
): Promise<{ success: boolean }> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return { success: false };
  return res.json();
}
