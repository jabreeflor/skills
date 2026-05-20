---
name: grill-with-html
description: Grill the user on a plan or design, but run the interview through a local HTML page where they can type comments, paste or drag in images, and drop files into context. Use when the user wants to be grilled with a visual interview form, mentions "grill me with html", or wants to attach files/images to their answers.
---

<what-to-do>

Interview me relentlessly about every aspect of this plan until we reach shared understanding. Walk each branch of the design tree, resolving dependencies one by one. For each question, give your recommended answer. If a question can be answered by exploring the codebase, do that instead of asking.

Run the interview through the local HTML form in this skill so I can type comments, paste/drag images, and drop files into context — not in chat.

</what-to-do>

<how-to-run>

The form talks to a tiny local server (`server.py`): questions render on open, answers POST straight back, and you pick them up without asking me for a file.

1. **Write the first questions** to `grill-questions.json` next to `grill.html` (format below). Include only this round — start with 3-6, dependencies first. Give each a recommended answer and 2-3 options.

2. **Start the server and open it.** `python3 "<skill-dir>/server.py" <port> &` (default 8765; pick another if taken), then open `http://localhost:<port>/`. The page re-renders automatically whenever you overwrite `grill-questions.json`.

3. **Arm the persistent Monitor immediately, before telling me anything.** Start **one** persistent `Monitor` that emits an event on every submission by watching the responses file's mtime. It covers all rounds, so you never re-arm. Do **not** use a blocking bash loop or ask me when I'm done.

   ```
   cd "<skill-dir>"; prev=""; while true; do cur=$(stat -f %m grill-responses.json 2>/dev/null || stat -c %Y grill-responses.json 2>/dev/null); if [ -n "$cur" ] && [ "$cur" != "$prev" ]; then prev=$cur; echo "responses submitted: $(date)"; fi; sleep 1; done
   ```

4. **Tell me what to do:** answer the questions (each card has a comment box and a file/image drop zone), then click **Submit responses**.

5. **On each Monitor event, read `grill-responses.json`** — my selected option, comment, and any attached files (images as data URLs, text inline).

6. **Continue.** Resolve that branch, overwrite `grill-questions.json` (auto re-renders), wait for the next event. Repeat until shared understanding.

7. **Finish.** Write `{"done": true, "message": "…summary…"}` to `grill-questions.json` for a completion screen, then stop the Monitor with `TaskStop`.

Each round is archived by the server to `tmp/session-<timestamp>/` as `round-N-questions.json` / `round-N-responses.json`. `tmp/` and the working `grill-*.json` files are gitignored.

</how-to-run>

<data-format>

`grill-questions.json` (you write):

```json
{
  "topic": "Short title",
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

Each option is a string (a chip) **or** an object `{ "label": "...", "svg": "<svg…>" }`. When options carry `svg`, the form renders a grid of selectable diagram cards — use 3-4 visual choices when the decision needs them (nav patterns, layouts). A question's top-level `svg` (shared context) can coexist with per-option thumbnails. Use a `viewBox` (no fixed width/height) on option SVGs so they scale.

`grill-responses.json` (form writes, you read):

```json
{
  "topic": "Short title",
  "responses": [
    {
      "id": 1,
      "question": "The question text.",
      "choice": "Alternative A",
      "comment": "Free-text notes.",
      "files": [
        { "name": "diagram.png", "type": "image/png", "dataUrl": "data:image/png;base64,..." },
        { "name": "schema.sql", "type": "text/plain", "text": "create table ..." }
      ]
    }
  ]
}
```

**Diagrams (optional `svg`):** include one when a question is about a design (architecture, data flow, layout, comparing structures). Author it yourself, self-contained — no external `<image href>` or remote fonts. It renders via an `<img>` data URL, so embedded scripts won't run. Use a light background with dark strokes/text. Skip it for yes/no or terminology questions.

Keep diagrams clean, not clipped:
- **Size every box to its text** (~0.55em per char at the font-size, plus padding) — a `text-anchor='middle'` label wider than its `rect` gets clipped. When unsure, go bigger or shorten the label.
- Set explicit `width`/`height` on the `<svg>`; keep all shapes inside it.
- With `text-anchor='middle'`, `x` = box center (`rect.x + width/2`), `y` ≈ box vertical-center + a third of the font-size.
- One label per `<text>` line; stack overflow words. Stop arrows just short of their target box. Avoid font-size below 11.

Example (boxes wider than text, arrow stopping short):

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

</data-format>
