// models/login.js
module.exports = (sequelize, DataTypes) => {
  const Login = sequelize.define('Login', {
    idlogin: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    resetToken: {
      type: DataTypes.STRING(255),
    },
    resetTokenExpire: {
      type: DataTypes.BIGINT,
    },
  }, {
    tableName: 'login', // Nome da tabela
    timestamps: false, // Ajuste se estiver usando timestamps
  });

  Login.associate = function(models) {
    // Defina associações, se houver
    // Exemplo: Login.hasMany(models.Token, { foreignKey: 'userId' });
  };

  return Login;
};
