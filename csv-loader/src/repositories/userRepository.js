const { getPool } = require('../db/postgres');

class UserRepository {
  constructor(batchSize = 1000) {
    this.batchSize = batchSize;
  }

  async insertUsers(users) {
    if (!Array.isArray(users) || users.length === 0) return;
    const pool = getPool();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (let i = 0; i < users.length; i += this.batchSize) {
        const batch = users.slice(i, i + this.batchSize);
        const values = [];
        const placeholders = batch.map((user, idx) => {
          values.push(user.name, user.age, JSON.stringify(user.address), JSON.stringify(user.additional_info));
          const base = idx * 4;
          return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
        });
        const sql = `INSERT INTO users (name, age, address, additional_info) VALUES ${placeholders.join(',')}`;
        await client.query(sql, values);
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = UserRepository;
