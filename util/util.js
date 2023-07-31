import { fileURLToPath } from 'url';
import { dirname } from 'path';

export function getDirname(importMetaUrl) {
  const filePath = fileURLToPath(importMetaUrl);
  return dirname(filePath);
}
