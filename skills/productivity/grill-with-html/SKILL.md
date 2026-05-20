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

1. **Write the questions.** Create `grill-questions.json` in the current working directory using the format below. Include only the questions you're ready to ask in this round (start with the first 3-6, ordered so dependencies come first). For each, give a clear recommended answer and 2-3 concrete options.

2. **Open the form.** Open `grill.html` (in this skill directory) in the browser. On macOS: `open "<skill-dir>/grill.html"`.

3. **Tell me what to do.** Instruct me to drag `grill-questions.json` onto the page, answer the questions (each card has a comment box and a drop zone for files/images), then click **Export responses** — which downloads `grill-responses.json` to my Downloads folder.

4. **Read my answers.** Once I confirm I've exported, read `grill-responses.json` (ask me for the path if it isn't in the working directory). It contains my selected option, free-text comment, and any files I attached (images as data URLs, text files inline).

5. **Continue.** Use my answers to resolve that branch, then write the next round of questions to `grill-questions.json` and repeat until we reach shared understanding.

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
      "options": ["Recommended option", "Alternative A", "Alternative B"]
    }
  ]
}
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
