import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

export default function About({ content }: { content: string }) {
  return (
    <article className="prose lg:prose-xl container mx-auto p-4">
      <ReactMarkdown remarkPlugins={[gfm]}>{content}</ReactMarkdown>
    </article>
  );
}

export async function getStaticProps() {
  // Read the content from the Markdown file
  const filePath = path.join(process.cwd(), "content", "about.md");
  const content = fs.readFileSync(filePath, "utf-8");

  return {
    props: {
      content,
    },
  };
}
