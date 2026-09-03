const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Project = sequelize.define('Project', {
name: {
type: DataTypes.STRING,
allowNull: false,
},
deadline: DataTypes.DATEONLY,
});
Project.associate = (models) => {
Project.belongsToMany(models.Employee, {
through: models.EmployeeProject,
foreignKey: 'ProjectID',
otherKey: 'EmployeeID',
});
};
module.exports = Project;