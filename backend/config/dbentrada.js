// config/dbentrada.js
module.exports = {
  dialect: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost', // Usa 'db' em ambiente Docker
  port: 3306,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '', // Adicione a senha, se houver
  database: process.env.MYSQL_DB || 'dbentrada',
  define: {
      timestamps: false,
  },
};