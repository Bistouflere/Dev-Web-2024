import { Pool, QueryConfig } from "pg";

const pool = new Pool();

export const query = async (text: string | QueryConfig<any>, values?: any) => {
  // const start = Date.now();
  // const res = await pool.query(text, values);
  // const duration = Date.now() - start;
  // console.log("executed query", { text, duration, rows: res.rowCount });
  // return res;
  return await pool.query(text, values);
};
