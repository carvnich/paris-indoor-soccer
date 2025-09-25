const Match = require("../models/Match");

// @desc    Create a match
// @route   PUT /api/match/create
// @access  Private
exports.createMatch = async (req, res) => {
    try {
        const { matchId, dateTime, season, homeTeam, awayTeam, isPlayoff } = req.body;

        const match = await Match.create({
            matchId,
            dateTime,
            season,
            homeTeam,
            awayTeam,
            isPlayoff,
        });

        res.status(201).json({ success: true, match });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};

// @desc    Update match result
// @route   PUT /api/match/:id/update
// @access  Private
exports.updateMatch = async (req, res) => {
    try {
        const { homeTeamScore, awayTeamScore } = req.body;

        // Find the match first
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        // Update scores
        match.homeTeam.score = homeTeamScore;
        match.awayTeam.score = awayTeamScore;

        await match.save();

        res.status(200).json({ success: true, match });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all unique seasons from matches
// @route   GET /api/match/seasons
// @access  Public
exports.getAllSeasons = async (req, res) => {
    try {
        const seasons = await Match.distinct("season");

        if (!seasons || seasons.length === 0) {
            return res.status(404).json({ success: false, message: "No seasons found" });
        }

        // Sort seasons in descending order (newest first)
        const sortedSeasons = seasons.sort().reverse();

        res.status(200).json({ success: true, count: seasons.length, seasons: sortedSeasons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all matches for a given season
// @route   GET /api/match/season?season=2024/2025
// @access  Public
exports.getMatchesBySeason = async (req, res) => {
    try {
        const { season } = req.query;

        if (!season) {
            return res.status(400).json({ success: false, message: "Season parameter is required" });
        }

        const matches = await Match.find({ season }).sort({ date: 1, time: 1 });

        if (!matches || matches.length === 0) {
            return res.status(404).json({ success: false, message: `No matches found for season ${season}` });
        }

        res.status(200).json({ success: true, count: matches.length, matches });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};

// @desc    Get a match by matchId
// @route   GET /api/match/:matchId
// @access  Private
exports.getMatchByMatchId = async (req, res) => {
    try {
        const { matchId } = req.params;

        const match = await Match.findOne({ matchId });

        if (!match) {
            return res.status(404).json({ success: false, message: `Match with ID ${matchId} not found` });
        }

        res.status(200).json({ success: true, match });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};
