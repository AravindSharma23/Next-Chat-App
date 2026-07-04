export function summarizeMessages(messages: string[]) {
  if (messages.length === 0) {
    return "No messages found for the selected date range.";
  }

  const text = messages.join(" ");

  const keywords = extractKeywords(text);

  const totalMessages = messages.length;

  const shortSummary =
    text.length > 300
      ? text.slice(0, 300) + "..."
      : text;

  return `
Summary:
${shortSummary}

Message Count:
${totalMessages}

Key Topics:
${keywords.join(", ") || "General conversation"}

Suggested Action:
Review the important points and follow up with pending decisions if any.
`;
}

function extractKeywords(text: string) {
  const commonWords = [
    "the",
    "is",
    "are",
    "and",
    "or",
    "to",
    "for",
    "of",
    "in",
    "on",
    "with",
    "this",
    "that",
    "we",
    "you",
    "i",
    "a",
    "an",
  ];

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 4 && !commonWords.includes(word));

  const frequency: Record<string, number> = {};

  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word]) => word);
}