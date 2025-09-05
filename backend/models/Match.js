const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema(
	{
		matchId: { type: String, required: true, unique: true },
		dateTime: { type: String, required: true },
		season: { type: String, required: true },
		homeTeam: {
			team: { type: String, required: true },
			color: { type: String, required: true },
			score: { type: Number, required: true, min: 0 }
		},
		awayTeam: {
			team: { type: String, required: true },
			color: { type: String, required: true },
			score: { type: Number, required: true, min: 0 }
		},
		isPlayoff: { type: Boolean, default: false },
	},
	{
		timestamps: true,
		id: false
	}
);

module.exports = mongoose.model("Match", MatchSchema);