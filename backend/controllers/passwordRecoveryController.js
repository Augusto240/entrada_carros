const { Op } = require('sequelize');
const app = require('../app');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Login = require('../models/login');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        // Verificar se o e-mail existe na tabela login
        const user = await Login.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Gerar token de recuperação
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpire = Date.now() + 3600000; // 1 hora

        // Atualizar o token e a expiração no banco de dados
        await user.update({
            resetToken: resetToken,
            resetTokenExpire: resetTokenExpire
        });

        // Enviar e-mail
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Solicitação de recuperação de senha',
            text: `Você solicitou a recuperação de senha. Utilize o seguinte link para definir uma nova senha: http://localhost:8080/reset-password/${resetToken}`
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'E-mail de recuperação enviado com sucesso' });
        } catch (error) {
            console.error('Erro ao enviar o e-mail de recuperação:', error);
            res.status(500).json({ message: 'Erro ao enviar o e-mail de recuperação', error });
        }
    } catch (error) {
        console.error('Erro ao processar a solicitação de recuperação de senha:', error);
        res.status(500).json({ message: 'Erro ao processar a solicitação', error });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await Login.findOne({
            where: {
                resetToken: token,
                resetTokenExpire: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            return res.status(400).send('Token inválido ou expirado.');
        }

        user.password = bcrypt.hashSync(password, 10);
        user.resetToken = null;
        user.resetTokenExpire = null;
        await user.save();

        res.status(200).send('Senha atualizada com sucesso.');
    } catch (error) {
        console.error('Erro ao redefinir a senha:', error);
        res.status(500).send('Erro ao redefinir a senha.');
    }
};
