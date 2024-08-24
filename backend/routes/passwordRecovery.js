// routes/passwordRecovery.js
const express = require('express');
const router = express.Router();
const connection = require('../config/dbentrada');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: require('path').resolve('../.env') });

// Função para gerar um token aleatório
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Enviar e-mail de recuperação de senha
exports.sendRecoveryEmail = async (req, res) => {
    const { email } = req.body;

    try {
        // Verifica se o usuário está cadastrado
        const [user] = await connection.execute('SELECT * FROM login WHERE email = ?', [email]);

        if (!user.length) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const resetToken = generateToken();
        const resetTokenExpire = Date.now() + 3600000; // Token válido por 1 hora

        // Armazena o token e a data de expiração no banco de dados
        await connection.execute(
            'UPDATE login SET resetToken = ?, resetTokenExpire = ? WHERE email = ?',
            [resetToken, resetTokenExpire, email]
        );

        // Configura o serviço de e-mail (usando Nodemailer)
        const transporter = nodemailer.createTransport({
            service: 'Outlook',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Recuperação de Senha',
            html: `
                <p>Você solicitou a recuperação de senha. Clique no link abaixo para redefinir sua senha:</p>
                <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">Redefinir Senha</a>
                <p>O link é válido por 1 hora.</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'E-mail de recuperação enviado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao enviar o e-mail de recuperação', error });
    }
};

// Solicitar a recuperação de senha
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        // Verifica se o usuário existe na tabela `login`
        const [rows] = await connection.execute('SELECT * FROM login WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Gera um token de redefinição
        const resetToken = generateToken();
        const resetTokenExpire = Date.now() + 3600000; // 1 hora para expirar

        // Atualiza o usuário com o token e a data de expiração
        await connection.execute('UPDATE login SET resetToken = ?, resetTokenExpire = ? WHERE email = ?', [resetToken, resetTokenExpire, email]);

        // Enviar o e-mail de recuperação de senha
        await this.sendRecoveryEmail(req, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

// Redefinir a senha
exports.resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;

    try {
        // Verifica o token de redefinição e a expiração na tabela `login`
        const [rows] = await connection.execute('SELECT * FROM login WHERE resetToken = ? AND resetTokenExpire > ?', [resetToken, Date.now()]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Token inválido ou expirado' });
        }

        // Atualiza a senha do usuário e remove o token
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await connection.execute('UPDATE login SET senha = ?, resetToken = NULL, resetTokenExpire = NULL WHERE resetToken = ?', [hashedPassword, resetToken]);

        res.status(200).json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

module.exports = router;
