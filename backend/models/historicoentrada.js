module.exports = (sequelize, DataTypes) => {
    const HistoricoEntrada = sequelize.define('HistoricoEntrada', {
        placa: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dataHora: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        img: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        idCarroRel: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    HistoricoEntrada.associate = (models) => {
        HistoricoEntrada.belongsTo(models.Carro, {
            foreignKey: 'idCarroRel',
            as: 'carro',
        });
    };

    return HistoricoEntrada;
};
