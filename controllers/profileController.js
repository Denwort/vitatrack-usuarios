const VerifierService = require("../services/cognitoVerifierService");
const UserService = require("../services/supabaseService");
const uploadImage = require('../services/s3Service');

exports.getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const profile = await UserService.getUserProfile(userId);
        
        res.status(200).json( profile );
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  };
  
exports.updateProfile = async (req, res) => {

    try {
        const { userId, nombre } = req.body;
        
        req.userId = userId;

        const updates = { nombre };

        // Subir foto si ha sido subida
        if (req.file) {
            await uploadImage.single('foto')(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ error: 'Error al subir la imagen: ' + err.message });
                }
                const photoUrl = req.file.location;
                updates.foto = photoUrl;
            });
        }
        console.log(userId)
        console.log(updates)

        await UserService.updateUserProfile(userId, updates);
        return res.status(200).json({ message: "Perfil actualizado" });

    } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        res.status(400).json({ error: error.message });
    }
  };