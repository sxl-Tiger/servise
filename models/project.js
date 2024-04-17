const sequelize = require("./db");
const { DataTypes} = require("sequelize");

const project = sequelize.define('project',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    allowNull:false,
    autoIncrement:true
  },
  name:{
    type:DataTypes.STRING,
    allowNull:false
  },
  owner:{
    type:DataTypes.STRING,
    allowNull:false
  },
  type:{
    type:DataTypes.STRING,
    allowNull:false
  }
},{
  createdAt:"createTime",
  updatedAt:"updateTime",
  paranoid:true
})
module.exports = project;