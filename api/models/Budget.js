const { initializeDatabase } = require('../config/Database');

const createBudget = async (amount, type, category_id, start_date, end_date, user_id) => {
    const pool = await initializeDatabase();
    try {
    const type = category_id ? 'category' : 'total';
        const [result] = await pool.execute(
            'INSERT INTO budgets (amount, type, category_id, start_date, end_date, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [amount, type, category_id, start_date, end_date, user_id]
        );
        return result; // Return the result of the query, including insertId
    } catch (error) {
        console.error('Error creating budget:', error);
        throw error; // Re-throw the error to be handled by the calling function
    }
};


const getBudgets = async (userId) => {
    const pool = await initializeDatabase();
    try {
        const [rows] = await pool.execute(
        `SELECT b.id, b.amount, b.type, b.start_date, b.end_date, b.user_id, b.created_at, b.updated_at,
         c.name AS category_name, c.type AS category_type, c.icon AS category_icon  -- Select category info
         FROM budgets b
         LEFT JOIN categories c ON b.category_id = c.id  -- Left join to include budgets without categories
         WHERE b.user_id = ?`
        , [userId]);
        return rows;
    } catch (error) {
        console.error('Error getting budgets:', error);
        throw error;
    }
};

const getBudgetById = async (budgetId) => {
    const pool = await initializeDatabase();
    try {
        const [rows] = await pool.execute(`SELECT
        b.id, b.amount, b.type, b.start_date, b.end_date, b.user_id, b.created_at, b.updated_at,
        c.name AS category_name, c.type AS category_type, c.icon AS category_icon
        FROM budgets b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.id = ?`, [budgetId]);
        return rows.length > 0 ? rows[0] : null; // Return null if no budget is found
    } catch (error) {
        console.error('Error getting budget by ID:', error);
        throw error;
    }
};


const updateBudget = async (id, amount, type, category_id, start_date, end_date, userId) => {
    const pool = await initializeDatabase();
    try {
    const type = category_id ? 'category' : 'total';
        const [result] = await pool.execute(
            'UPDATE budgets SET amount = ?, type = ?, category_id = ?, start_date = ?, end_date = ? WHERE id = ? AND user_id = ?',
            [amount, type, category_id, start_date, end_date, id, userId]
        );
        return result; // Return the result of the query (affectedRows)
    } catch (error) {
        console.error("Error updating budget:", error);
        throw error;
    }
};


const deleteBudget = async (budgetId, userId) => {
    const pool = await initializeDatabase();
    try {
        const [result] = await pool.execute('DELETE FROM budgets WHERE id = ? AND user_id = ?', [budgetId, userId]);
        return result; // Return the result of the query
    } catch (error) {
        console.error("Error deleting budget", error);
        throw error;
    }
};

const checkBudgetConsumption = async (budgetId) => {
    const pool = await initializeDatabase();
    try {
        const [budgetRows] = await pool.execute('SELECT * FROM budgets WHERE id = ?', [budgetId]);
        if (budgetRows.length === 0) {
            return { message: 'Budget not found.', budget: null, remainingAmount: null }; // Return explicit not found message
        }

        const budget = budgetRows[0];
        const { amount, type, category_id, start_date, end_date, user_id } = budget;

        let query = `SELECT SUM(amount) AS total_expenses FROM transactions WHERE user_id = ? AND type = 'expense' AND transaction_date BETWEEN ? AND ?`;
        let values = [user_id, start_date, end_date];

        if (type === 'category' && category_id) {
            query += ' AND category_id = ?';
            values.push(category_id);
        }

        const [expenseRows] = await pool.execute(query, values);
        const totalExpenses = parseFloat(expenseRows[0].total_expenses || 0); // Parse to float and handle null

        const remainingAmount = parseFloat(amount) - totalExpenses;

        return {
            message: remainingAmount < 0 ? "Ngân sách của bạn đã hết" : null,  // Return message only if over budget
            remainingAmount,
            budget,
        };

    } catch (error) {
        console.error('Error checking budget consumption:', error);
        throw error;
    }
};


module.exports = {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
    checkBudgetConsumption,
};