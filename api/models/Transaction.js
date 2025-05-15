const { initializeDatabase } = require('../config/Database');

const createTransaction = async (amount, date, note, category_id, user_id, image_url) => {
    const pool = await initializeDatabase();
      try {
      let imageUrl = image_url;
                  if(!imageUrl){
                      imageUrl = ""; // hoặc set một url default
                   }
        const [result] = await pool.execute('INSERT INTO transactions (amount, date, note, category_id, user_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
          [amount, date, note, category_id, user_id, imageUrl]
      );
         return result;
  } catch (error) {
    console.error('Error creating transaction:', error);
      throw error;
   }
};
const getTransactions = async (userId) => {
    const pool = await initializeDatabase();
    try {
         const [rows] = await pool.execute(`
        SELECT
          transactions.id,
          transactions.amount,
          transactions.date,
          transactions.note,
          transactions.category_id,
           transactions.user_id,
          transactions.created_at,
          transactions.updated_at,
          transactions.image_url,
          categories.name,
          categories.type,
          categories.icon
       FROM transactions
       JOIN categories ON transactions.category_id = categories.id
       WHERE transactions.user_id = ? ORDER BY transactions.date DESC; `, [userId]);
           return rows;
     } catch (error) {
         console.error("Error getting transactions:", error);
        throw error;
     }
};
const getDetailTransaction = async (transactionId, userId) => {
    const pool = await initializeDatabase();

    try {
         const [rows] = await pool.execute(`
        SELECT
          transactions.id,
          transactions.amount,
          transactions.date,
          transactions.note,
          transactions.category_id,
           transactions.user_id,
          transactions.created_at,
          transactions.updated_at,
          transactions.image_url,
          categories.name,
          categories.type,
          categories.icon
       FROM transactions
       JOIN categories ON transactions.category_id = categories.id
       WHERE transactions.id = ? AND transactions.user_id = ?`, [transactionId, userId]);
           return rows;
     } catch (error) {
         console.error("Error getting transactions:", error);
        throw error;
     }
};

  const deleteTransaction = async (transactionId, userId) => {
      const pool = await initializeDatabase();
        try {
             const [rows] = await pool.execute('DELETE FROM transactions WHERE id = ? AND user_id = ?', [transactionId, userId]);
             return rows;
        } catch (error) {
            console.error("Error deleting transaction", error);
             throw error;
         }
  };
const updateTransaction = async (transactionId, userId, updatedData) => {
    const pool = await initializeDatabase();
    try {
        let query = 'UPDATE transactions SET ';
        const values = [];
        const fieldsToUpdate = [];

        // Danh sách các trường hợp lệ
        const allowedFields = ["amount", "note", "date", "category_id", "image_url"];

        for (const field in updatedData) {
            if (updatedData.hasOwnProperty(field) && allowedFields.includes(field)) {
                fieldsToUpdate.push(`${field} = ?`);
                values.push(updatedData[field]);
            }
        }

        if (fieldsToUpdate.length === 0) {
            throw new Error("No valid fields to update.");
        }

        query += fieldsToUpdate.join(', ');
        query += ' WHERE id = ? AND user_id = ?';
        values.push(transactionId, userId);

        console.log("Final query:", query, "Values:", values);

        const [rows] = await pool.execute(query, values);

        return rows;

    } catch (error) {
        console.error("Error updating transaction", error);
        throw error;
    }
};

module.exports = { createTransaction, getTransactions, getDetailTransaction,deleteTransaction, updateTransaction };