import { initDatabase } from './index';

const migrate = async () => {
  try {
    console.log('Initializing database...');
    const db = await initDatabase();
    console.log('Database initialized successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();