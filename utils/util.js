import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export function getDirname(importMetaUrl) {
  const filePath = fileURLToPath(importMetaUrl);
  return dirname(filePath);
}

export function readJson(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const obj = JSON.parse(data);
  return obj;
}
