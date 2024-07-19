import pg from "pg";
const { Client } = pg;
// const insertQuery = `
//       INSERT INTO logs (cpu, gpu, disk, ram, temperature)
//       VALUES ($1, $2, $3, $4, $5);
// `;

export const client = new Client({
  connectionString: "postgresql://postgres:postgres@localhost:5432/logs-db",
});

await client.connect();

const query = `
SELECT * FROM logs
LIMIT $1 OFFSET $2;`;

export async function* getData(size, page) {
  console.log("size", size, "page", page);
  const offset = page * size;
  const res = await client.query(query, [size, offset]);
  const data = res.rows;
  if (!data.length) return;

  yield data;

  yield* getData(size, page + 1);
}
