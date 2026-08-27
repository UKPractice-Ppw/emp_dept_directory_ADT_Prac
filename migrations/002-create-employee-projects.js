const { DataTypes } = require('sequelize');
module.exports = {
up: 
    async ({ context: queryInterface }) => 
    {
    await queryInterface.createTable('EmployeeProject', 
    {
        id: 
        {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        EmployeeID: 
        {
            type: DataTypes.INTEGER,
            allowNull: false,
            referenes: 
            {
                model: 'employee', 
                key:'id',
            },
            onDelete: 'CASCADE',
        },
        ProjectID: 
        {
            type: DataTypes.INTEGER,
            allowNull: false,
            referenes: 
            {
                model: 'Project', 
                key:'id',
            },
            onDelete: 'CASCADE'
        },
        role: 
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hoursAllocated:
        {
            type: DataTypes.INTEGER,
        },
        createdAt: 
        {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: 
        {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });
    await queryInterface.addConstraint('EmployeeProject', {
        fields: ['EmployeeID','ProjectID'],
        type: 'unique',
        name: 'unique_emp_project'
    })
},
    down: async ({ context: queryInterface }) => 
    {
        await queryInterface.dropTable('EmployeeProject');
    },
};