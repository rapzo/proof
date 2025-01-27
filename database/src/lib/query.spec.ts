import { query } from './query';
import { addColumn, addRow, createTable } from './table';

let table = createTable();

beforeEach(() => {
  addColumn(table, 'name');
  addRow(table, ['Alice']);
});

afterEach(() => {
  table = createTable();
});

test('query must start with PROJECT', () => {
  expect(() => query(table, 'hi')).toThrow(/Not a valid query/);
});

test('query should return the correct result', () => {
  const result = query(table, 'PROJECT name');

  expect(result).toEqual({ name: ['Alice'] });
});
