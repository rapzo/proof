import { Readable } from 'node:stream';
import { parse } from 'csv';
import { addColumn, addRow, createTable, Table } from './table';

export async function ingest(stream: Readable): Promise<Table> {
  const table = createTable();
  const data = stream.pipe(parse());
  let hasHeader = false;

  for await (const record of data) {
    if (!hasHeader && Array.isArray(record)) {
      record.forEach((name) => addColumn(table, name));
      hasHeader = true;
    } else {
      addRow(table, record);
    }
  }

  return table;
}
