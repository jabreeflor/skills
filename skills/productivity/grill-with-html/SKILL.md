---
name: grill-with-html
description: Grill the user on a plan or design, but run the interview through a local HTML page where they can type comments, paste or drag in images, and drop files into context. Use when the user wants to be grilled with a visual interview form, mentions "grill me with html", or wants to attach files/images to their answers.
---

<what-to-do>

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Instead of asking in chat, run the interview through the local HTML form in this skill so I can type comments, paste/drag images, and drop files into context.

If a question can be answered by exploring the codebase, explore the codebase instead.

</what-to-do>

<how-to-run>

The form runs against a tiny local server (`server.py`) so the round-trip is automatic: questions render on open, answers POST straight back, and you pick them up without asking the user to hand you a file.

1. **Write the first questions.** Create `grill-questions.json` next to `grill.html` in this skill directory, using the format below. Include only the questions you're ready to ask in this round (start with the first 3-6, ordered so dependencies come first). For each, give a clear recommended answer and 2-3 concrete options.

2. **Start the server and open it.** Run `python3 "<skill-dir>/server.py" <port> &` (default 8765; pick another free port if taken), then open `http://localhost:<port>/`. The questions render immediately, and the page re-renders automatically whenever you overwrite `grill-questions.json`.

3. **Arm the persistent Monitor — do this immediately, before telling me anything.** This is the single most important step and the easiest to forget. Start **one** persistent `Monitor` that emits an event on *every* submission by watching the responses file's mtime. Because it watches all rounds, you never re-arm it — set it up once, right after step 2, and never proceed to step 4 until it's running. Do **not** use a blocking bash loop or ask me to tell you when I'm done.

   ```
   cd "<skill-dir>"; prev=""; while true; do cur=$(stat -f %m grill-responses.json 2>/dev/null || stat -c %Y grill-responses.json 2>/dev/null); if [ -n "$cur" ] && [ "$cur" != "$prev" ]; then prev=$cur; echo "responses submitted: $(date)"; fi; sleep 1; done
   ```

   Set `persistent: true` so it runs for the whole session. Every time I submit, you get an event — no per-round re-arming.

4. **Tell me what to do.** Instruct me to answer the questions (each card has a comment box and a drop zone for files/images), then click **Submit responses** — which POSTs straight back to the server.

5. **On each Monitor event, read my answers.** Read `grill-responses.json`. It contains my selected option, free-text comment, and any files I attached (images as data URLs, text files inline).

6. **Continue.** Use my answers to resolve that branch, then overwrite `grill-questions.json` (the page re-renders automatically — no reload needed). The persistent Monitor from step 3 is still watching, so just wait for the next event. Repeat until we reach shared understanding.

