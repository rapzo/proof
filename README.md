# Proof

## Objectives

## 1. Data Loading:

You need to process CSV into memory, with values of integers, or string type.
A column is of type number if all the cells contents are strings
composed by unicode characters representing digits 09. You can use
a library or implement CSV parsing yourself.

## 2. Query Language and Execution:

Build a function that processes queries on the loaded data.
Support queries combining projections of columns and equality (=) and
partial ordering filtering (>) by a single column (any column, number or
string)

Example: `PROJECT col1, col2 FILTER col3 > "value"`

## 3. Output:

Implement a function to print query results to the console.

## 4. Deliverable:

### 1. What were some of the tradeoffs you made when building this and why were these acceptable tradeoffs?

While picking Nx as the ground tool to manage the repository made sense in order to have all the tooling and
developer experience enhancements, the time it ended up taking due to rabbit-hole-like issues, such as
lack of proper support with the `@nx/node` for `ESM` modules, and some issues with jest not being friendly
in the same manner. In the end, it works and setting everything up would have taken more time, propably.

Using `Map` and `Set` for rows and columns wasn't the best idea. Maybe a simple hashmap would have done it
and dealing with keys such as `${columnName}.${rowIndex}`. The `Set` made sense so there were no duplicatcolumn names, but the `Map` ended up being cumbersome.

Also, the investment in making the whole project as close to a consumable open-source project might have taken more time than anticipated, but it sure helps.

I understood that one of the objectives was to mimic a server<->client architecture and avoid unnecessary csv parsing for each query. That too took its time.

### 2. Given more time, what improvements or optimizations would you want to add? When would you add them?

Look-up mechanism could be improved. Dropping the previously mentioned data structures in favor of a single map with some hoisting of data previously fetched. Sharding from keys also could reduce look-up time as well as algorithm complexity.
Type support for columns is the worst, as it is done only at cell level and every time at runtime.

### 3. What changes are needed to accommodate changes to support other data types, multiple filters, or ordering of results?

It is somewhat prepared for that, so, it should only require additions in `database/src/lib/query.ts` to add both the operation logic (besides `FILTER`), although type-checking wouldn't be that straightforward.

### 4. What changes are needed to process extremely large datasets

Divide and conquer: splitting jobs per column, maybe, so multiple look-up per column could be done simultaneously.
Maybe moving the CPU-heavy logic and memory management to a language like Rust would definitely help, even if in a hybrid `wasm` environment.

### 5. What do you still need to do to make this code production ready?

Maybe add a prettier data print.

## Project structure

The project was scaffolding using [Nx](https://nx.dev) to speed up combining
industry-grade presets for: [TypeScript](), [ESLint](), [Prettier](), and
[Jest]() via [Ts-Jest]().
Nx organizes the project with a monorepo architecture and a DDD-like approach
to split responsabilities into domains.

In the `proof` project all sources should be located under the `packages`
folder with the following responsabilities:

| path       | description                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| `server`   | Launches a server by loading a csv file provided as the last argument or by piping data from `stdin` |
| `client`   | Launches a client that queries the server either interactively or by providing a command as argument |
| `database` | Project with the query language parsing and csv ingestion and traverse                               |

## Commands

Conveniently there are 3 files in the `bin/` directory: `bin/client.cjs`, `bin/server.cjs`, and `bin/generate.mjs`.
The first two are generated from `npm run release` which builds all the projects, while the last one generates an `example.csv` at the process' current working directory.

- `npm run build` builds everything
- `npm run test` tests everything
- `npm run lint` lints everything
- `npm run format` prettifies everything
- `npm run typecheck` typechecks everything
- `npm run server` starts the server in development mode
- `npm run client` starts the client in development mode
- `npm run server -- --args=<filename.csv>` to provide a file in development mode
- `npm run client -- --args="PROJECT ..."` to provide single query execution in development mode

More commands available, per project, from the Nx cli and/or VS Code extension.

## Example runs

In one terminal:

```
node bin/server.js example.csv
```

In another terminal:

```
node bin/client.js "PROJECT name, age FILTER age > 60"
```

or, for an interactive ui:

```
node bin/client.js
```
