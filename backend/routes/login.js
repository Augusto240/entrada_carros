const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var con = mysql.createPool({
    host: 'db',
    user: 'root',
    password: '',
    database: 'dbentrada',
    connectionLimit: 50,
    connectTimeout: 30000,
});

/**
 * @swagger
 * tags:
 *   name: Login
 *   description: Operações relacionadas a login de usuários
 */

function verificarAdmin(req, res, next) { // Verifica se o usuário é admin
    const token = req.headers['x-access-token'];
    if (!token) {
        res.status(401).json({
            auth: false,
            message: 'Nenhum token de autenticação informado.'
        });
    } else {
        jwt.verify(token, process.env.JWT_SEGREDO, function (err, decoded) {
            if (err) {
                res.status(500).json({ auth: false, message: 'Token inválido.' });
            } else {
                const agoraEmSegundos = Math.floor(Date.now() / 1000);
                if (decoded.exp < agoraEmSegundos) {
                    res.status(401).json({ auth: false, message: 'Token expirado.' });
                } else {
                    const role = decoded.role;

                    if (role === 'admin') {
                        next();
                    } else {
                        res.status(403).json({
                            auth: false,
                            message: 'Acesso negado. Somente usuários com papel de admin podem realizar essa operação'
                        });
                    }
                }
            }
        });
    }
}

/**
 * @swagger
 * /api/login:
 *  post:
 *      summary: Autenticação do usuário
 *      description: Autentica o usuário e devolve um token de acesso
 *      tags: [Login]
 */
router.post('/', function (req, res) { // autentica o usuário
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const usuario = req.body.usuario;
        const senha = req.body.senha;

        const sql = 'SELECT * FROM login WHERE usuario = ?';
        con.query(sql, [usuario], function (erroComandoSQL, result) {
            conexao.release();
            if (erroComandoSQL) {
                console.error('Erro ao executar consulta:', erroComandoSQL);
                res.status(500).json({ auth: false, message: 'Erro do servidor' });
                return;
            }

            if (result.length === 0) {
                res.status(401).json({ auth: false, message: 'Credenciais inválidas' });
                return;
            }

            const user = result[0];

            bcrypt.compare(senha, user.senha, function (erro, result) {
                if (erro) {
                    console.error('Erro ao verificar senha:', erro);
                    res.status(500).json({ auth: false, message: 'Erro do servidor' });
                    return;
                }

                if (!result) {
                    res.status(401).json({ auth: false, message: 'Credenciais inválidas' });
                    return;
                }

                const token = jwt.sign({ usuario: user.usuario, role: user.role }, process.env.JWT_SEGREDO, { expiresIn: '1d' });
                const decodedToken = jwt.decode(token);
                const expiraEm = decodedToken.exp;

                res.status(200).json({ auth: true, message: 'Login bem-sucedido', token: token, role: user.role, expiraEm: expiraEm });
            });
        });
    });
});

/**
 * @swagger
 * /api/login/novo:
 *  post:
 *      summary: Cadastra novo usuário
 *      description: Cadastra um novo usuário
 *      tags: [Login]
 */
router.post('/novo', verificarAdmin, function (req, res) { // cria um novo usuário
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const usuario = req.body.usuario;
        const senha = req.body.senha;
        const role = req.body.role;

        const sqlselect = 'SELECT * FROM login WHERE usuario = ?';
        con.query(sqlselect, [usuario], function (erroComandoSQL, result) {
            conexao.release();
            if (erroComandoSQL) {
                console.error('Erro ao executar consulta:', erroComandoSQL);
                res.status(500).send({message: 'Erro do servidor'});
                return;
            }

            if (result.length > 0) {
                res.status(409).send({message: 'Login existente'});
                return;
            }

            bcrypt.hash(senha, 10, function (erro, hash) {
                if (erro) {
                    console.error('Erro ao gerar hash:', erro);
                    res.status(500).send({message: 'Erro do servidor'});
                    return;
                }

                const sqlinsert = 'INSERT INTO login(usuario, senha, role) VALUES (?, ?, ?)';
                con.query(sqlinsert, [usuario, hash, role], function (erro) {
                    if (erro) {
                        console.error('Erro ao inserir novo login:', erro);
                        res.status(500).send({message:'Erro do servidor'});
                        return;
                    }

                    res.status(200).send({message: 'Login criado com sucesso'});
                });
            });
        });
    });
});
module.exports = router;