const mongoose = require('mongoose');

// This is the blueprint for a user
const userSchema = new mongoose.Schema(
    {
        displayName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Every email must be unique
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User; // Export the model so we can use it elsewhere