// ───────────────────────────────────────────────────────────────
// Mini-parser de Markdown para los expedientes.
// Formato del archivo:
//   ---\n{ JSON con metadatos }\n---\n  cuerpo en Markdown
// Bloques soportados: ## títulos, párrafos, > citas, :::bio ... ::: y
// marcadores {{img:N|float}}, {{table}}, {{quote}}, {{timeline}}.
// Se ejecuta en tiempo de carga del módulo (contenido empaquetado, sin red).
// ───────────────────────────────────────────────────────────────

export type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "bio"; title: string; text: string }
  | { type: "img"; index: number; float: boolean }
  | { type: "table" }
  | { type: "quote" }
  | { type: "timeline" };

export interface ParsedDoc<M = Record<string, unknown>> {
  meta: M;
  blocks: Block[];
  words: number;
}

/** Separa el frontmatter JSON del cuerpo. Lanza error legible si falta o es inválido. */
export function splitFrontmatter(raw: string): { meta: unknown; body: string } {
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error("Documento sin frontmatter");
  // Tolera comas finales (error típico al editar JSON a mano)
  const json = m[1].replace(/,(\s*[}\]])/g, "$1");
  return { meta: JSON.parse(json), body: m[2] };
}

/** Convierte el cuerpo Markdown en una lista de bloques tipados. */
export function parseBody(body: string): Block[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let i = 0;

  const flush = () => {
    if (para.length) {
      blocks.push({ type: "p", text: para.join(" ").trim() });
      para = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i].trim();

    if (line === "") {
      flush();
      i++;
      continue;
    }

    // Bloque «Bioluminiscencia del dato»
    if (line.startsWith(":::bio")) {
      flush();
      const title = line.replace(":::bio", "").trim() || "Bioluminiscencia del dato";
      const buf: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ":::") {
        buf.push(lines[i].trim());
        i++;
      }
      i++; // cierra :::
      blocks.push({ type: "bio", title, text: buf.join(" ").trim() });
      continue;
    }

    // Marcadores de inserción
    const mk = line.match(/^\{\{\s*([a-z]+)(?::(\d+))?(?:\|([a-z]+))?\s*\}\}$/);
    if (mk) {
      flush();
      const [, kind, num, opt] = mk;
      if (kind === "img") blocks.push({ type: "img", index: Number(num ?? 0), float: opt === "float" });
      else if (kind === "table") blocks.push({ type: "table" });
      else if (kind === "quote") blocks.push({ type: "quote" });
      else if (kind === "timeline") blocks.push({ type: "timeline" });
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      flush();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      i++;
      continue;
    }

    if (line.startsWith("> ")) {
      flush();
      blocks.push({ type: "blockquote", text: line.slice(2).trim() });
      i++;
      continue;
    }

    para.push(line);
    i++;
  }
  flush();
  return blocks;
}

/** Cuenta palabras del texto visible (para el tiempo de lectura). */
export function countWords(blocks: Block[]): number {
  return blocks.reduce((n, b) => {
    if (b.type === "p" || b.type === "h2" || b.type === "blockquote") return n + b.text.split(/\s+/).filter(Boolean).length;
    if (b.type === "bio") return n + b.text.split(/\s+/).filter(Boolean).length;
    return n;
  }, 0);
}

export function parseDoc<M = Record<string, unknown>>(raw: string): ParsedDoc<M> {
  const { meta, body } = splitFrontmatter(raw);
  const blocks = parseBody(body);
  return { meta: meta as M, blocks, words: countWords(blocks) };
}
