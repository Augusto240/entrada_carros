const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

let ultimaMensagem = null;

const client = mqtt.connect({
    protocol: 'mqtt',
    host: 'localhost', // ou o endereço do broker
    port: 1883,
});

client.on('connect', () => {
    console.log('Conectado ao broker MQTT');
});

client.on('error', (err) => {
    console.error('Erro ao conectar ao broker MQTT:', err);
});

var con = mysql.createPool({ //cria pool com o banco de dados
    host: 'db',
    user: 'root',
    password: '',
    database: 'dbentrada',
    connectionLimit: 50,
    connectTimeout: 30000,
});

function verificarToken(req, res, next) { //verifica se o token é válido
    const token = req.headers['x-access-token'];
    if (!token) {
        res.status(401).json({
            auth: false,
            message: 'Nenhum token de autenticação informado.',
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
                    next();
                }
            }
        });
    }
}

client.on('message', function (topic, message) {
    const payload = message.toString();

    try {
        con.getConnection(function (erroConexao, conexao) {
            if (erroConexao) {
                throw erroConexao;
            }
            const dados = JSON.parse(payload);

            // Decodifica a imagem base64
            const imgBuffer = Buffer.from(dados.img, 'base64');

            // Caminho para salvamento da imagem
            const nomeArquivo = `imagem_${Date.now()}.png`
            const caminhoArquivo = path.join(__dirname, 'imagens', nomeArquivo);
            fs.writeFileSync(caminhoArquivo, imgBuffer);

            // Busca o idCarro
            const get_id = 'SELECT idCarro FROM carro WHERE placaCarro = ?';
            con.query(get_id, [dados.placa], function (erroComandoSQL, result) {
                if (erroComandoSQL) {
                    conexao.release();
                    throw erroComandoSQL;
                }

                // Verifica se o resultado da consulta é válido
                if (result.length > 0 && result[0].idCarro !== null) {
                    const id = result[0].idCarro;

                    // Insere os dados no banco de dados
                    const query = 'INSERT INTO historicoentrada(placa, dataHora, img, idCarroRel) VALUES (?, ?, ?, ?)';
                    const dataHora = new Date();
                    const valores = [dados.placa, dataHora, nomeArquivo, id];

                    con.query(query, valores, function (erroComandoSQL, result) {
                        conexao.release();
                        if (erroComandoSQL) {
                            throw erroComandoSQL;
                        }
                        if (result.affectedRows > 0) {
                            console.log('Registro incluído com sucesso!');
                            ultimaMensagem = [{
                                "placa": dados.placa,
                                "dataHora": dataHora,
                                "img": nomeArquivo
                            }];
                        } else {
                            console.log('Erro ao incluir registro.');
                        }
                    });
                } else {
                    conexao.release();
                    console.log('Carro não encontrado no banco de dados.');
                }
            });
        });
    } catch (err) {
        console.error('Erro ao processar mensagem:', err);
    }
});

router.get('/ult-msg', verificarToken, function (req, res) {
    if (ultimaMensagem) {
        res.status(200).send(ultimaMensagem);
    } else {
        res.status(404).send({ message: 'Nenhuma mensagem disponível' });
    }
});

function removerImagensAntigas() {
    const folderPath = path.join(__dirname, 'imagens');

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Erro ao ler a pasta de imagens:', err)
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(folderPath, file);

            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error(`Erro ao obter estatísticas do arquivo ${file}.`);
                    return;
                }

                const diffDias = moment().diff(moment(stats.mtime), 'days');

                if (diffDias > 100) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error(`Erro ao apagar o arquivo ${file}.`);
                        } else {
                            console.log(`Arquivo ${file} removido com sucesso.`);
                        }
                    });
                }
            });
        });
    });
}

module.exports = {
    router, // Exporta o router
    client  // Exporta o cliente MQTT
};