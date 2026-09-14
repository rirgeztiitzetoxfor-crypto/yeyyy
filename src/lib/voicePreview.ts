export async function requestVoicePreview(text: string): Promise<string> {
  const response = await fetch("/api/voice-preview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Voice preview request failed (${response.status}).`);
  }

  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob);
}
