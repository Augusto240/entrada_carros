// routes/passwordRecovery.js
const express = require('express');
const router = express.Router();
const passwordRecoveryController = require('../controllers/passwordRecoveryController');
require('dotenv').config();

// Função para gerar um token aleatório
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

router.post('/request', passwordRecoveryController.requestPasswordReset);

module.exports = router;
