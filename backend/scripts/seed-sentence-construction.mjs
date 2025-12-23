import fs from "node:fs/promises";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";
const SEED_PATH = new URL("../seed/sentence-construction.seed.json", import.meta.url);
const CLEAR_EXISTING = process.env.CLEAR === "1";

const api = (path) => `${API_BASE_URL}${path}`;

async function http(method, path, body) {
  const res = await fetch(api(path), {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status} ${text}`);
  }
  return data;
}

async function main() {
  const raw = await fs.readFile(SEED_PATH, "utf8");
  const seed = JSON.parse(raw);

  if (CLEAR_EXISTING) {
    const all = await http("GET", "/sentence-construction/exercises");
    for (const item of all || []) {
      await http("DELETE", `/sentence-construction/exercises/${item.id}`);
    }
  }

  const mapping = [];

  for (const lesson of seed.lessons) {
    for (const ex of lesson.exercises) {
      const payload = {
        scrambledWords: ex.scrambledWords,
        correctSentences: ex.correctSentences,
        level: lesson.level,
      };

      const created = await http("POST", "/sentence-construction/exercises", payload);

      mapping.push({
        lessonNo: lesson.lessonNo,
        level: lesson.level,
        exerciseId: created?.id,
        correct: ex.correctSentences?.[0],
      });
    }
  }

  console.table(mapping);
  console.log("✅ Seed done.");
}

main().catch((e) => {
  console.error("❌ Seed failed:", e.message);
  process.exit(1);
});
