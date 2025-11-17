import { parse } from "csv-parse/sync";

export function parseCSVBuffer(buffer) {
  return parse(buffer, { columns: true, skip_empty_lines: true, trim: true });
}
