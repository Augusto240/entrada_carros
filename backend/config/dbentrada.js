module.exports = {
  dialect: 'mysql', // Certifique-se de que o dialeto é 'mysql'
  host: process.env.MYSQL_HOST || 'localhost',
  port: 3306,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DB || 'dbentrada',
  define: {
    timestamps: false,
  },
};
