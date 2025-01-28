import { addColumn, addRow, createTable } from './table';

test('create an empty table', () => {
  const table = createTable();

  expect(table.rows).toBeInstanceOf(Map);
  expect(table.columns).toBeInstanceOf(Set);
});

test('add a column to a table', () => {
  const table = createTable();
  const result = addColumn(table, 'name');

  expect(result.columns).toEqual(new Set(['name']));
  expect(result.rows).toEqual(new Map());
});

test('add a row to a table', () => {
  const table = createTable();
  addColumn(table, 'name');
  const result = addRow(table, ['Alice']);

  expect(result.rows).toEqual(new Map([[0, new Map([[0, 'Alice']])]]));
});
