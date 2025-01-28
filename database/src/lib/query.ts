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
  const op = comparator(operator?.trim());

  for (const [, row] of table.rows) {
    if (operation && target && operator && value) {
      const column = target.trim();
      const cell = row.get(columnList.indexOf(column));

      if (!cell) {
        throw new Error('Cell not found');
      }

      if (op(cell, value)) {
        columns.forEach((col) => {
          result[col].push(row.get(columnList.indexOf(col)));
        });
      }
    } else {
      columns.forEach((col) => {
        result[col].push(row.get(columnList.indexOf(col)));
      });
    }
  }

  return result;
}

function comparator(operator?: string) {
  switch (operator) {
    case '=':
      return (cell: DataType, value: string) =>
        typeof cell === 'string'
          ? cell.localeCompare(value) === 0
          : cell === Number(value);
    case '>':
      return (cell: DataType, value: string) =>
        typeof cell === 'string'
          ? cell.localeCompare(value) > 0
          : typeof cell === 'number'
          ? cell > Number(value)
          : false;
    case '<':
      return (cell: DataType, value: string) =>
        typeof cell === 'string'
          ? cell.localeCompare(value) < 0
          : typeof cell === 'number'
          ? cell < Number(value)
          : false;
    default:
      return () => true;
  }
}
