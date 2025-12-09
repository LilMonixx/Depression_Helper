const HealingContent = require('../models/healingContentModel');

// @desc    Get all healing content
// @route   GET /api/content
// @access  Public (Ai cũng xem được)
const getAllContent = async (req, res) => {
    try {
        // Sắp xếp theo loại (type), sau đó theo thời gian tạo mới nhất
        const content = await HealingContent.find({}).sort({ type: 1, createdAt: -1 });
        res.status(200).json(content);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new healing content
// @route   POST /api/content
// @access  Private/Admin (Chỉ Admin)
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

// @desc    Delete healing content
// @route   DELETE /api/content/:id
// @access  Private/Admin (Chỉ Admin)
const deleteContent = async (req, res) => {
    try {
        const content = await HealingContent.findById(req.params.id);

        if (content) {
            await content.deleteOne();
            res.json({ message: 'Content removed' });
        } else {
            res.status(404).json({ message: 'Content not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update healing content
// @route   PUT /api/content/:id
// @access  Private/Admin (Chỉ Admin)
const updateContent = async (req, res) => {
    try {
        const { title, description, type, url, thumbnailUrl } = req.body;
        const content = await HealingContent.findById(req.params.id);

        if (content) {
            content.title = title || content.title;
            content.description = description || content.description;
            content.type = type || content.type;
            content.url = url || content.url;
            content.thumbnailUrl = thumbnailUrl || content.thumbnailUrl;

            const updatedContent = await content.save();
            res.json(updatedContent);
        } else {
            res.status(404).json({ message: 'Content not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllContent,
    createContent,
    deleteContent,
    updateContent,
};