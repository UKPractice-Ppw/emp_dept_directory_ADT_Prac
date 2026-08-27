const sequelize = require('./config/database');
const { Department , Employee } = require('./models');
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


    await Employee.create(
      {
        name: 'Mansi Patel',
        email: 'mspatel@gmail.com',
        salary: 12000,
        Dept_id: Department2.id
    }
    );
    await Employee.create(
      {
        name: 'Tisha Khandelwal',
        email: 'tkh2003@gmail.com',
        salary: 23000,
        Dept_id: Department1.id
    }
    );
    await Employee.create(
      {
        name: 'Hiral Maurya',
        email: 'mheer2030@gmail.com',
        salary: 120000,
        Dept_id: Department1.id
    }
    );

    const emp = await Employee.findAll({ include: Department });
    console.log(emp.map((b) => b.toJSON()));
  } catch (err) 
  {
    console.error('Unable to connect or query:', err);
  } finally 
  {
    await sequelize.close();
  }
}
main();