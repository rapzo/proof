import { Table } from './table';

export type COMMAND = 'PROJECT' | 'FILTER';

export type OPERATOR = '=' | '>';

// PROJECT col1, col2 FILTER col3 > "value"
const grammar =
  /^(PROJECT)\s+([,\w\s*]+)\s*(?:(FILTER)\s+(\w+)\s*(>|=)\s*"([^"]*)")?$/;

export function query(table: Table, input: string) {
  console.log(input);
  if (!grammar.test(input)) {
    throw new Error('Not a valid query');
  }

  const [, , columns, operation, column, value] = input.match(
    grammar
  ) as RegExpMatchArray;
  console.log(columns, operation, column, value);

  const result: Record<string, string[]> = {};

  columns.split(',').forEach((col) => {
    const column = col.trim();
    const index = Array.from(table.columns).indexOf(column);

    if (!result[column]) {
      result[column] = [];
    }

    result[column].push(table.rows[index].toString());
  });

  return result;
}
