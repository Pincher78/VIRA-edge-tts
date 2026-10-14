// ============================================================
// VIRA TTS Client
// Ходит на собственный FastAPI-сервер (Ubuntu + edge-tts)
// вместо прямого подключения к Microsoft.
// ============================================================

export const DEFAULT_VOICE = "ru-RU-SvetlanaNeural";

const VIRA_TTS_SERVER = "http://80.234.91.193";

export type TtsInput = {
  text: string;
  voice?: string;
};

export async function createAudioStream(
  { text, voice }: TtsInput
): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch(`${VIRA_TTS_SERVER}/tts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      voice: voice ?? DEFAULT_VOICE,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `VIRA TTS server error: ${response.status} — ${errorText}`
    );
  }

  if (!response.body) {
    throw new Error("VIRA TTS server returned empty body");
  }

  return response.body as ReadableStream<Uint8Array>;
}

export async function getVoices(): Promise<
  Array<{ ShortName: string; Gender: string; Locale: string }>
> {
  // Упрощённая версия — список голосов теперь на сервере.
  // Если нужно — можно добавить эндпоинт /voices на FastAPI.
  return [
    {
      ShortName: "ru-RU-SvetlanaNeural",
      Gender: "Female",
      Locale: "ru-RU",
    },
    {
      ShortName: "ru-RU-DmitryNeural",
      Gender: "Male",
      Locale: "ru-RU",
    },
  ];
}