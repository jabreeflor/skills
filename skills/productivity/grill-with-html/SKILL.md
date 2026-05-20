---
name: grill-with-html
description: Run a grilling interview in a local HTML form when the user wants
  visual questions, comments, pasted images, dragged images, or dropped files.
---

<what-to-do>

Interview me on a plan or design until we reach shared understanding. Ask
dependency-first questions, branch through the design tree, and recommend an
answer for each question. If code inspection can answer something, do that
instead of asking.

Use this skill's HTML form for the interview, not chat.

</what-to-do>

<how-to-run>

The form uses `server.py`, reads `grill-questions.json`, and writes
`grill-responses.json`.

1. Write 3-6 dependency-first questions to `grill-questions.json` next to
   `grill.html`. Include one recommendation and 2-3 options per question.

2. Start the server. It chooses a port and opens the page:

   ```sh
   python3 "<skill-dir>/server.py" &
   ```

   The page re-renders when questions change.

3. Before telling me anything, start one persistent Monitor on
   `grill-responses.json` mtime. It covers all rounds. Do not use a blocking
   bash loop or ask me when I am done. Emit an event on every submission.

4. Tell me to answer the page questions and click **Submit responses**.

5. On each Monitor event, read `grill-responses.json`, use the answers and
   attachments, then overwrite `grill-questions.json` for the next round.

6. Finish with `{ "done": true, "message": "...summary..." }` in
   `grill-questions.json`, then stop the Monitor with `TaskStop`.

The server archives rounds under `tmp/session-<timestamp>/`. `tmp/` and
`grill-*.json` are gitignored.

</how-to-run>

<data-format>

Write `grill-questions.json` with `topic` and `questions`. Each question has
`id`, `question`, `recommendation`, `options`, and optional `svg`.

Options can also be `{ "label": "Option label", "svg": "<svg...>" }`.
Use option SVGs for visual choices. Give option SVGs a `viewBox` and no fixed
`width` or `height`. Question-level SVGs can coexist with option SVGs.

Read `grill-responses.json` for `topic` and `responses`. Each response has
`id`, `question`, `choice`, `comment`, and `files`. Files include `name`,
`type`, and either `dataUrl` for images or `text` for text files.

Add optional self-contained `svg` for architecture, data flow, layouts, or
structural comparisons. Skip diagrams for yes/no and terminology questions.
Use light backgrounds, dark strokes/text, explicit question-SVG sizes, and
bounds that contain every shape. Size boxes to text, stack long labels, keep
font size at least `11`, and stop arrows before target boxes.

</data-format>
