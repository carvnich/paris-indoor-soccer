const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
    getAllPlayers,
    getPlayersByTeam,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer
} = require("../controllers/playerController");

const router = express.Router();

// Player Routes
router.get('/', getAllPlayers);                    // Get all players (public)
router.get('/team', getPlayersByTeam);             // Get players by team (public)
router.get('/:id', getPlayerById);                 // Get player by ID (public)
router.post('/create', protect, createPlayer);     // Create player (admin only)
router.put('/:id/update', protect, updatePlayer);  // Update player (admin only)
router.delete('/:id/delete', protect, deletePlayer); // Delete player (admin only)

module.exports = router;