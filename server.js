
var express = require('express')
  , fs = require('fs')
  , passport = require('passport')
  , path = require('path')
  , mkdirp = require("mkdirp").sync
  , photosDir = 'public/photo'
  , photoUploadPath = path.resolve(__dirname,photosDir) + '/'

// Load configurations
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var auth = require('./authorization');

// Bootstrap models
var models_path = __dirname + '/app/models'
  , model_files = fs.readdirSync(models_path);

// Bootstrap db connection
var Sequelize = require("sequelize")
  , sequelize = new Sequelize('DB_NAME_dev', 'dbUser', 'db_password')

// GET MODELS
GLOBAL.models = {};

model_files.forEach(function (file) {
  var fileExt = path.extname(file),
      fileName = path.basename(file,fileExt),
      fileNameFormatted = fileName.substring(0,1).toUpperCase() + fileName.substring(1,fileName.length);

  GLOBAL.models[fileNameFormatted] = sequelize.import(models_path + '/' + fileName.toString());
})

require('./config/models_config')

// BUILD TABLES BASED ON MODEL FILES
sequelize.sync({ force: true }).success(function(db) {
  //console.log(db);
}).error(function(err) {
  //console.log(err);
});

if (!fs.existsSync(photoUploadPath)) {
  mkdirp(photoUploadPath + '_orig');
}

// bootstrap passport config
require('./config/passport').boot(passport, config)

var app = express()// express app

require('./settings').boot(app, config, passport)         // Bootstrap application settings

// Bootstrap routes
require('./config/routes')(app, passport, auth)

// Workers can share any TCP connection
// In this case its a HTTP server
// Start the app by listening on <port>
var port = process.env.PORT || 3000
app.listen(port)