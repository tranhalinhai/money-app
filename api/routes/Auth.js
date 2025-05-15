const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByEmail } = require('../models/User');
const { createUser } = require('../models/User');
const { getUserById } = require('../models/User');
const { generateToken } = require('../utils/Auth');
const Joi = require('joi');
const { AuthMiddleware } = require("../utils/AuthMiddleware");
const { initializeDatabase } = require('../config/Database'); // Thay đổi đường dẫn cho phù hợp



const router = express.Router();

// Validate request body
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  full_name: Joi.string().required(),
});

// Đăng nhập
router.post('/login', async (req, res) => {
     const { error } = loginSchema.validate(req.body);
        if(error) {
             return res.status(400).send(error.details[0].message)
        }
    const { email, password } = req.body;

    try {
        // Tìm người dùng theo email
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email ' });
        }

        // Kiểm tra mật khẩu
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Tạo JWT
        const token = generateToken(user);

        res.status(200).json({ message: 'Login successfully', token, user: { id: user.id, email: user.email, name: user.full_name } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// đăng ký
router.post('/signup', async (req, res) => {
   const { error } = signupSchema.validate(req.body);
      if (error) {
          return res.status(400).send(error.details[0].message);
      }

      const { email, password, full_name } = req.body;

      try {
          // Kiểm tra email đã tồn tại
          const existingUser = await getUserByEmail(email);
          if (existingUser) {
              return res.status(400).json({ message: 'Email đã tồn tại' });
          }

          // Hash password
          const hashedPassword = await bcrypt.hash(password, 10);

          // Tạo user
          const result = await createUser(email, hashedPassword, full_name);

          res.status(201).json({ message: 'Đăng ký thành công' });
      } catch (error) {
          console.error(error);
          if(error.message === "Email already exists") {
              res.status(400).json({ message: error.message });
          }
          else {
              res.status(500).json({ message: 'Lỗi server' });
          }
      }
});

 // lấy thông tin người dùng
router.get('/me', AuthMiddleware, async (req, res) => {  // Use AuthMiddleware
    console.log("Request to /me received!");
     console.log("req.user:", req.user);
    try {
        const userId = req.user.id;
        console.log("userId:", userId);
        const user = await getUserById(userId);
        console.log("user from database:", user);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });

    } catch (error) {
        console.error("Error getting user info:", error);
        res.status(500).json({ error: 'Failed to get user information' });
    }

});

// Cập nhật thông tin người dùng
router.put('/update-me', AuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { full_name, image_url } = req.body;

        const pool = await initializeDatabase(); // Move this inside the try block
        console.log("Database pool:", pool); // Kiểm tra pool

        let updateFields = [];
        let params = [];

        if (full_name) {
            updateFields.push("full_name = ?");
            params.push(full_name);
        }
        if (image_url) {
            updateFields.push("image_url = ?");
            params.push(image_url);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        // Construct the SQL query safely
        const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
        params.push(userId); // Add userId to parameters *last*

        const [result] = await pool.execute(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await getUserById(userId);
        res.json({ message: 'User updated successfully', user: updatedUser });

    } catch (error) {
        console.error("Error updating user info:", error);
        res.status(500).json({ message: 'Failed to update user information', error: error.message }); // Include error message for debugging
    }
});

 module.exports = router;