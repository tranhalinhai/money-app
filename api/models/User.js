const { initializeDatabase } = require('../config/Database');

const createUser = async (email, password, full_name) => {
   const pool = await initializeDatabase();
      try {
        const [result] = await pool.execute('INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)', [email, password, full_name]);
        return result;
      } catch (error) {
         console.error('Error creating user:', error);
          if(error.code === 'ER_DUP_ENTRY'){
              throw new Error("Email already exists");
          }
        throw error;
      }
};

const getUserByEmail = async (email) => {
    const pool = await initializeDatabase();
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  } catch (error) {
      console.error("Error retrieving user by email:", error);
    throw error;
  }
};
const getUserById = async (userId) => {  // New function
    const pool = await initializeDatabase();
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error retrieving user by ID:", error);
        throw error;
    }
};

module.exports = { createUser, getUserByEmail, getUserById };