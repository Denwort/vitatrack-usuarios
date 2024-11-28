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

exports.login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
  
    const tokens = await CognitoService.loginUser(correo, contrasena);
    res.status(200).json({ message: "Inicio de sesión exitoso", tokens });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { correo } = req.body;

    await CognitoService.forgotPassword(correo);
    res.status(200).json({ message: "Se ha enviado un codigo para restablecer su contraseña a su correo." });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { correo, codigo, nuevaContrasena } = req.body;

    await CognitoService.resetPassword(correo, codigo, nuevaContrasena);
    res.status(200).json({ message: "Contraseña restablecida exitosamente." });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { accessToken } = req.body;

    const logoutResponse = await CognitoService.logoutUser(accessToken);
    res.status(200).json({ message: "Cierre de sesión exitoso." });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};