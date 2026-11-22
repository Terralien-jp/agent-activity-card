# Agent Activity Card

## Agent activity · Sample data

| Agent | Tokens | Conversations | Successful / Requests |
| --- | ---: | ---: | ---: |
| 🟠 Claude Code | **124,580** `████████` | 8 | 11 / 12 (92%) |
| 🟢 Codex | **87,340** `██████░░` | 6 | 9 / 10 (90%) |
| 🟣 Antigravity | **61,720** `████░░░░` | 5 | 7 / 7 (100%) |

The bars compare token totals against the largest measured value in the table.

## Use this Markdown table

Copy the table into your GitHub profile or project README and replace the sample values. Use the same reporting period and token-counting convention for every agent. Use `—` for an unmeasured token total.

<details>
<summary>Copy the Markdown</summary>

```markdown
## Agent activity · Sample data

| Agent | Tokens | Conversations | Successful / Requests |
| --- | ---: | ---: | ---: |
| 🟠 Claude Code | **124,580** `████████` | 8 | 11 / 12 (92%) |
| 🟢 Codex | **87,340** `██████░░` | 6 | 9 / 10 (90%) |
| 🟣 Antigravity | **61,720** `████░░░░` | 5 | 7 / 7 (100%) |
```

</details>

To generate the table from your aggregates, edit `activity.json`, set `sample` to `false`, and run this command with Python 3. Copy the output into your README.

```sh
python3 render_markdown.py
```

日本語では、表をコピーして数字を差し替えるか、自分の `activity.json` からPythonで表を生成できます。

## Optional SVG card

![Sample activity card for Claude Code, Codex, and Antigravity](./usage.svg)

1. Select **Use this template** on GitHub, or copy the template files into your repository.
2. Edit `activity.json` with your totals and set `sample` to `false`. Use `null` for an unmeasured token count.
3. Run `node render.mjs` with Node.js 22 or later. Commit `usage.svg` and reference it from your README.

```markdown
![Agent activity](./usage.svg)
```

[MIT License](./LICENSE)
