import pg from "pg";

export class Database {
  constructor() {
    const { Client } = pg;
    this.client = new Client({
      connectionString: "postgresql://postgres:postgres@localhost:5432/logs-db",
    });
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.end();
  }

  getData = async function* (size, page) {
    const query = `
    SELECT * FROM logs
    LIMIT $1 OFFSET $2;`;

    console.log("size", size, "page", page);
    const offset = page * size;
    const res = await this.client.query(query, [size, offset]);
    const data = res.rows;
    if (!data.length) return;

    yield data;

    yield* this.getData(size, page + 1);
  };

  async getTotalItems() {
    const items = await this.client.query("SELECT COUNT(*) FROM logs;");
    return items.rows[0].count;
  }
}
