const CognitoService = require("../services/cognitoIdentityService");
const UserService = require("../services/supabaseService");

exports.register = async (req, res) => {
  try {
    const { correo, contrasena, nombre } = req.body;
  
    // Registrar cuenta en Cognito
    const cognitoRegistration = await CognitoService.registerUser(correo, contrasena);

    // Si la cuenta es nueva, crear perfil en Supabase usando el userId de Cognito
    if (cognitoRegistration.type == "registered"){
      await UserService.createUserProfile(cognitoRegistration.id, correo, nombre);
    }

    res.status(200).json({ message: "Usuario registrado. Se ha enviado un código de confirmación al correo." });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.confirm = async (req, res) => {
  try {
    const { correo, codigo } = req.body;

    // Confirmar cuenta en Cognito
    await CognitoService.confirmUser(correo, codigo);

    res.status(200).json({ message: "Usuario confirmado." });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
