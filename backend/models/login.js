const sequelize = require('../db');
const { DataTypes } = require('sequelize');

if (!sequelize) {
  throw new Error('A instância do Sequelize não foi encontrada. Verifique a exportação em app.js.');
}

const Login = sequelize.define('Login', {
  idlogin: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuario: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  senha: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  resetToken: {
    type: DataTypes.STRING(64),
    allowNull: true,
  },
  resetTokenExpire: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
}, {
  tableName: 'login',
});

module.exports = Login;
