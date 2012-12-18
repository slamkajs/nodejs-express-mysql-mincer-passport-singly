// comment schema
var sequelize = require("sequelize")

module.exports = function(sequelize, DataTypes) {
    return  sequelize.define('Comment', {
        id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
      , body: {
            type : sequelize.STRING, 
            defaultValue: ''
        }
      , user: {
            type : sequelize.INTEGER, 
            defaultValue: 0
        }
})
}
