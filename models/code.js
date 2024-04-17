const sequelize = require("./db");
const { DataTypes } = require("sequelize");
const projectModel = require("./project");

const model = sequelize.define('code', {
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  code:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name:{
    type: DataTypes.STRING,
    allowNull: false
  },
  projectId:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: projectModel,
      key: "id"
    }
  }
}, {
  createdAt: "createTime",
  updatedAt: "updateTime",
  paranoid: true
})
module.exports = model;