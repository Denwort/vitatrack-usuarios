const UserService = require("../services/supabaseService");




exports.IdByEmail = async (req, res) => {
    try {
        const { correo } = req.body;

        const id = await UserService.getIdByEmail(correo);

        res.status(200).json(id);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.profileById = async (req, res) => {
    try {
        const { userId } = req.body;

        const profile = await UserService.getUserProfile(userId);

        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};