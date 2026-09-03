const sequelize = require('./config/database');
const { Department , Employee ,Project, EmployeeProject} = require('./models');
//const Department = require('./models/department');

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Connection established.');

    //await sequelize.sync();

    const Dept1 = {
      name: 'HR', location: 'First Floor'
    }

    const Dept2 = 
    {
        name: 'IT',
        location: 'Second Floor'
    }

    const Department1 = await Department.create(Dept1);
    const Department2 = await Department.create(Dept2);

    console.log("Departments Craeted: ", Department1 , Department2);


    const emp1 = await Employee.create(
      {
        name: 'Mansi Patel',
        email: 'mspatel@gmail.com',
        salary: 12000,
        Dept_id: Department2.id
    }
    );
    const emp2 = await Employee.create(
      {
        name: 'Tisha Khandelwal',
        email: 'tkh2003@gmail.com',
        salary: 23000,
        Dept_id: Department1.id
    }
    );
    const emp3 = await Employee.create(
      {
        name: 'Hiral Maurya',
        email: 'mheer2030@gmail.com',
        salary: 120000,
        Dept_id: Department1.id
    }
    );

    const proj1 = await Project.create(
      {
        name: "Project no 1",
        deadline: "2027-05-11"
      }
    );

    const proj2 = await Project.create(
      {
        name: "Project no 2",
        deadline: "2026-11-30"
      }
    );

    await emp1.addProject(proj1, {through: { role: 'Developer', hoursAllocated: 100 }});
    await emp1.addProject(proj2, {through: { role: 'Tester', hoursAllocated: 50 }});
    await emp2.addProject(proj1, {through: { role: 'Manager', hoursAllocated: 200 }});
    await emp3.addProject(proj2, {through: { role: 'Developer', hoursAllocated: 150 }});

    const emp = await Employee.findAll({ include: Department });
    console.log(emp.map((b) => b.toJSON()));

    const empWithProjects = await Employee.findOne(
      {
        where: {id: emp1.id},
        include: [Department,Project]
      }
    );
    console.log('1 Employee with all of its projects: ',empWithProjects.toJSON());

    const projectsWithEmp = await Project.findOne(
      {
        where: {id: proj1.id},
        include: [Employee]
      }
    );
    console.log('Project with all employees: ',projectsWithEmp.toJSON());

    // Update the role of an employee in a project
    await EmployeeProject.update(
      { role: 'Lead Developer' },
      { where: { EmployeeID: emp1.id, ProjectID: proj2.id } }
    );
    // Fetch the updated employee-project relationship
    const updatedEmpProj = await EmployeeProject.findOne({
      where: { EmployeeID: emp1.id, ProjectID: proj2.id }
    });
    console.log('Employee Role Updated from tester to lead developer:', updatedEmpProj.toJSON());


    // Delete an employee-project relationship
    await EmployeeProject.destroy({
      where: { EmployeeID: emp1.id, ProjectID: proj1.id }
    });
    // Verify the deletion
    const deletedEmpProj = await EmployeeProject.findOne({
      where: { EmployeeID: emp1.id, ProjectID: proj1.id }
    });
    console.log('Employee-Project relationship deleted:', deletedEmpProj); // Should be null


  } 
  catch (err) 
  {
    console.error('Unable to connect or query:', err);
  } 
  finally 
  {
    await sequelize.close();
  }
}
main();