const Player = require("../models/Player");
const ImageKit = require("imagekit");

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Get all players
exports.getAllPlayers = async (req, res) => {
    try {
        const players = await Player.find().sort({ team: 1, lastName: 1, firstName: 1 });
        res.status(200).json({ success: true, players });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get players by team
exports.getPlayersByTeam = async (req, res) => {
    try {
        const { team } = req.query;

        if (!team) {
            return res.status(400).json({ message: "Team parameter is required" });
        }

        const players = await Player.find({ team }).sort({ lastName: 1, firstName: 1 });
        res.status(200).json({ success: true, players });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single player by ID
exports.getPlayerById = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);

        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }

        res.status(200).json({ success: true, player });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new player
exports.createPlayer = async (req, res) => {
    try {
        const { firstName, lastName, team, imageBase64 } = req.body;

        if (!firstName || !lastName || !team) {
            return res.status(400).json({ message: "First name, last name, and team are required" });
        }

        let imageUrl = null;
        let imageKitFileId = null;

        // Upload image to ImageKit if provided
        if (imageBase64) {
            try {
                const uploadResponse = await imagekit.upload({
                    file: imageBase64,
                    fileName: `${team}_${firstName}_${lastName}_${Date.now()}.jpg`,
                    folder: "/paris-indoor-soccer/players",
                    tags: [team, "player"],
                });

                imageUrl = uploadResponse.url;
                imageKitFileId = uploadResponse.fileId;
            } catch (uploadError) {
                console.error("ImageKit upload error:", uploadError);
                return res.status(500).json({ message: "Failed to upload image", error: uploadError.message });
            }
        }

        const player = await Player.create({
            firstName,
            lastName,
            team,
            imageUrl,
            imageKitFileId,
        });

        res.status(201).json({ success: true, player });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update player
exports.updatePlayer = async (req, res) => {
    try {
        const { firstName, lastName, team, imageBase64, deleteImage } = req.body;

        const player = await Player.findById(req.params.id);

        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }

        // Update basic fields
        if (firstName) player.firstName = firstName;
        if (lastName) player.lastName = lastName;
        if (team) player.team = team;

        // Handle image deletion
        if (deleteImage && player.imageKitFileId) {
            try {
                await imagekit.deleteFile(player.imageKitFileId);
                player.imageUrl = null;
                player.imageKitFileId = null;
            } catch (deleteError) {
                console.error("ImageKit delete error:", deleteError);
                // Continue even if deletion fails
            }
        }

        // Handle new image upload
        if (imageBase64) {
            // Delete old image if exists
            if (player.imageKitFileId) {
                try {
                    await imagekit.deleteFile(player.imageKitFileId);
                } catch (deleteError) {
                    console.error("ImageKit delete error:", deleteError);
                }
            }

            // Upload new image
            try {
                const uploadResponse = await imagekit.upload({
                    file: imageBase64,
                    fileName: `${team || player.team}_${firstName || player.firstName}_${lastName || player.lastName}_${Date.now()}.jpg`,
                    folder: "/paris-indoor-soccer/players",
                    tags: [team || player.team, "player"],
                });

                player.imageUrl = uploadResponse.url;
                player.imageKitFileId = uploadResponse.fileId;
            } catch (uploadError) {
                console.error("ImageKit upload error:", uploadError);
                return res.status(500).json({ message: "Failed to upload image", error: uploadError.message });
            }
        }

        await player.save();

        res.status(200).json({ success: true, player });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete player
exports.deletePlayer = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);

        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }

        // Delete image from ImageKit if exists
        if (player.imageKitFileId) {
            try {
                await imagekit.deleteFile(player.imageKitFileId);
            } catch (deleteError) {
                console.error("ImageKit delete error:", deleteError);
                // Continue with player deletion even if image deletion fails
            }
        }

        await Player.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "Player deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};