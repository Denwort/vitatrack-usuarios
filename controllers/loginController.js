const CognitoService = require("../services/cognitoIdentityService");

exports.login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
  
    const tokens = await CognitoService.loginUser(correo, contrasena);
    res.status(200).json({ message: "Inicio de sesión exitoso", tokens });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
