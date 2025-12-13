import { query, getClient } from '../db';
import { Sweet } from '../models/sweet';

export const createSweet = async (data: Omit<Sweet, 'id'>) => {
  const inserted = await query<Sweet>(
    'INSERT INTO sweets (name, category, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
    [data.name, data.category, data.price, data.quantity]
  );
  return inserted[0];
};

export const listSweets = async () => {
  return query<Sweet>('SELECT * FROM sweets ORDER BY id ASC');
};

export const searchSweets = async (q: string) => {
  return query<Sweet>('SELECT * FROM sweets WHERE LOWER(name) LIKE $1 OR LOWER(category) LIKE $1', [`%${q.toLowerCase()}%`]);
};

export const updateSweet = async (id: number, data: Partial<Sweet>) => {
  const fields = [] as string[];
  const values = [] as any[];
  let idx = 1;
  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key}=$${idx++}`);
    values.push(value);
  }
  values.push(id);
  const sql = `UPDATE sweets SET ${fields.join(', ')} WHERE id=$${idx} RETURNING *`;
  const updated = await query<Sweet>(sql, values);
  return updated[0];
};

export const deleteSweet = async (id: number) => {
  await query('DELETE FROM sweets WHERE id=$1', [id]);
};

export const purchaseSweet = async (id: number, quantity: number) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const res = await client.query<Sweet>('SELECT * FROM sweets WHERE id=$1 FOR UPDATE', [id]);
    const sweet = res.rows[0];
    if (!sweet) throw new Error('Not found');
    if (sweet.quantity < quantity) throw new Error('Out of stock');
    const newQty = sweet.quantity - quantity;
    const updated = await client.query<Sweet>('UPDATE sweets SET quantity=$1 WHERE id=$2 RETURNING *', [newQty, id]);
    await client.query('COMMIT');
    return updated.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const restockSweet = async (id: number, quantity: number) => {
  const updated = await query<Sweet>('UPDATE sweets SET quantity = quantity + $1 WHERE id=$2 RETURNING *', [quantity, id]);
  if (!updated[0]) throw new Error('Not found');
  return updated[0];
};
