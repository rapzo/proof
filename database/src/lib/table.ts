export type DataType = number | string | undefined;

export type Cell = DataType;

export type Row = Map<number, Cell>;

export type Column = string;

export type Table = {
  columns: Set<Column>;
  rows: Map<number, Row>;
};

export function createTable(): Table {
  return {
    columns: new Set(),
    rows: new Map(),
  };
}

export function addColumn(table: Table, name: string): Table {
  table.columns.add(name);

  return table;
}

export function addRow(table: Table, input: DataType[]): Table {
  const row = new Map<number, Cell>();

  input.forEach((cell, index) => {
    row.set(index, cell);
  });

  table.rows.set(table.rows.size, row);

  return table;
}

export function getRow(table: Table, index: number): Row | void {
  return table.rows.get(index);
}

export function getRows(table: Table): Row[] {
  return Array.from(table.rows.values());
}

export function getColumn(table: Table, name: string): Cell[] {
  const index = Array.from(table.columns).indexOf(name);

  return Array.from(table.rows.values()).map((row) => row.get(index));
}

export function getCell(
  table: Table,
  rowIndex: number,
  columnName: string
): Cell {
  const index = Array.from(table.columns).indexOf(columnName);

  return table.rows.get(rowIndex)?.get(index);
}
