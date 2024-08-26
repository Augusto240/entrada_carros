// routes/passwordRecovery.js
const app = require('../app');
const sequelize = app.sequelize;
const express = require('express');
const router = express.Router();
const { requestPasswordReset, resetPassword } = require('../controllers/passwordRecoveryController');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { Login } = require('../models/login'); 
require('dotenv').config();

// Função para gerar um token aleatório
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Solicitar recuperação de senha
router.post('/request', requestPasswordReset);

// Redefinir a senha
router.post('/reset', resetPassword);

module.exports = router;
