const VerifierService = require("../services/cognitoVerifierService");
const UserService = require("../services/supabaseService");
const uploadImage = require('../services/s3Service');

exports.getProfile = async (req, res) => {
    const IdToken = req.headers['authorization']?.split(' ')[1];
    if (!IdToken) {
        return res.status(400).json({ error: "Token es requerido" });
    }
  
    try {
        const cognitoData = await VerifierService.validate(IdToken);
        const userId = cognitoData.sub;
        const profile = await UserService.getUserProfile(userId);
        
        res.status(200).json({ profile });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  };
  
exports.updateProfile = async (req, res) => {
    const IdToken = req.headers['authorization']?.split(' ')[1];
    if (!IdToken) { 
        return res.status(400).json({ error: "Token es requerido" });
    }

    console.log(req)
    
    try {
        const { nombre } = req.body;

        const cognitoData = await VerifierService.validate(IdToken);
        const userId = cognitoData.sub;
        
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