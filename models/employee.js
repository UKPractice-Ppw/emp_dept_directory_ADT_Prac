const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
  name: 
  {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: DataTypes.STRING,
  salary: DataTypes.INTEGER,
  Dept_id: 
  {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});


Employee.associate = (models) => {
Employee.belongsTo(models.Department, { foreignKey: 'Dept_id' });
};


module.exports = Employee;