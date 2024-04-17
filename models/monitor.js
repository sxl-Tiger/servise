const sequelize = require("./db");
const { DataTypes} = require("sequelize");
const codeModel = require("./code");
const monitor = sequelize.define('monitor',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    allowNull:false,
    autoIncrement:true
  },
  info: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  msg:{
    type:DataTypes.STRING,
    allowNull:false
  },
  uid:{
    type:DataTypes.STRING,
    allowNull:true
  },
  codeId:{
    type:DataTypes.INTEGER,
    allowNull:false,
    references:{
      model:codeModel,
      key:"id"
    }
  },
},{
  createdAt:"createTime",
  updatedAt:"updateTime",
  paranoid:true,
  // freezeTableName: true,
  timestamps:true,
})
module.exports = monitor;