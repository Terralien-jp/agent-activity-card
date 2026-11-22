"""Render aggregated agent activity as a GitHub Markdown table."""

import argparse
import json
import re
import string
from pathlib import Path


COLORS = ("🟠", "🟢", "🟣", "🟡")
BAR_WIDTH = 8
MAX_COUNT = (1 << 53) - 1  # Match the SVG generator's safe integer range.
MARKDOWN_PUNCTUATION = re.compile(f"[{re.escape(string.punctuation)}]")


def is_count(value):
    return type(value) is int and 0 <= value <= MAX_COUNT


def render_markdown(activity):
    if not isinstance(activity, dict) or type(activity.get("sample")) is not bool:
        raise ValueError("Provide a boolean sample flag.")
    agents = activity.get("agents")
    if not isinstance(agents, list) or not agents:
        raise ValueError("Provide a non-empty agents array.")

    for row in agents:
        if not isinstance(row, dict):
            raise ValueError("Each agent must be an object.")
        name = row.get("name")
        if not isinstance(name, str) or not name.strip():
            raise ValueError("Each agent needs a name.")
        if "tokens" not in row or (row["tokens"] is not None and not is_count(row["tokens"])):
            raise ValueError("Tokens must be a non-negative integer or null.")
        if not all(is_count(row.get(key)) for key in ("conversations", "requests", "success")):
            raise ValueError("Conversation, request and success counts must be non-negative integers.")
        if row["success"] > row["requests"]:
            raise ValueError("Successful requests cannot exceed all requests.")

    peak = max(1, max(row["tokens"] or 0 for row in agents))
    title = "## Agent activity · Sample data" if activity["sample"] else "## Agent activity"
    lines = [title, "", "| Agent | Tokens | Conversations | Successful / Requests |",
             "| --- | ---: | ---: | ---: |"]
    for index, row in enumerate(agents):
        name = MARKDOWN_PUNCTUATION.sub(lambda match: "\\" + match[0], " ".join(row["name"].split()))
        tokens = row["tokens"]
        token_cell = "—"
        if tokens is not None:
            blocks = (2 * BAR_WIDTH * tokens + peak) // (2 * peak)
            bar = "█" * blocks + "░" * (BAR_WIDTH - blocks)
            token_cell = f"**{tokens:,}** `{bar}`"

        success, requests = row["success"], row["requests"]
        result = f"{success:,} / {requests:,}"
        if requests:
            percent = (200 * success + requests) // (2 * requests)
            result += f" ({percent}%)"
        color = COLORS[index % len(COLORS)]
        lines.append(f"| {color} {name} | {token_cell} | {row['conversations']:,} | {result} |")

    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, nargs="?", default=Path("activity.json"))
    args = parser.parse_args()
    try:
        print(render_markdown(json.loads(args.input.read_text(encoding="utf-8"))), end="")
    except (OSError, ValueError) as error:
        parser.exit(1, f"{error}\n")


if __name__ == "__main__":
    main()
