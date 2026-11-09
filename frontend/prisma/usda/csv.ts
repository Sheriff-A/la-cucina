// A small RFC 4180 CSV reader for the USDA FoodData Central downloads: quoted fields,
// doubled quotes, and newlines inside quotes. The files we read are a few MB at most.

import { readFileSync } from "node:fs";

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const start = text.charCodeAt(0) === 0xfeff ? 1 : 0; // byte-order mark

  for (let i = start; i < text.length; i++) {
    const ch = text[i]!;
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/** Reads a CSV file with a header row into records keyed by column name. */
export function readCsvRecords(path: string): Record<string, string>[] {
  const [header, ...rows] = parseCsv(readFileSync(path, "utf8"));
  if (!header) return [];
  return rows
    .filter((r) => r.length > 1 || r[0] !== "")
    .map((r) =>
      Object.fromEntries(header.map((name, i) => [name, r[i] ?? ""])),
    );
}
