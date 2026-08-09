import fs from 'fs';
import path from 'path';

const BUGS_FILE = path.resolve(__dirname, '../../bugs.json');

export type BugEntry = {
  suite: string;
  field: string;
  scenario: string;
  input: string;
  expected: string;
  actual: string;
  notes: string;
  timestamp: string;
};

export function recordIfBug(entry: Omit<BugEntry, 'timestamp'>): void {
  if (entry.actual === entry.expected) return;

  let existing: BugEntry[] = [];
  try {
    existing = JSON.parse(fs.readFileSync(BUGS_FILE, 'utf-8'));
  } catch {
    existing = [];
  }

  existing.push({ ...entry, timestamp: new Date().toISOString() });
  fs.writeFileSync(BUGS_FILE, JSON.stringify(existing, null, 2));
}
