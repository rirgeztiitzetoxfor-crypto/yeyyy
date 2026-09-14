# Media Drop Box — Radha Landing Experience

This project is a Vite + React landing page for Radha's premium event-hosting brand.

## Hear Radha voice preview

The **Hear Radha** section includes a live preview flow for ElevenLabs Text to Speech, but the vendor API key is now expected on the **server side only**.

## Local setup

### 1) Add your server env
Create a local `.env` file in project root:

```bash
ELEVENLABS_API_KEY=<your_api_key_here>
```

You can also copy `.env.example` as a starting point.

### 2) Install and run

```bash
npm install
npm run dev
```

### 3) Open the Hear Radha section
Enter a line and click **Generate voice preview**. The browser posts to `/api/voice-preview`, and the Vite server forwards the request to ElevenLabs.

## Voice settings used
- `voice_id`: `JBFqnCBsd6RMkjVDRZzb`
- `model_id`: `eleven_multilingual_v2`
- `output_format`: `mp3_44100_128`

## Security note
Do **not** expose provider secrets through `VITE_` environment variables. Those are bundled into client-side code. Keep `ELEVENLABS_API_KEY` server-side only.
