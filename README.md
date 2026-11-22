# Agent Activity Card

Copy this Markdown table into your GitHub profile or project README and replace the sample totals with your own. You can edit it directly on GitHub.

```markdown
| Agent | Tokens in the last 7 days |
| --- | ---: |
| Claude Code | 124,580 |
| Codex | 87,340 |
| Antigravity | 61,720 |
```

Use the same time range and token-counting convention for every agent. Use `—` when a total is unavailable.

日本語では、上の表をREADMEに貼り、サンプルの数字を自分の集計値に差し替えるだけです。

## Optional SVG card

![Sample activity card for Claude Code, Codex, and Antigravity](./usage.svg)

1. Select **Use this template** on GitHub, or copy the template files into your repository.
2. Edit `activity.json` with your totals and set `sample` to `false`. Use `null` for an unmeasured token count.
3. Run `node render.mjs` with Node.js 22 or later. Commit `usage.svg` and reference it from your README.

```markdown
![Agent activity](./usage.svg)
```

[MIT License](./LICENSE)
