const { initializeDatabase } = require('../config/Database');

const createCategory = async (name, type, userId, icon) => {
    const pool = await initializeDatabase();
    try {
      const [result] = await pool.execute('INSERT INTO categories (name, type, user_id, icon) VALUES (?, ?, ?, ?)', [name, type, userId, icon]);
      return result;
  } catch (error) {
      console.error('Error creating category:', error);
       throw error;
   }
};
  const getCategories = async (userId) => {
        const pool = await initializeDatabase();
       try {
            const [rows] = await pool.execute('SELECT * FROM categories WHERE user_id IS NULL OR user_id = ?', [userId]);
           return rows;
      } catch (error) {
          console.error('Error getting categories:', error);
          throw error;
       }
  };

  const deleteCategory = async (categoryId, userId) => {
     const pool = await initializeDatabase();
      try {
           const [rows] = await pool.execute('DELETE FROM categories WHERE id = ? AND user_id = ?', [categoryId, userId]);
            return rows;
      } catch (error) {
        console.error("Error deleting category", error);
          throw error;
     }
 };
   const updateCategory = async (categoryId, name, type, userId, icon) => {
     const pool = await initializeDatabase();
    try {
        const [rows] = await pool.execute('UPDATE categories SET name = ?, type = ?, icon = ? WHERE id = ? AND user_id = ?', [name, type, icon, categoryId, userId]);
       return rows;
    } catch (error) {
       console.error("Error updating category", error);
         throw error;
      }
 };

module.exports = { createCategory, getCategories, deleteCategory, updateCategory };