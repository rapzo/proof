import { Readable } from 'node:stream';
import { parse } from 'csv';
import { addRow, createTable, Table } from './store';

export async function ingest(stream: Readable): Promise<Table> {
  const table = createTable();

  for await (const record of stream.pipe(parse())) {
    addRow(table, record);
  }

  return table;
}
