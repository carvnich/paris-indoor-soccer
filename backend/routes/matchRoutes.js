const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { updateMatch, createMatch, getAllSeasons, getMatchesBySeason, getMatchByMatchId } = require("../controllers/matchController");

const router = express.Router();

// Match Routes
router.post('/create', protect, createMatch);
router.put('/:id/update', protect, updateMatch);
router.get('/seasons', getAllSeasons);
router.get('/season', getMatchesBySeason);
router.get('/:matchId', protect, getMatchByMatchId);

module.exports = router;