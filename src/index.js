import { getData } from "./read-db.js";
import { Cluster } from "./cluster.js";
import { client } from "./read-db.js";
import { Database } from "./database.js";

export const db = new Database();
await db.connect();

//const items = await client.query("SELECT COUNT(*) FROM logs;");
const TOTAL_ITEMS = await db.getTotalItems();
console.log("Total items", TOTAL_ITEMS);

const TASK_FILE_PATH = new URL("./processdata.js", import.meta.url).pathname;
const N_CLUSTER = 10;

console.time("Execution Time");
const cluster = new Cluster(TASK_FILE_PATH, N_CLUSTER, TOTAL_ITEMS);
await cluster.initialize();

// console.log("Clustes map size", cluster.clustersMap.size);

for await (const data of db.getData(50000, 0)) {
  cluster.sendToChild(data);
}
