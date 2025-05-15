const mysql = require('mysql2/promise');

    const initializeDatabase = async () => {
        try {
        const pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            });

            console.log('Connected to MySQL Database');
            return pool;
        } catch (error) {
        console.error('Error connecting to MySQL:', error);
        process.exit(1);
        }
};

module.exports = { initializeDatabase };