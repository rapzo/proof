import { query } from './query';
import { addColumn, addRow, createTable } from './table';

let table = createTable();

beforeEach(() => {
  addColumn(table, 'name');
  addColumn(table, 'age');
  addRow(table, ['Alice', 42]);
  addRow(table, ['Bob', 41]);
  addRow(table, ['Charlie', 40]);
});

afterEach(() => {
  table = createTable();
});

test('query must start with PROJECT', () => {
  expect(() => query(table, 'hi')).toThrow(/Not a valid query/);
});

test('query should return the correct result', () => {
  const result = query(table, 'PROJECT name');

  expect(result).toEqual({ name: ['Alice', 'Bob', 'Charlie'] });
});

test('query should return the correct result with multiple columns', () => {
  addColumn(table, 'age');

  const result = query(table, 'PROJECT name, age');

  expect(result).toEqual({
    name: ['Alice', 'Bob', 'Charlie'],
    age: [42, 41, 40],
  });
});

test('query should execute the example query', () => {
  const result = query(table, 'PROJECT name FILTER age > 40');

  expect(result).toEqual({ name: ['Alice', 'Bob'] });
});

test('query should execute the example query with multiple columns', () => {
  const result = query(table, 'PROJECT name, age FILTER age = 40');

  expect(result).toEqual({ name: ['Charlie'], age: [40] });
});

test('query should execute the example query with no results', () => {
  const result = query(table, 'PROJECT name, age FILTER age < 40');

  expect(result).toEqual({ name: [], age: [] });
});
