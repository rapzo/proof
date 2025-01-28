import { assert } from 'node:console';
import { Column, DataType, Table } from './table';

type GrammarGroups = {
  command: string;
  targets: string;
  operation?: string;
  target?: string;
  operator?: string;
  value?: string;
};

// PROJECT col1, col2 FILTER col3 > "value"
const grammar =
  /^(?:(?<command>\w+)\s+(?<targets>[\w\s,]+))(?:\s+(?<operation>\w+)\s+(?<target>\w+)\s*(?<operator>[<>=]|(?:>=|<=))\s*"?(?<value>[^"]*)"?)?\s*$/;

export function query(table: Table, input: string) {
  if (!grammar.test(input)) {
    throw new Error('Not a valid query');
  }

  const { groups } = input.match(grammar) as RegExpMatchArray;
  const { command, targets, operation, target, operator, value } =
    groups as GrammarGroups;

  const result: Record<Column, DataType[]> = {};

  if (command !== 'PROJECT') {
    throw new Error('Not a valid query');
  }

  const columns = targets
    .trim()
    .split(',')
    .map((col) => col.trim());

  assert(columns.length > 0, 'No columns provided');
  assert(
    columns.every((col) => table.columns.has(col.trim())),
    'Column not found'
  );

  columns.forEach((col) => {
    result[col] = [];
  });

  const columnList = Array.from(table.columns);

  for (const [, row] of table.rows) {
    if (operation && target && operator && value) {
      const index = columnList.indexOf(target);

      if (index === -1) {
        throw new Error('Column not found');
      }

      const cell = row.get(index);

      if (!cell) {
        throw new Error('Cell not found');
      }

      if (operator === '=') {
        if (cell.toString() === value) {
          columns.forEach((col) => {
            result[col].push(row.get(columnList.indexOf(col)));
          });
        }
      } else if (operator === '>') {
        if (cell > value) {
          columns.forEach((col) => {
            result[col].push(row.get(columnList.indexOf(col)));
          });
        }
      } else if (operator === '<') {
        if (cell < value) {
          columns.forEach((col) => {
            result[col].push(row.get(columnList.indexOf(col)));
          });
        }
      }
    } else {
      columns.forEach((col) => {
        result[col].push(row.get(columnList.indexOf(col)));
      });
    }
  }

  return result;
}
