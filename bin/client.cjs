"use strict";

// client/src/main.ts
var import_node_net = require("node:net");
var import_promises = require("node:readline/promises");
var port = !isNaN(Number(process.env.PORT)) ? Number(process.env.PORT) : 3e3;
var [, , arg] = process.argv;
async function main() {
  const command = arg.trim();
  const client = command.length ? createClient(command) : createInteractiveClient(port);
  client.on("error", () => {
    console.log(`no server found at port ${port}`);
    process.exit(1);
  });
}
var createInteractiveClient = (port2) => {
  const rl = (0, import_promises.createInterface)({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
  });
  const client = (0, import_node_net.createConnection)({ port: port2 }, () => {
    rl.on("line", (line) => {
      client.write(line.trim());
    });
  }).on("data", (data) => {
    try {
      console.log(JSON.stringify(JSON.parse(data.toString()), null, 2));
    } catch {
      console.log(data.toString());
    } finally {
      rl.prompt();
    }
  }).on("connect", () => {
    console.log("connected to server");
    rl.prompt();
  }).on("end", () => {
    console.log("disconnected from server");
    process.exit(0);
  });
  return client;
};
var createClient = (command) => {
  const client = (0, import_node_net.createConnection)({ port }, () => {
    client.write(command);
  }).on("data", (data) => {
    try {
      console.log(JSON.stringify(JSON.parse(data.toString()), null, 2));
    } catch {
      console.log(data.toString());
    } finally {
      client.end();
    }
  });
  return client;
};
main().catch(console.error);
