// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authController = require("./controllers/authController");
const profileController = require("./controllers/profileController");
const apiController = require("./controllers/apiController");

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.post("/auth/register", authController.register);
app.post("/auth/confirm", authController.confirm);
app.post("/auth/login", authController.login);
app.post("/auth/forgot", authController.forgotPassword);
app.post("/auth/reset", authController.resetPassword);

app.get("/profile/me", profileController.getProfile);
app.put("/profile/me", profileController.updateProfile);

app.post("/api/idByEmail", apiController.IdByEmail)
app.post("/api/profileById", apiController.profileById)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
  });