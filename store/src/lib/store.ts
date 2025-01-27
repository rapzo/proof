export type ColumnType = number | string;

export type Column<T extends ColumnType> = {
  name: string;
  type: T;
  rows: T[];
};

export type Table = {
  columns: Column<ColumnType>[];
};

export function createTable(): Table {
  return {
    columns: [],
  };
}

export function addColumn<T extends ColumnType>(
  table: Table,
  name: string,
  type: T
): void {
  table.columns.push({ name, type, rows: [] });
}

export function addRow(table: Table, row: ColumnType[]): void {
  table.columns.forEach((column, i) => {
    column.rows.push(row[i]);
  });
}

export function store(record: unknown[]): string {
  return 'store';
}
