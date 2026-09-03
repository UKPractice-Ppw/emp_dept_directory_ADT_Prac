const { DataTypes } = require('sequelize');
module.exports = {
up: 
    async ({ context: queryInterface }) => 
    {
    await queryInterface.addColumn('Projects', 'status',
    {
            type: DataTypes.STRING,
            defaultValue: 'active',
            allowNull: true
    });
},
    down: async ({ context: queryInterface }) => 
    {
        await queryInterface.removeColumn('Projects', 'status');
    },
};