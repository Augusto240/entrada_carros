const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = mysql.createPool({
    host: 'localhost',
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

function verificarAdmin(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({
            auth: false,
            message: 'Nenhum token de autenticação informado.'
        });
    }

    jwt.verify(token, process.env.JWT_SEGREDO, function (err, decoded) {
        if (err) {
            return res.status(500).json({ auth: false, message: 'Token inválido.' });
        }

        const agoraEmSegundos = Math.floor(Date.now() / 1000);
        if (decoded.exp < agoraEmSegundos) {
            return res.status(401).json({ auth: false, message: 'Token expirado.' });
        }

        if (decoded.role === 'admin') {
            next();
        } else {
            return res.status(403).json({
                auth: false,
                message: 'Acesso negado. Somente usuários com papel de admin podem realizar essa operação.'
            });
        }
    });
}

/**
 * @swagger
 * /login:
 *  post:
 *      summary: Autenticação do usuário
 *      description: Autentica o usuário e devolve um token de acesso
 *      tags: [Login]
 */
router.post('/', function (req, res) {
    pool.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            return res.status(500).json({ message: 'Erro na conexão com o banco de dados.' });
        }
        
        const { usuario, senha } = req.body;

        const sql = 'SELECT * FROM login WHERE usuario = ?';
        conexao.query(sql, [usuario], function (erroComandoSQL, result) {
            conexao.release();
            if (erroComandoSQL) {
                console.error('Erro ao executar consulta:', erroComandoSQL);
                return res.status(500).json({ auth: false, message: 'Erro do servidor' });
            }

            if (result.length === 0) {
                return res.status(401).json({ auth: false, message: 'Credenciais inválidas' });
            }

            const user = result[0];

            bcrypt.compare(senha, user.senha, function (erro, result) {
                if (erro) {
                    console.error('Erro ao verificar senha:', erro);
                    return res.status(500).json({ auth: false, message: 'Erro do servidor' });
                }

                if (!result) {
                    return res.status(401).json({ auth: false, message: 'Credenciais inválidas' });
                }

                const token = jwt.sign({ usuario: user.usuario, role: user.role }, process.env.JWT_SEGREDO, { expiresIn: '1d' });
                const decodedToken = jwt.decode(token);
                const expiraEm = decodedToken.exp;

                return res.status(200).json({ auth: true, message: 'Login bem-sucedido', token, role: user.role, expiraEm });
            });
        });
    });
});

/**
 * @swagger
 * /login/novo:
 *  post:
 *      summary: Cadastra novo usuário
 *      description: Cadastra um novo usuário
 *      tags: [Login]
 */
router.post('/novo', verificarAdmin, function (req, res) {
    pool.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            return res.status(500).json({ message: 'Erro na conexão com o banco de dados.' });
        }
        
        const { usuario, senha, role } = req.body;

        const sqlselect = 'SELECT * FROM login WHERE usuario = ?';
        conexao.query(sqlselect, [usuario], function (erroComandoSQL, result) {
            conexao.release();
            if (erroComandoSQL) {
                console.error('Erro ao executar consulta:', erroComandoSQL);
                return res.status(500).json({ message: 'Erro do servidor' });
            }

            if (result.length > 0) {
                return res.status(409).json({ message: 'Login existente' });
            }

            bcrypt.hash(senha, 10, function (erro, hash) {
                if (erro) {
                    console.error('Erro ao gerar hash:', erro);
                    return res.status(500).json({ message: 'Erro do servidor' });
                }

                const sqlinsert = 'INSERT INTO login(usuario, senha, role) VALUES (?, ?, ?)';
                conexao.query(sqlinsert, [usuario, hash, role], function (erro) {
                    if (erro) {
                        console.error('Erro ao inserir novo login:', erro);
                        return res.status(500).json({ message: 'Erro do servidor' });
                    }

                    return res.status(200).json({ message: 'Login criado com sucesso' });
                });
            });
        });
    });
});

module.exports = router;
