const TARGET_CHARS = 900;

export function paginateParagraphs(paragraphs: string[]): string[][] {
  const pages: string[][] = [];
  let current: string[] = [];
  let currentLen = 0;

  for (const paragraph of paragraphs) {
    const nextLen = currentLen + paragraph.length;

    if (current.length > 0 && nextLen > TARGET_CHARS) {
      pages.push(current);
      current = [paragraph];
      currentLen = paragraph.length;
      continue;
    }

    current.push(paragraph);
    currentLen = nextLen;
  }

  if (current.length > 0) {
    pages.push(current);
  }

  return pages.length > 0 ? pages : [[""]];
}
