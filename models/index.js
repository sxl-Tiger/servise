const chalk = require('chalk');
const sequelize = require('./db');

const codeModel = require('./code')
const projectModel = require('./project')
const monitorModel = require('./monitor')

projectModel.hasMany(codeModel)
codeModel.belongsTo(projectModel)

codeModel.hasMany(monitorModel)
monitorModel.belongsTo(codeModel)

sequelize.sync({alter:true}).then().then(() => {
    console.log(chalk.green('数据库连接成功!'));
})