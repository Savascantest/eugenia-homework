import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('public/homeworks');
const entries = [];
for (const dirent of await readdir(root, { withFileTypes: true })) {
  if (!dirent.isDirectory()) continue;
  const file = path.join(root, dirent.name, 'homework.json');
  const data = JSON.parse(await readFile(file, 'utf8'));
  entries.push({ id: data.id, date: data.date, dateLabel: data.dateLabel, title: data.title, path: `homeworks/${dirent.name}/homework.json` });
}
entries.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
await writeFile(path.join(root, 'index.json'), `${JSON.stringify(entries, null, 2)}\n`);
console.log(`Indexed ${entries.length} homework package(s).`);
