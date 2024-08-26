const { Sequelize } = require('sequelize');
const dbConfig = require('./config/dbentrada');

const sequelize = new Sequelize(dbConfig);

sequelize.authenticate()
  .then(() => console.log('Conexão bem-sucedida com o banco de dados.'))
  .catch(err => console.error('Erro ao conectar com o banco de dados:', err));
