// app.js
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var dbConfig = require('./config/dbentrada');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

var indexRouter = require('./routes/index');
var alunocarroRouter = require('./routes/alunocarro');
var loginRouter = require('./routes/login');
var placaRouter = require('./routes/placa');
var entradaRouter = require('./routes/entrada');
var mqttRouter = require('./routes/mqtt').router; // Importa o router do mqtt.js
var passwordRecoveryRouter = require('./routes/passwordRecovery');

require('dotenv').config();

var app = express();


app.use(cors({
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const opcoes = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Controle de entrada de veículos',
            version: '1.0.0',
            description: 'API que insere, deleta, edita e consulta dados de condutores e seus veículos autorizados a entrar no IFRN - Campus Parnamirim',
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(opcoes);

app.use('/', indexRouter);
app.use('/alunocarro', alunocarroRouter);
app.use('/login', loginRouter);
app.use('/placa', placaRouter);
app.use('/entrada', entradaRouter);
app.use('/mqtt', mqttRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/password-recovery', passwordRecoveryRouter);


const sequelize = new Sequelize(dbConfig);

module.exports = { app, sequelize };
