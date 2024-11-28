const { CognitoJwtVerifier } = require('aws-jwt-verify');

const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    tokenUse: "id",
    clientId: process.env.COGNITO_CLIENT_ID,
  });

const VerifierService = {

  async validate (IdToken) {
    const payload = await verifier.verify(IdToken);
    return payload
  },

}

module.exports = VerifierService;
