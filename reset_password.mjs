import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function reset() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'perpus_web'
  });

  try {
    const password = 'Dispuspa@2026';
    const hashed = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute('UPDATE admin_users SET password = ? WHERE email = ?', [hashed, 'admin@pendaftaran-perpus-batang.my.id']);
    
    if (result.affectedRows === 0) {
       console.log('Akun admin belum ada. Menjalankan seeding akun baru...');
       await pool.execute(
         'INSERT INTO admin_users (email, password, role) VALUES (?, ?, ?)',
         ['admin@pendaftaran-perpus-batang.my.id', hashed, 'superadmin']
       );
    }
    
    console.log('Password berhasil di-reset ke: ' + password);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}
reset();
