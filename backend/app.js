const express = require('express');
const sequelize = require('./db');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const dbConfig = require('./config/dbentrada');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const indexRouter = require('./routes/index');
const alunocarroRouter = require('./routes/alunocarro');
const loginRouter = require('./routes/login');
const placaRouter = require('./routes/placa');
const entradaRouter = require('./routes/entrada');
const mqttRouter = require('./routes/mqtt').router;
const passwordRecoveryRouter = require('./routes/passwordRecovery');

require('dotenv').config();


const app = express();

// Configurações de middleware
app.use(cors({
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do Swagger
const options = {
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

const swaggerSpec = swaggerJSDoc(options);

app.use('/', indexRouter);
app.use('/alunocarro', alunocarroRouter);
app.use('/login', loginRouter);
app.use('/placa', placaRouter);
app.use('/entrada', entradaRouter);
app.use('/mqtt', mqttRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/password-recovery', passwordRecoveryRouter);

// Exporta a instância do Sequelize e a aplicação
module.exports = { app, sequelize };
