# NM Fire AI — Official Datasheets

Place approved, public PDF datasheets in this folder and list each one in `../ai-datasheets.json`.

Example manifest entry:

```json
{
  "documents": [
    {
      "filename": "split-case-fire-pump.pdf",
      "title": "Split-case Fire Pump Datasheet",
      "keywords": ["split-case", "flow", "head", "UL", "FM", "performance"]
    }
  ]
}
```

The Worker selects up to two matching datasheets for each question and sends their public PDF URLs to OpenRouter's PDF parser. Keep this folder limited to approved public documents; do not add confidential or customer-specific files.

After adding PDFs or changing the manifest, redeploy the Cloudflare Worker separately. GitHub Pages publishing alone does not deploy `ai-worker/index.js`.
