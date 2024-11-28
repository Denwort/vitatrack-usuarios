const CognitoService = require("../services/cognitoIdentityService");

exports.logout = async (req, res) => {
  try {
    const { accessToken } = req.body;

    const logoutResponse = await CognitoService.logoutUser(accessToken);
    res.status(200).json({ message: "Cierre de sesión exitoso." });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};