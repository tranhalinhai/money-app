const express = require('express');
    const { createCategory, getCategories, deleteCategory, updateCategory } = require('../models/Category');
     const { AuthMiddleware } = require("../utils/AuthMiddleware");
    const Joi = require('joi');
    const router = express.Router();
    const createCategorySchema = Joi.object({
            name: Joi.string().required(),
            type: Joi.string().valid('income', 'expense').required(),
           icon: Joi.string().required()
    })
    router.use(AuthMiddleware);

       router.post('/create', async (req, res) => {
         const { error } = createCategorySchema.validate(req.body);
           if (error) {
                return res.status(400).send(error.details[0].message);
          }
          const { name, type, icon } = req.body;
         try {
               const userId = req.user.id;
                const result = await createCategory(name, type, userId, icon);
                res.status(201).json({ message: 'Created successfully', result });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Lỗi server' });
            }
    });
     router.get('/', async (req, res) => {
         try{
               const userId = req.user.id;
                const categories = await getCategories(userId);
                res.json({ categories });
           } catch (error){
               console.error("Error when getting category", error);
                res.status(500).json({ message: 'Lỗi server' });
          }
    });
        router.delete('/:categoryId', async (req, res) => {
            const { categoryId } = req.params;
            try{
                  const userId = req.user.id;
                   await deleteCategory(categoryId, userId);
                    res.json({ message: 'Xóa category thành công'});
            } catch (error) {
              console.error("Error when deleting category", error);
                res.status(500).json({ message: 'Lỗi server' });
          }
    });
        router.put('/:categoryId', async (req, res) => {
         const { error } = createCategorySchema.validate(req.body);
              if (error) {
                 return res.status(400).send(error.details[0].message);
              }
         const { categoryId } = req.params;
             const { name, type, icon } = req.body;
            try{
                    const userId = req.user.id;
                    await updateCategory(categoryId, name, type, userId, icon);
                      res.json({ message: 'Sửa category thành công' });
              } catch (error) {
                 console.error("Error when updating category", error);
                    res.status(500).json({ message: 'Lỗi server' });
                }
        });


    module.exports = router;