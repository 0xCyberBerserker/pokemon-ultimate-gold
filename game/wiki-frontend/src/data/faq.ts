export function splitFaq(html: string): { introduction: string; entries: { question: string; answer: string }[] } {
  const headings = [...html.matchAll(/<h3>([\s\S]*?)<\/h3>/g)];
  return {
    introduction: html.slice(0, headings[0]?.index ?? html.length),
    entries: headings.map((heading, index) => ({
      question: heading[1],
      answer: html.slice(heading.index + heading[0].length, headings[index + 1]?.index ?? html.length),
    })),
  };
}
