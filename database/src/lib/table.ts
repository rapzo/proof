export type DataType = number | string;

export type Cell = DataType;

export type Row = Cell[];

export type Column = string;

export type Table = {
  columns: Set<Column>;
  rows: Row[];
};

export function createTable(): Table {
  return {
    columns: new Set(),
    rows: [],
  };
}

export function addColumn(table: Table, name: string): Table {
  table.columns.add(name);

  return table;
}

export function addRow(table: Table, input: DataType[]): Table {
  if (input.length !== table.columns.size) {
    throw new Error('Column count mismatch');
  }

  table.rows.push(input);

  return table;
}
