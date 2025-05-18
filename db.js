import pkg from 'pg';
const { Pool } = pkg;
import databaseConfig from './configs/database-config';  // assuming your config file is named databaseConfig.js

// Create a new pool instance using the configuration
const pool = new Pool(databaseConfig.poolConfig);

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client:', err.stack);
        return;
    }
    console.log('Successfully connected to PostgreSQL');
    // Set the search path to your schema
    client.query(`SET search_path TO ${databaseConfig.schemaName}`, (err) => {
        if (err) {
            console.error('Error setting search path:', err.stack);
        }
        release();
    });
});

// Helper function to execute database queries
const query = async (text, params) => {
    try {
        const result = await pool.query(text, params);
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

export { pool, query };