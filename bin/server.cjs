"use strict";

// server/src/main.ts
var import_node_net = require("node:net");

// database/src/lib/ingest.ts
var import_csv = require("csv");

// database/src/lib/table.ts
function createTable() {
  return {
    columns: /* @__PURE__ */ new Set(),
    rows: /* @__PURE__ */ new Map()
  };
}
function addColumn(table, name) {
  table.columns.add(name);
  return table;
}
function addRow(table, input) {
  const row = /* @__PURE__ */ new Map();
  input.forEach((cell, index) => {
    row.set(index, cell);
  });
  table.rows.set(table.rows.size, row);
  return table;
}

// database/src/lib/ingest.ts
async function ingest(stream) {
  const table = createTable();
  const data = stream.pipe((0, import_csv.parse)());
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
var import_node_console = require("node:console");
var grammar = /^(?:(?<command>\w+)\s+(?<targets>[\w\s,]+))(?:\s+(?<operation>\w+)\s+(?<target>\w+)\s*(?<operator>[<>=]|(?:>=|<=))\s*"?(?<value>[^"]*)"?)?\s*$/;
function query(table, input) {
  if (!grammar.test(input)) {
    throw new Error("Not a valid query");
  }
  const { groups } = input.match(grammar);
  const { command, targets, operation, target, operator, value } = groups;
  const result = {};
  if (command !== "PROJECT") {
    throw new Error("Not a valid query");
  }
  const columns = targets.trim().split(",").map((col) => col.trim());
  (0, import_node_console.assert)(columns.length > 0, "No columns provided");
  (0, import_node_console.assert)(
    columns.every((col) => table.columns.has(col.trim())),
    "Column not found"
  );
  columns.forEach((col) => {
    result[col] = [];
  });
  const columnList = Array.from(table.columns);
  const op = comparator(operator?.trim());
  for (const [, row] of table.rows) {
    if (operation && target && operator && value) {
      const column = target.trim();
      const cell = row.get(columnList.indexOf(column));
      if (!cell) {
        throw new Error("Cell not found");
      }
      if (op(cell, value)) {
        columns.forEach((col) => {
          result[col].push(row.get(columnList.indexOf(col)));
        });
      }
    } else {
      columns.forEach((col) => {
        result[col].push(row.get(columnList.indexOf(col)));
      });
    }
  }
  return result;
}
function comparator(operator) {
  switch (operator) {
    case "=":
      return (cell, value) => typeof cell === "string" ? cell.localeCompare(value) === 0 : cell === Number(value);
    case ">":
      return (cell, value) => typeof cell === "string" ? cell.localeCompare(value) > 0 : typeof cell === "number" ? cell > Number(value) : false;
    case "<":
      return (cell, value) => typeof cell === "string" ? cell.localeCompare(value) < 0 : typeof cell === "number" ? cell < Number(value) : false;
    default:
      return () => true;
  }
}

// server/src/main.ts
var import_node_fs = require("node:fs");
var port = !isNaN(Number(process.env.PORT)) ? Number(process.env.PORT) : 3e3;
var [, , file] = process.argv;
async function main() {
  const table = await ingest(!file ? process.stdin : (0, import_node_fs.createReadStream)(file));
  const server = (0, import_node_net.createServer)((socket) => {
    socket.on("data", async (data) => {
      const command = data.toString().trim();
      console.log("Received:", command);
      console.time("query");
      try {
        const queryResult = await query(table, command);
        console.timeEnd("query");
        socket.write(JSON.stringify(queryResult));
      } catch (error) {
        console.timeEnd("query");
        if (error instanceof Error) {
          console.error(error.message);
        }
        server.close();
      }
    });
  });
  server.on("connection", (client) => {
    console.log("Connected:", client.remoteAddress);
  }).listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
main().catch(console.error);
