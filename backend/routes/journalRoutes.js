const express = require('express');
const router = express.Router();
const {
    getJournals,
    createJournal,
    updateJournal,
    deleteJournal,
} = require('../controllers/journalController');

// Import our 'protect' middleware
const { protect } = require('../middleware/authMiddleware');

// Apply the 'protect' middleware to all routes in this file
// This means only logged-in users can access these endpoints
router.use(protect);

// --- Define the routes ---

// GET /api/journal/
// POST /api/journal/
router.route('/')
    .get(getJournals)
    .post(createJournal);

// PUT /api/journal/:id
// DELETE /api/journal/:id
router.route('/:id')
    .put(updateJournal)
    .delete(deleteJournal);

module.exports = router;