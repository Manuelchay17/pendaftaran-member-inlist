import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  try {
    console.log('Checking columns in registrations table...');
    
    // Check if approved_by exists
    const [cols] = await pool.execute(`SHOW COLUMNS FROM registrations LIKE 'approved_by'`);
    if (cols.length === 0) {
      console.log('Adding approved_by column...');
      await pool.execute(`ALTER TABLE registrations ADD COLUMN approved_by VARCHAR(255) NULL`);
      console.log('Added approved_by column successfully.');
    } else {
      console.log('approved_by column already exists.');
    }

    // Check if reject_reason exists
    const [colsReason] = await pool.execute(`SHOW COLUMNS FROM registrations LIKE 'reject_reason'`);
    if (colsReason.length === 0) {
      console.log('Adding reject_reason column...');
      await pool.execute(`ALTER TABLE registrations ADD COLUMN reject_reason TEXT NULL`);
      console.log('Added reject_reason column successfully.');
    } else {
      console.log('reject_reason column already exists.');
    }

  } catch (error) {
    console.error('Error altering table:', error);
  } finally {
    await pool.end();
  }
}

main();
