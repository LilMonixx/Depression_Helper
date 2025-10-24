const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); 
const cors = require('cors');

//Import routes
const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journalRoutes');
const moodRoutes = require('./routes/moodRoutes');

// Load environment variables
dotenv.config();

// --- Hàm kết nối Database ---
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Thoát tiến trình nếu lỗi
    }
};

// --- Gọi hàm kết nối ---
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Để phân tích cú pháp JSON trong body của yêu cầu

const PORT = process.env.PORT || 5000;

// use routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/mood', moodRoutes);

app.get('/', (req, res) => {
    res.send('API is running ...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});