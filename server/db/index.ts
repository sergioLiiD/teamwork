import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: any;

export const initDatabase = async () => {
  if (!db) {
    // Ensure the database directory exists
    const dbDir = process.env.NODE_ENV === 'production'
      ? '/tmp'  // Use /tmp in production (Netlify)
      : path.join(__dirname, '../../data');
      
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = await open({
      filename: path.join(dbDir, 'database.sqlite'),
      driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.run('PRAGMA foreign_keys = ON');

    // Create tables if they don't exist
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await db.exec(schema);
  }
  return db;
};

// Initialize database
initDatabase().catch(console.error);

// Export the database instance
export const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

export const db = getDb();

// Handle process termination
process.on('SIGTERM', async () => {
  if (db) {
    await db.close();
  }
  process.exit(0);
});