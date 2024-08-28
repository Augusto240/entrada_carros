const { Op } = require('sequelize');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Login = require('../models/login');
const nodemailer = require('nodemailer');
require('dotenv').config();

if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.EMAIL_FROM) {
    console.error('Erro: As variáveis de ambiente SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS e EMAIL_FROM devem estar definidas.');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Login.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpire = Date.now() + 3600000;

        await user.update({
            resetToken,
            resetTokenExpire
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Redefinição de Senha',
            text: `Você solicitou a redefinição de sua senha. Use o seguinte token: ${resetToken}`,
            html: `<p>Você solicitou a redefinição de sua senha. Use o seguinte token: <b>${resetToken}</b></p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erro ao enviar o e-mail de recuperação:', error);
                return res.status(500).json({ message: 'Erro ao enviar o e-mail de recuperação' });
            }
            console.log('E-mail enviado:', info.response);
            res.status(200).json({ message: 'E-mail de recuperação enviado com sucesso' });
        });
    } catch (error) {
        console.error('Erro ao solicitar a redefinição de senha:', error);
        res.status(500).json({ message: 'Erro ao solicitar a redefinição de senha' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await Login.findOne({ where: { resetToken: token, resetTokenExpire: { [Op.gt]: Date.now() } } });
        if (!user) {
            return res.status(400).json({ message: 'Token inválido ou expirado' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({
            password: hashedPassword,
            resetToken: null,
            resetTokenExpire: null
        });

        res.status(200).json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
        console.error('Erro ao redefinir a senha:', error);
        res.status(500).json({ message: 'Erro ao redefinir a senha' });
    }
};
