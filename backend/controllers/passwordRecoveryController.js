// controllers/passwordRecoveryController.js
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


// Função para enviar email de recuperação de senha
exports.sendPasswordResetEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }

        const token = crypto.randomBytes(20).toString('hex');
        await user.update({ resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 });

        const mailOptions = {
            to: email,
            from: process.env.EMAIL_USER,
            subject: 'Recuperação de Senha',
            text: `Você está recebendo este e-mail porque recebemos uma solicitação de recuperação de senha para sua conta.\n\n
            Por favor, clique no seguinte link ou cole-o no seu navegador para concluir o processo:\n\n
            http://${req.headers.host}/password-recovery/reset/${token}\n\n
            Se você não solicitou isso, ignore este e-mail e sua senha permanecerá inalterada.\n`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send('Instruções de recuperação de senha enviadas para o e-mail.');
    } catch (error) {
        res.status(500).send('Erro ao enviar e-mail de recuperação de senha.');
    }
};

// Função para redefinir a senha
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            return res.status(400).send('Token inválido ou expirado.');
        }

        user.password = bcrypt.hashSync(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).send('Senha atualizada com sucesso.');
    } catch (error) {
        res.status(500).send('Erro ao redefinir a senha.');
    }
};
