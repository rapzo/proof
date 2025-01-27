import { addColumn, addRow, createTable } from './table';

test('create an empty table', () => {
  const table = createTable();

  expect(table.rows).toBeInstanceOf(Array);
  expect(table.columns).toBeInstanceOf(Set);
});

test('add a column to a table', () => {
  const table = createTable();
  const result = addColumn(table, 'name');

  expect(result.columns).toEqual(new Set(['name']));
  expect(result.rows).toEqual([]);
});

test('add a row to a table', () => {
  const table = createTable();
  addColumn(table, 'name');
  const result = addRow(table, ['Alice']);

  expect(result.rows).toEqual([['Alice']]);
});
