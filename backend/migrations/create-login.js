module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('login', {
      idlogin: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      usuario: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      senha: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false,
      },
      resetToken: {
        type: Sequelize.STRING(255),
        allowNull: true, // Permite valores nulos
      },
      resetTokenExpire: {
        type: Sequelize.BIGINT,
        allowNull: true, // Permite valores nulos
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('login');
  },
};
