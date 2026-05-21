import fs from "node:fs";
import path from "node:path";

export default function HomePage() {
  const homepage = fs.readFileSync(path.join(process.cwd(), "public", "index.html"), "utf8");
  const body = homepage
    .match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1]
    .replace(/<script src="script\.js"><\/script>/i, "") || "";

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/styles.css" />
      <div dangerouslySetInnerHTML={{ __html: body }} />
      <script src="/script.js" />
    </>
  );
}
