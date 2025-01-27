"use strict";

// server/src/main.ts
var import_node_net = require("node:net");

// database/src/lib/store.ts
function createTable() {
  return {
    columns: []
  };
}
function addRow(table, row) {
  table.columns.forEach((column, i) => {
    column.rows.push(row[i]);
  });
}

// database/src/lib/ingest.ts
var import_csv = require("csv");
async function ingest(stream) {
  const table = createTable();
  for await (const record of stream.pipe((0, import_csv.parse)())) {
    addRow(table, record);
  }
  return table;
}

// database/src/lib/generate.ts
var import_csv2 = require("csv");

// database/src/lib/query.ts
function query(table, input) {
  return "query";
}

// server/src/main.ts
var import_node_fs = require("node:fs");
var [, , file] = process.argv;
async function main() {
  const table = await ingest(file ? (0, import_node_fs.createReadStream)(file) : process.stdin);
  const server = (0, import_node_net.createServer)((socket) => {
    socket.on("data", async (data) => {
      try {
        const queryResult = await query(table, data.toString());
        socket.write(queryResult);
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
