const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 