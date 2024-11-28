const { 
  CognitoIdentityProviderClient, 
  SignUpCommand, 
  ResendConfirmationCodeCommand, 
  ConfirmSignUpCommand, 
  InitiateAuthCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GlobalSignOutCommand,
  AdminGetUserCommand 
} = require("@aws-sdk/client-cognito-identity-provider");
const crypto = require('crypto');
require('dotenv').config();

const client = new CognitoIdentityProviderClient({ region: 'us-east-2' });

const calculateSecretHash = (username) => {
  const hmac = crypto.createHmac('sha256', process.env.COGNITO_CLIENT_SECRET);
  hmac.update(username + process.env.COGNITO_CLIENT_ID);
  return hmac.digest('base64');
};

const CognitoService = {

  async registerUser(correo, contrasena) {
    try {
      // Intentamos registrar al usuario
      const params = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: correo,
        Password: contrasena,
        UserAttributes: [{ Name: 'email', Value: correo }],
        SecretHash: calculateSecretHash(correo),
      };

      const command = new SignUpCommand(params);
      const data = await client.send(command);

      return { type: 'registered', id: data.UserSub };

    } catch (error) {
      if (error.name === 'UsernameExistsException') {
        // Si el correo ya existe, intentamos reenviar el código de confirmación
        const resendParams = {
          ClientId: process.env.COGNITO_CLIENT_ID,
          Username: correo,
          SecretHash: calculateSecretHash(correo),
        };

        const resendCommand = new ResendConfirmationCodeCommand(resendParams);
        const data = await client.send(resendCommand);

        return { type: 'resent' };
      }

      // Si el error es otro, lo lanzamos
      throw new Error(error.message);
    }
  },

  async confirmUser(correo, codigo) {
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: correo,
      ConfirmationCode: codigo,
      SecretHash: calculateSecretHash(correo),
    };
    const command = new ConfirmSignUpCommand(params);
    await client.send(command);
    return;
  },

  async loginUser(correo, contrasena) {
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: correo,
        PASSWORD: contrasena,
        SECRET_HASH: calculateSecretHash(correo),
      }
    };
    const command = new InitiateAuthCommand(params);
    const data = await client.send(command);
    const { IdToken, AccessToken, RefreshToken } = data.AuthenticationResult;
    return { IdToken, AccessToken, RefreshToken };
  },

  async forgotPassword(correo) {
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: correo,
      SecretHash: calculateSecretHash(correo),
    };
    const command = new ForgotPasswordCommand(params);
    await client.send(command);
    return;
  },

  async resetPassword(correo, codigo, nuevaContrasena) {
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: correo,
      ConfirmationCode: codigo,
      Password: nuevaContrasena,
      SecretHash: calculateSecretHash(correo),
    };
    const command = new ConfirmForgotPasswordCommand(params);
    await client.send(command);
    return;
  },

};

module.exports = CognitoService;
