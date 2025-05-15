const express = require('express');
const { createBudget, getBudgets, deleteBudget, updateBudget } = require('../models/Budget');
const { AuthMiddleware } = require("../utils/AuthMiddleware");
const Joi = require('joi');
const router = express.Router();

const createBudgetSchema = Joi.object({
        amount: Joi.number().required(),
        start_date: Joi.date().required(),
         end_date: Joi.date().required(),
   type: Joi.string().valid('total', 'category').required(),
        category_id: Joi.number().allow(null),

     })
router.use(AuthMiddleware)

// Create Budget
router.post('/', async (req, res) => {
    const { error } = createBudgetSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
     try {
            const userId = req.user.id;
            const { amount, type, category_id, start_date, end_date } = req.body;
            const result = await createBudget(amount, type, category_id, start_date, end_date, userId);
            res.status(201).json({ message: 'Budget created successfully', budget: { id: result.insertId, ...req.body } });
        } catch (error) {
            console.error('Error creating budget:', error);
            res.status(500).json({ error: 'Failed to create budget' });
        }
    });

// Get User's Budgets
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const budgets = await getBudgets(userId);
        res.json({ budgets });
    } catch (error) {
        console.error('Error getting budgets:', error);
        res.status(500).json({ error: 'Failed to get budgets' });
    }
});

// Get Budget by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const budget = await getBudgetById(id);
        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' });
        }
        res.json({ budget });
    } catch (error) {
        console.error('Error getting budget:', error);
        res.status(500).json({ error: 'Failed to get budget' });
    }
});

// Update Budget
router.put('/:id', async (req, res) => {
    const { error } = budgetSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { amount, type, category_id, start_date, end_date } = req.body;
        const result = await updateBudget(id, amount, type, category_id, start_date, end_date, userId);
        if (result.affectedRows === 0) { // Check if any rows were affected
           return res.status(404).json({ error: 'Budget not found or not authorized to update' });
        }
        res.json({ message: 'Budget updated successfully', budget: { id: parseInt(id), ...req.body } });
    } catch (error) {
        console.error('Error updating budget:', error);
        res.status(500).json({ error: 'Failed to update budget' });
    }
});

// Delete Budget
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const result = await deleteBudget(id, userId);
        if (result.affectedRows === 0) { // Check if any rows were affected
            return res.status(404).json({ error: 'Budget not found or not authorized to delete' });
        }
        res.json({ message: 'Budget deleted successfully' });
    } catch (error) {
        console.error('Error deleting budget:', error);
        res.status(500).json({ error: 'Failed to delete budget' });
    }
});


// Check Budget Consumption
router.get('/:id/check', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await checkBudgetConsumption(id); // Pass the budget ID
        res.json(result); // Return the result directly
    } catch (error) {
        console.error('Error checking budget consumption:', error);
        res.status(500).json({ error: 'Failed to check budget consumption' });
    }
});


module.exports = router;