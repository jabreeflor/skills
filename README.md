<p align="center">
  <img src="assets/banner.svg" alt="Skills" width="860">
</p>

# Skills

A collection of portable **agent skills** for Claude Code — from design-review interviews to full UI scaffolding. Each skill lives in its own folder and can be invoked by name or description.

## Skills

### Productivity

| Skill | Path | What it does |
|-------|------|--------------|
| **grill-me** | `skills/productivity/grill-me` | Interviews you on a plan one question at a time, recommending an answer for each before moving on. |
| **grill-with-html** | `skills/productivity/grill-with-html` | Same interview, delivered through a local HTML page — supports typed input, pasted images, and dropped files. |

### Engineering

| Skill | Path | What it does |
|-------|------|--------------|
| **grill-with-docs** | `skills/engineering/grill-with-docs` | Challenges your plan against the existing domain model and updates `CONTEXT.md` / ADRs inline as decisions crystallise. |
| **shadcn-dashboard** | `skills/engineering/shadcn-dashboard` | Scaffolds a production-ready Next.js dashboard with shadcn/ui — sidebar nav, KPI stat cards, charts, and data tables — then launches the dev server. |

## Usage

Each skill lives in its own folder with a `SKILL.md`. Invoke by name or describe what you want:

- "grill me on this plan"
- "grill me with html"
- "stress-test this design against our docs"
- "build a dashboard for my SaaS metrics"
- "scaffold an admin panel with shadcn"

## Repository layout

```
skills/
  productivity/
    grill-me/           # core chat interview
    grill-with-html/    # visual interview via local HTML form
  engineering/
    grill-with-docs/    # interview + inline documentation updates
    shadcn-dashboard/   # Next.js + shadcn/ui dashboard scaffold
docs/                   # Claude & Codex reference notes
AGENTS.md               # shared documentation links for agents
```

## License

[MIT](LICENSE)