7. **Finish.** When the grilling is complete, write `{"done": true, "message": "…optional summary…"}` to `grill-questions.json`. The page shows a completion screen instead of more questions, and you can stop the Monitor with `TaskStop`. (After I submit a round, the form already shows a spinner that says it's waiting for the next round, so I always have feedback that my answers landed.)

Each submission is also archived by the server to a per-session cache at `tmp/session-<timestamp>/` as `round-N-questions.json` / `round-N-responses.json`, so the full history of the grilling is preserved. The server prints the session path on startup. `tmp/` and the working `grill-*.json` files are gitignored.

</how-to-run>

<data-format>

`grill-questions.json` (you write this):

```json
{
  "topic": "Short title for this grilling session",
  "questions": [
    {
      "id": 1,
      "question": "The question text.",
      "recommendation": "Your recommended answer and the one-sentence trade-off.",
      "options": ["Recommended option", "Alternative A", "Alternative B"],
      "svg": "<svg xmlns='http://www.w3.org/2000/svg' ...>...</svg>"
    }
  ]
}
```

Each option may be a plain string (a chip) **or** an object `{ "label": "...", "svg": "<svg…>" }`. When options carry `svg`, the form renders them as a grid of selectable diagram cards — so a single question can offer 3-4 visual choices (e.g. nav patterns or layouts), not just two. You can use as many diagram options as the decision needs:

```json
"options": [
  { "label": "Top tabs",     "svg": "<svg viewBox='0 0 200 150' …>…</svg>" },
  { "label": "Left sidebar", "svg": "<svg viewBox='0 0 200 150' …>…</svg>" },
  { "label": "Bottom nav",   "svg": "<svg viewBox='0 0 200 150' …>…</svg>" }
]
```

Mix freely: a question's top-level `svg` (shared context diagram) can coexist with per-option `svg` thumbnails. Use a `viewBox` (no fixed width/height) on option SVGs so they scale to the card.

## Diagrams (optional `svg` per question)

When a question is about a design — architecture, data flow, state machine, layout, comparing two structures — include an inline diagram. Add an `svg` field containing raw SVG markup; the form renders it above the options. Use it to **explain** a question (illustrate the thing being decided) or to **pose** one (e.g. "which of these two flows do you want?").

- Author the SVG yourself. Keep it self-contained — no external `<image href>` or remote fonts; inline everything.
- It's rendered via an `<img>` data URL, so scripts inside the SVG won't run. Don't rely on SVG interactivity.
- Use a light background and dark strokes/text so it's legible (the form gives diagrams a white backing).
- Only add a diagram when it genuinely clarifies. Skip it for simple yes/no or terminology questions.

**Quality rules — diagrams must look clean, not clipped:**

- **Size every box to its text.** A `text-anchor='middle'` label that's wider than its `rect` gets clipped on both sides (the most common failure). Estimate ~0.55em per character at the given font-size and make the box wider than that, with padding. When unsure, make the box bigger or shorten the label.
- **Set explicit `width`/`height`** on the `<svg>` and keep all shapes/text comfortably inside it — nothing should touch or cross the edges.
- **Center text correctly:** with `text-anchor='middle'`, the `x` must equal the box's center (`rect.x + width/2`), and `y` should sit on the text baseline (roughly box vertical-center + a third of the font-size).
- **One label per line.** Don't cram two words that won't fit — stack them as separate `<text>` lines (`dy` or distinct `y`), as in the multi-line boxes in the example below.
- **Leave breathing room** between boxes and arrows; arrowheads should land just before the target box, not overlap it.
- Prefer a small, consistent palette and font-size; avoid font-size below 11.

Example of a well-sized diagram (boxes wider than their text, multi-line labels stacked, arrows stopping short of targets):

```
<svg xmlns='http://www.w3.org/2000/svg' width='560' height='90' font-family='system-ui' font-size='13'>
  <defs><marker id='a' markerWidth='9' markerHeight='9' refX='7' refY='3' orient='auto'>
    <path d='M0,0 L6,3 L0,6 z' fill='#666'/></marker></defs>
  <rect x='10' y='12' width='130' height='46' rx='6' fill='#eef' stroke='#447'/>
  <text x='75' y='40' text-anchor='middle'>description</text>
  <rect x='215' y='12' width='130' height='46' rx='6' fill='#efe' stroke='#474'/>
  <text x='280' y='35' text-anchor='middle'>write-skill</text>
  <text x='280' y='51' text-anchor='middle' font-size='11'>(clarify + gen)</text>
  <line x1='140' y1='35' x2='213' y2='35' stroke='#666' marker-end='url(#a)'/>
</svg>
```

`grill-responses.json` (the form writes this, you read it):

```json
{
  "topic": "Short title for this grilling session",
  "responses": [
    {
      "id": 1,
      "question": "The question text.",
      "choice": "Alternative A",
      "comment": "Free-text notes the user typed.",
      "files": [
        { "name": "diagram.png", "type": "image/png", "dataUrl": "data:image/png;base64,..." },
        { "name": "schema.sql", "type": "text/plain", "text": "create table ..." }
      ]
    }
  ]
}
```

</data-format>
