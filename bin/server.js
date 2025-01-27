"use strict";

// server/src/main.ts
var import_node_net = require("node:net");

// database/src/lib/generate.ts
var import_csv = require("csv");

// database/src/lib/ingest.ts
var import_csv2 = require("csv");

// database/src/lib/table.ts
function createTable() {
  return {
    columns: /* @__PURE__ */ new Set(),
    rows: []
  };
}
function addColumn(table, name) {
  table.columns.add(name);
  return table;
}
function addRow(table, input) {
  if (input.length !== table.columns.size) {
    throw new Error("Column count mismatch");
  }
  table.rows.push(input);
  return table;
}

// database/src/lib/ingest.ts
async function ingest(stream) {
  const table = createTable();
  const data = stream.pipe((0, import_csv2.parse)());
  let hasHeader = false;
  for await (const record of data) {
    if (!hasHeader && Array.isArray(record)) {
      record.forEach((name) => addColumn(table, name));
      hasHeader = true;
    } else {
      addRow(table, record);
    }
  }
  return table;
}

// database/src/lib/query.ts
var grammar = /^(PROJECT)\s+([,\w\s*]+)\s*(?:(FILTER)\s+(\w+)\s*(>|=)\s*"([^"]*)")?$/;
function query(table, input) {
  console.log(input);
  if (!grammar.test(input)) {
    throw new Error("Not a valid query");
  }
  const [, , columns, operation, column, value] = input.match(
    grammar
  );
  console.log(columns, operation, column, value);
  const result = {};
  columns.split(",").forEach((col) => {
    const column2 = col.trim();
    const index = Array.from(table.columns).indexOf(column2);
    if (!result[column2]) {
      result[column2] = [];
    }
    result[column2].push(table.rows[index].toString());
  });
  return result;
}

// server/src/main.ts
var import_node_fs = require("node:fs");
var [, , file] = process.argv;
async function main() {
  const table = await ingest(!file ? process.stdin : (0, import_node_fs.createReadStream)(file));
  const server = (0, import_node_net.createServer)((socket) => {
    socket.on("data", async (data) => {
      try {
        const queryResult = await query(table, data.toString());
        socket.write(JSON.stringify(queryResult));
      } catch (error) {
        if (error instanceof Error) {
          socket.write(error.message);
        }
        server.close();
        throw error;
      }
    });
  });
  return server.listen(3e3);
}
main().catch(console.error);
