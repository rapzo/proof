"use strict";

// client/src/main.ts
var import_node_net = require("node:net");
var import_promises = require("node:readline/promises");
var [, , arg] = process.argv;
var rl = (0, import_promises.createInterface)({
  input: process.stdin,
  output: process.stdout,
  prompt: "> "
});
var port = isNaN(Number(arg)) ? 3e3 : Number(arg);
var client = (0, import_node_net.createConnection)({ port }, async () => {
  rl.prompt();
  rl.on("line", async (line) => {
    client.write(line.trim());
  });
});
client.on("data", (data) => {
  console.log(data.toString());
  rl.prompt();
});
client.on("end", () => {
  console.log("disconnected from server");
  process.exit(0);
});
client.on("error", (_error) => {
  console.log(`no server found at port ${port}`);
  process.exit(1);
});
