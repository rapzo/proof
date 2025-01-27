# Proof

## Objective

### 1. Data Loading:

You need to process CSV into memory, with values of integers, or string type.
A column is of type number if all the cells contents are strings
composed by unicode characters representing digits 09. You can use
a library or implement CSV parsing yourself.

### 2. Query Language and Execution:

Build a function that processes queries on the loaded data.
Support queries combining projections of columns and equality (=) and
partial ordering filtering (>) by a single column (any column, number or
string)

Example: `PROJECT col1, col2 FILTER col3 > "value"`

### 3. Output:

Implement a function to print query results to the console.

### 4. Deliverable:

1. What were some of the tradeoffs you made when building this and why were these acceptable tradeoffs?

2. Given more time, what improvements or optimizations would you want to add? When would you add them?

3. What changes are needed to accommodate changes to support other data types, multiple filters, or ordering of results?

4. What changes are needed to process extremely large datasets

5. What do you still need to do to make this code production ready?

## Project structure

The project was scaffolding using [Nx](https://nx.dev) to speed up combining
industry-grade presets for: [TypeScript](), [ESLint](), [Prettier](), and
[Jest]() via [Ts-Jest]().
Nx organizes the project with a monorepo architecture and a DDD-like approach
to split responsabilities into domains.

In the `proof` project all sources should be located under the `packages`
folder with the following responsabilities:

| path       | description |
| ---------- | ----------- |
| `server`   |             |
| `client`   |             |
| `database` |             |

## Commands

```
npm run <command>
```

| command   | description |
| --------- | ----------- |
| `server`  |             |
| `client`  |             |
| `build`   |             |
| `test`    |             |
| `release` |             |
