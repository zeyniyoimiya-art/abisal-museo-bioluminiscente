// Pruebas unitarias (Vitest) del parser de Markdown de expedientes.
import { describe, expect, it } from "vitest";
import { parseBody, parseDoc, splitFrontmatter } from "./markdown";

describe("frontmatter", () => {
  it("separa el JSON del cuerpo", () => {
    const { meta, body } = splitFrontmatter('---\n{"a":1}\n---\nHola');
    expect(meta).toEqual({ a: 1 });
    expect(body.trim()).toBe("Hola");
  });
  it("falla si no hay frontmatter", () => {
    expect(() => splitFrontmatter("sin nada")).toThrow();
  });
});

describe("bloques", () => {
  it("reconoce títulos, párrafos y marcadores", () => {
    const blocks = parseBody("## Título\n\nUn párrafo\ncon dos líneas.\n\n{{img:2|float}}\n\n{{table}}\n");
    expect(blocks[0]).toEqual({ type: "h2", text: "Título" });
    expect(blocks[1]).toEqual({ type: "p", text: "Un párrafo con dos líneas." });
    expect(blocks[2]).toEqual({ type: "img", index: 2, float: true });
    expect(blocks[3]).toEqual({ type: "table" });
  });
  it("reconoce el bloque de bioluminiscencia del dato", () => {
    const blocks = parseBody(":::bio Mi dato\nTexto uno\nTexto dos\n:::\n");
    expect(blocks[0]).toEqual({ type: "bio", title: "Mi dato", text: "Texto uno Texto dos" });
  });
  it("cuenta palabras", () => {
    const doc = parseDoc('---\n{}\n---\n## Hola mundo\n\nUno dos tres.\n');
    expect(doc.words).toBe(5);
  });
});
