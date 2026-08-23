# Local API

The CLI remains available, but this local API now runs content generation, TTS, and learning HTML creation together.

Start the server:

```bash
uvicorn src.api:app --reload --port 8001
```

Health check:

```text
GET http://127.0.0.1:8001/health
```

Generate the deterministic sample, TTS audio, and learning HTML without an LLM call:

```powershell
$body = @{ sample = $true } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8001/pipeline/content -ContentType 'application/json' -Body $body
```

Pass `day = 2` in the JSON body to label the generated page as Day 02.

The response includes `html_url` and `audio_url`. The learning page is also available under `/outputs/.../learning.html`.

The interactive API documentation is available at `http://127.0.0.1:8001/docs`.
