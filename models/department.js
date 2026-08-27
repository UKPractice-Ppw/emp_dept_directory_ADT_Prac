const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Department = sequelize.define('Department', {
  name: 
  {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  location : DataTypes.TEXT,
});

//const Employee = require('./employee')

Department.associate = (models) => {
  Department.hasMany(models.Employee, { foreignKey: 'Dept_id', onDelete: 'CASCADE' });
};

module.exports = Department;