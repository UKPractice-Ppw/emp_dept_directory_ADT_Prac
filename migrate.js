require('dotenv').config();
const { Umzug, SequelizeStorage } = require('umzug');
const sequelize = require('./config/database');
const umzug = new Umzug(
    {
        migrations: { glob: 'migrations/*.js' },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: console,
    });
async function main() 
{
    const command = process.argv[2];
    if (command === 'up') 
    {
        await umzug.up();
        console.log('Migrations applied.');
    } 
    else if (command === 'down') 
    {
        await umzug.down();
        console.log('Last migration reverted.');
    } 
    else 
    {
        console.log('Usage: node migrate.js <up|down>');
    }
    await sequelize.close();
}
main();