import TurndownService from "turndown";

const turndownService = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
  strongDelimiter: "**",
});

turndownService.addRule("strikethrough", {
  filter: ["del", "s", "strike"],
  replacement: (content) => `~~${content}~~`,
});

// div → خط جدید
turndownService.addRule("div", {
  filter: "div",
  replacement: (content) => `\n${content}\n`,
});

export function htmlToMarkdown(html) {
  return turndownService.turndown(html);
}
