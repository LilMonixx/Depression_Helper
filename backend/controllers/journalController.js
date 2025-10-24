const Journal = require('../models/journalModel');
const User = require('../models/userModel');

// @desc    get journals for a user
// @route   GET /api/journals
// @access  Private
const getJournals = async (req, res) => {
    try {
        const journals = await Journal.find({ user: req.user.id });

        res.status(200).json(journals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new journal entry
// @route   POST /api/journal
// @access  Private
const createJournal = async (req, res) => {
    try {
        // 1. Get title and content from the request body
        const { title, content } = req.body;

        // 2. Simple validation
        if (!title || !content) {
            return res.status(400).json({ message: 'Please add a title and content' });
        }

        // 3. Create the new journal entry
        const journal = await Journal.create({
            user: req.user.id, // req.user.id comes from our 'protect' middleware
            title,
            content,
        });

        // 4. Send back the newly created journal entry
        res.status(201).json(journal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ... (code for getJournals and createJournal is already here)

// @desc    Update a journal entry
// @route   PUT /api/journal/:id
// @access  Private
const updateJournal = async (req, res) => {
    try {
        const { title, content } = req.body;
        const journal = await Journal.findById(req.params.id);

        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        // Make sure the logged-in user owns this journal entry
        if (journal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Update the fields
        journal.title = title || journal.title;
        journal.content = content || journal.content;

        const updatedJournal = await journal.save();
        res.status(200).json(updatedJournal);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a journal entry
// @route   DELETE /api/journal/:id
// @access  Private
const deleteJournal = async (req, res) => {
    try {
        const journal = await Journal.findById(req.params.id);

        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        // Make sure the logged-in user owns this journal entry
        if (journal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await journal.deleteOne(); // Use .deleteOne()
        res.status(200).json({ message: 'Journal removed' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getJournals,
    createJournal,
    updateJournal, 
    deleteJournal, 
};