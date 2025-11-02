const HealingContent = require('../models/healingContentModel');

// @desc    Get all healing content
// @route   GET /api/content
// @access  Public
const getAllContent = async (req, res) => {
    try {
        // Sắp xếp theo loại (type), sau đó theo thời gian tạo
        const content = await HealingContent.find({}).sort({ type: 1, createdAt: -1 });
        res.status(200).json(content);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new healing content (Admin/Test only)
// @route   POST /api/content
// @access  Private (for testing with Postman, no real auth yet)
const createContent = async (req, res) => {
    try {
        const { title, description, type, url, thumbnailUrl } = req.body;

        // Validation
        if (!title || !description || !type || !url) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const newContent = await HealingContent.create({
            title,
            description,
            type,
            url,
            thumbnailUrl,
        });

        res.status(201).json(newContent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllContent,
    createContent,
};