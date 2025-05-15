require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/Auth');
const cateRoutes = require('./routes/Category');
const transRoutes = require('./routes/Transaction');
const budgetRoutes = require('./routes/Budget');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
// Bạn sẽ sử dụng các route khác ở đây
app.use('/cate', cateRoutes);
app.use('/transactions',transRoutes);
app.use('/budget', budgetRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to personal finance backend API!');
});


// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});