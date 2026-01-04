const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); 
const cors = require('cors');
const passport = require('passport'); // <-- Import Passport

// Import routes
const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journalRoutes');
const moodRoutes = require('./routes/moodRoutes');
const healingContentRoutes = require('./routes/healingContentRoutes');
const userRoutes = require('./routes/userRoutes'); 
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config();

// Cấu hình Passport
require('./config/passport')(passport); // <-- Kích hoạt cấu hình Passport

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

const app = express();

app.use(cors(
    'http://localhost:5173',
    'https://depression-helper-1.onrender.com',
    'https://depression-helper.vercel.app'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize()); // <-- Khởi chạy Passport middleware

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/content', healingContentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

const dirname = path.resolve();
app.use('/uploads', express.static(path.join(dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('API is running ...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});