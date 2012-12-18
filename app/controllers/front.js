var sequelize = require('sequelize')

exports.home = function (req, res) {
  res.render('front/home', {})
}