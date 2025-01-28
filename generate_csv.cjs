const fs = require('fs');
const { randomUUID } = require('node:crypto');
const { faker } = require('@faker-js/faker');

const columns = ['id', 'name', 'age', 'job'];

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
  columns.join(','), // header row
  ...rows.map((row) => columns.map((col) => row[col]).join(',')),
].join('\n');

fs.writeFileSync('example.csv', csvContent);
