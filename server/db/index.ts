import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbInstance: any;

export const initDatabase = async () => {
  if (!dbInstance) {
    // Ensure the database directory exists
    const dbDir = process.env.NODE_ENV === 'production'
      ? '/tmp'  // Use /tmp in production (Netlify)
      : path.join(__dirname, '../../data');
      
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    dbInstance = await open({
      filename: path.join(dbDir, 'database.sqlite'),
      driver: sqlite3.Database
    });

    // Enable foreign keys
    await dbInstance.run('PRAGMA foreign_keys = ON');

    // Create tables if they don't exist
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await dbInstance.exec(schema);
  }
  return dbInstance;
};

// Initialize database
initDatabase().catch(console.error);

// Export the database instance
export const getDb = () => {
  if (!dbInstance) {
    throw new Error('Database not initialized');
  }
  return dbInstance;
};

export const db = getDb();

// Handle process termination
process.on('SIGTERM', async () => {
  if (dbInstance) {
    await dbInstance.close();
  }
  process.exit(0);
});