---
name: grill-with-html
description: Run a grilling interview through a local HTML form. Use when the
  user wants to be grilled with HTML, a visual interview form, or answers that
  include comments, pasted images, dragged images, or dropped files.
---

<what-to-do>

Interview me on a plan or design until we reach shared understanding.

Ask dependency-first questions, branch through the design tree, and give your
recommended answer for each question. If codebase exploration can answer a
question, inspect the code instead of asking me.

Run the interview through this skill's local HTML form, not chat.

</what-to-do>

<how-to-run>

The HTML form uses `server.py`. It renders questions, accepts submissions, and
writes answers to `grill-responses.json`.

1. Write the first round to `grill-questions.json` next to `grill.html`.
   Include 3-6 dependency-first questions. Give each a recommendation and
   2-3 options.

2. Start the server:

   ```sh
   python3 "<skill-dir>/server.py" <port> &
   ```

   Default to port `8765`; choose another if it is taken. Open
   `http://localhost:<port>/`. The page re-renders when
   `grill-questions.json` changes.

3. Before telling me anything, start one persistent Monitor. It should watch
   `grill-responses.json` mtime and emit an event on every submission.

   Do not use a blocking bash loop. Do not ask me when I am done. One Monitor
   covers all rounds.

   ```sh
   cd "<skill-dir>"
   prev=""
   while true; do
     cur=$(stat -f %m grill-responses.json 2>/dev/null ||
       stat -c %Y grill-responses.json 2>/dev/null)
     if [ -n "$cur" ] && [ "$cur" != "$prev" ]; then
       prev=$cur
       echo "responses submitted: $(date)"
     fi
     sleep 1
   done
   ```

4. Tell me to answer the page questions and click **Submit responses**.
   Each card has a comment box and a file/image drop zone.

5. On each Monitor event, read `grill-responses.json`. Use my selected option,
   comment, and attached files. Images arrive as data URLs; text files arrive
   inline.

6. Continue round by round. Resolve the current branch, overwrite
   `grill-questions.json`, then wait for the next Monitor event.

7. Finish by writing this to `grill-questions.json`, then stop the Monitor with
   `TaskStop`:

   ```json
   { "done": true, "message": "...summary..." }
   ```

The server archives each round under `tmp/session-<timestamp>/` as
`round-N-questions.json` and `round-N-responses.json`. `tmp/` and the working
`grill-*.json` files are gitignored.

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
      "recommendation": "Recommended answer and one-sentence trade-off.",
      "options": ["Recommended option", "Alternative A", "Alternative B"],
      "svg": "<svg xmlns='http://www.w3.org/2000/svg' ...>...</svg>"
    }
  ]
}
```

Options can be strings or objects:

```json
{ "label": "Option label", "svg": "<svg...>" }
```

Use option SVGs for visual choices such as layouts, navigation patterns, and
system structures. Use 3-4 visual options when a decision benefits from
comparison. A question-level `svg` can coexist with option SVGs.

For option SVGs, use a `viewBox` and no fixed `width` or `height`.

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
        {
          "name": "diagram.png",
          "type": "image/png",
          "dataUrl": "data:image/png;base64,..."
        },
        {
          "name": "schema.sql",
          "type": "text/plain",
          "text": "create table ..."
        }
      ]
    }
  ]
}
```

**Diagrams**

Add optional `svg` when a question concerns architecture, data flow, layouts,
or structural comparisons. Skip diagrams for yes/no or terminology questions.

SVG rules:

- Keep SVGs self-contained. Do not use remote fonts, scripts, or external
  `<image href>` values.
- Use a light background with dark strokes and text.
- Set explicit `width` and `height` on question-level SVGs.
- Keep all shapes inside the SVG bounds.
- Size boxes to their text. Use about `0.55em` per character plus padding.
- With centered text, set `x` to the box center and `y` near vertical center
  plus one third of the font size.
- Use one label per `<text>` line. Stack overflow words.
- Stop arrows just before their target box.
- Avoid font sizes below `11`.

Example:

```svg
<svg xmlns='http://www.w3.org/2000/svg'
  width='560' height='90' font-family='system-ui' font-size='13'>
  <defs>
    <marker id='a' markerWidth='9' markerHeight='9'
      refX='7' refY='3' orient='auto'>
      <path d='M0,0 L6,3 L0,6 z' fill='#666'/>
    </marker>
  </defs>
  <rect x='10' y='12' width='130' height='46'
    rx='6' fill='#eef' stroke='#447'/>
  <text x='75' y='40' text-anchor='middle'>description</text>
  <rect x='215' y='12' width='130' height='46'
    rx='6' fill='#efe' stroke='#474'/>
  <text x='280' y='35' text-anchor='middle'>write-skill</text>
  <text x='280' y='51' text-anchor='middle'
    font-size='11'>(clarify + gen)</text>
  <line x1='140' y1='35' x2='213' y2='35'
    stroke='#666' marker-end='url(#a)'/>
</svg>
```

</data-format>
