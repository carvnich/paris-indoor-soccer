const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        team: { type: String, required: true }, // Yellow, Orange, Blue, Green, Red, White
        imageUrl: { type: String, required: false },
        imageKitFileId: { type: String, required: false }, // Store ImageKit file ID for deletion
    },
    {
        timestamps: true,
        id: false,
    }
);

module.exports = mongoose.model("Player", PlayerSchema);