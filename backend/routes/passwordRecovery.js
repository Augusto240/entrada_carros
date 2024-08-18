// routes/passwordRecovery.js
const express = require('express');
const router = express.Router();
const db = require('../config/dbentrada');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const { User } = require('../models'); // Ajuste conforme o nome do modelo

// Configurar o transporte de e-mail
const transporter = nodemailer.createTransport({
    service: 'Gmail', // ou outro serviço
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Solicitar recuperação de senha

router.post('/request', async (req, res) => {
    const { email } = req.body;

    try {
        // Verifica se o usuário existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }

        // Gera um token de recuperação
        const token = crypto.randomBytes(20).toString('hex');
        await user.update({ resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 }); // 1 hora

        // Envia o e-mail com o link de recuperação
        const mailOptions = {
            to: email,
            from: 'your-email@example.com',
            subject: 'Recuperação de Senha',
            text: `Você está recebendo este e-mail porque recebemos uma solicitação de recuperação de senha para sua conta.\n\n
            Por favor, clique no seguinte link ou cole-o no seu navegador para concluir o processo:\n\n
            http://${req.headers.host}/reset/${token}\n\n
            Se você não solicitou isso, ignore este e-mail e sua senha permanecerá inalterada.\n`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send('Instruções de recuperação de senha enviadas para o e-mail.');

    } catch (error) {
        res.status(500).send('Erro ao enviar e-mail de recuperação de senha.');
    }
});

// Resetar a senha

router.post('/reset/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Verifica o token e sua validade
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            return res.status(400).send('Token inválido ou expirado.');
        }

        // Atualiza a senha
        user.password = bcrypt.hashSync(password, 10); // Use bcrypt para hash da senha
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).send('Senha atualizada com sucesso.');

    } catch (error) {
        res.status(500).send('Erro ao redefinir a senha.');
    }
});

module.exports = router;
