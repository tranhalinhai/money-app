const express = require('express');
const { createTransaction, getTransactions, getDetailTransaction,deleteTransaction, updateTransaction } = require('../models/Transaction');
const { AuthMiddleware } = require("../utils/AuthMiddleware");
const Joi = require('joi');
const router = express.Router();

const createTransactionSchema = Joi.object({
        amount: Joi.number().required(),
        date: Joi.date().required(),
         note: Joi.string(),
        category_id: Joi.number().required(),
        image_url: Joi.string(),
     })
router.use(AuthMiddleware)
router.post('/create', async (req, res) => {
    const { error } = createTransactionSchema.validate(req.body);
     if (error) {
            return res.status(400).send(error.details[0].message);
        }
      const { amount, date, note, category_id, image_url } = req.body;
 console.log("payload before call create: ", req.user);
    try {
      const userId = req.user.id;
         const result = await createTransaction(amount, date, note, category_id, userId, image_url);
           res.status(201).json({ message: 'Created transaction successfully', result });
     } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Lỗi server' });
    }
});
 router.get('/', async (req, res) => {
     try{
            const userId = req.user.id;
           const transactions = await getTransactions(userId);
           res.json({ transactions });
       } catch (error){
            console.error("Error when getting transactions", error);
           res.status(500).json({ message: 'Lỗi server' });
       }
});
 router.get('/:transactionId', async (req, res) => {
 const { transactionId } = req.params;
     try{
            const userId = req.user.id;
           const transaction = await getDetailTransaction(transactionId, userId);
        if (!transaction) {
                   return res.status(404).json({ error: 'Transaction not found' });
               }
               res.json({ transaction });
           } catch (error) {
               console.error('Error getting transaction:', error);
               res.status(500).json({ error: 'Failed to get transaction' });
           }
});

router.delete('/:transactionId', async (req, res) => {
      const { transactionId } = req.params;
    try{
         const userId = req.user.id;
          await deleteTransaction(transactionId, userId);
         res.json({ message: 'Xóa transaction thành công'});
    } catch (error) {
         console.error("Error when deleting transaction", error);
         res.status(500).json({ message: 'Lỗi server' });
    }
});
const updateSchema = Joi.object({
    amount: Joi.number().optional(), // Optional fields
    date: Joi.date().optional(),
    note: Joi.string().optional(),
    category_id: Joi.number().optional(),
    image_url: Joi.string().optional(),
}).min(1);

router.put('/:transactionId', async (req, res) => {
    const { transactionId } = req.params;
    const userId = req.user.id; // Assuming you have middleware to set req.user
    const updatedData = req.body;

    // Validate updated data
    const { error } = updateSchema.validate(updatedData);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const result = await updateTransaction(transactionId, userId, updatedData);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transaction not found or not authorized' });
        }

        res.json({
            message: 'Transaction updated successfully',
            updatedTransaction: { id: transactionId, ...updatedData },
        });

    } catch (err) {
        console.error("Error updating transaction:", err);
        res.status(500).json({ error: 'Failed to update transaction' });
    }
});
module.exports = router;