import fs from 'fs';
import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker';

const Columns = {
  ID: 'id',
  NAME: 'name',
  AGE: 'age',
  JOB: 'job',
};

const columns = [Columns.ID, Columns.NAME, Columns.AGE, Columns.JOB];
const rows = [];

for (let i = 0; i < 50; i++) {
  const row = {
    id: randomUUID(),
    name: faker.person.firstName(),
    age: Math.floor(Math.random() * (65 - 18 + 1)) + 18,
    job: faker.person.jobTitle(),
  };
  rows.push(row);
}

const csvContent = [
  columns.join(','),
  ...rows.map((row) => columns.map((col) => row[col]).join(',')),
].join('\n');

fs.writeFileSync('example.csv', csvContent);
