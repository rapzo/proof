import fs from 'node:fs';
import { resolve } from 'node:path';
import { finished } from 'node:stream/promises';
import { parse, transform, stringify, generate } from 'csv';

export async function parser(filepath: string): Promise<string> {
  await finished(
    generate({ length: 10 }).pipe(
      fs.createWriteStream(resolve(__dirname, 'example.fs.input.csv'))
    )
  );

  await finished(
    fs
      .createReadStream(`${__dirname}/example.fs.input.csv`)
      .pipe(parse())
      .pipe(transform((record) => record.reverse()))
      .pipe(stringify())
      .pipe(fs.createWriteStream(`${__dirname}/example.fs.output.csv`))
  );

  return 'parser';
}
