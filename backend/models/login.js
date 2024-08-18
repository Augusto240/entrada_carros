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
  });

  Login.associate = function(models) {
    // Defina associações, se houver
  };

  return Login;
};
