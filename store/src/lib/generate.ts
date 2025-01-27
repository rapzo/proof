// import { join } from 'node:path';
// import { createWriteStream } from 'node:fs';
import { generate as generateCsv } from 'csv';

export function generate() {
  return generateCsv({
    seed: 1,
    columns: ['ascii', 'int', 'ascii', 'bool', 'ascii', 'int'],
    length: 100,
  });
}
