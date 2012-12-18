// user schema
var sequelize = require("sequelize")
  , crypto = require('crypto')
  , _ = require('underscore')
  , authTypes = ['singly'];

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
        , name: { 
            type: sequelize.STRING
          , validate: {
                notEmpty: true
            }
        }
        , email: { 
            type: sequelize.STRING 
          , validate: {
                notEmpty: true
            }
        }
        , username: { 
            type: sequelize.STRING
          , validate: {
                notEmpty: true
            }
        }
        , photo_id: {
            type: sequelize.INTEGER, 
            defaultValue: null
        }
        , provider: { 
            type: sequelize.STRING 
        }
        , hashed_password: { 
            type: sequelize.STRING 
          , validate: {
                notEmpty: true
            }
        }
        , salt: { 
            type: sequelize.STRING 
        }
        // , facebook: {}
        // , twitter: {}
        // , google: {}
        , singly_id: {
            type: sequelize.INTEGER
        }
        , singly: { 
            type: sequelize.STRING 
        }
        , accessToken: { 
            type: sequelize.STRING 
        }
        // , following: []
        // , followers: []
        , objectType: { 
            type: sequelize.STRING, 
            defaultValue: 'person' 
        }
        , approved: { 
            type: sequelize.BOOLEAN, 
            defaultValue:false 
        }
    },
    {
        _password: ''
      , classMethods: {}
      , instanceMethods: {
            authenticate: function(plainText) {
                return this.encryptPassword(plainText) === this.hashed_password;
            },
            encryptPassword: function(password) {
                return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
            },
            getPassword: function() {
              return this._password;
            },
            makeSalt: function() {
                return Math.round((new Date().valueOf() * Math.random())) + '';
            },
            markApproved: function(plainText) {
                return this.encryptPasword(plainText) === this.hashed_password;
            },
            setPassword: function(password) {
              this._password = password;
              this.salt = this.makeSalt();
              this.hashed_password = this.encryptPassword(password);
            },
            validatePresenceOf: function(value) {
                return value && value.length;
            }
        }
    });

    return User;
}

  // UserSchema.index({ email:1 });
  // UserSchema.index({ "singly_id":1 });

  // virtual attributes
  // UserSchema
  //   .virtual('password')
  //   .set(function(password) {
  //     this._password = password
  //     this.salt = this.makeSalt()
  //     this.hashed_password = this.encryptPassword(password)
  //   })
  //   .get(function() { return this._password })

  // validations
  // var validatePresenceOf = function (value) {
  //   return value && value.length
  // }

  // the below 4 validations only apply if you are signing up traditionally
  // UserSchema.path('name').validate(function (name) {
  //   // if you are authenticating by any of the oauth strategies, don't validate
  //   if (authTypes.indexOf(this.provider) !== -1) return true
  //   return name.length
  // }, 'Name cannot be blank')

  // UserSchema.path('email').validate(function (email) {
  //   // if you are authenticating by any of the oauth strategies, don't validate
  //   if (authTypes.indexOf(this.provider) !== -1) return true
  //   return email.length
  // }, 'Email cannot be blank')

  // UserSchema.path('username').validate(function (username) {
  //   // if you are authenticating by any of the oauth strategies, don't validate
  //   if (authTypes.indexOf(this.provider) !== -1) return true
  //   return username.length
  // }, 'Username cannot be blank')

  // UserSchema.path('hashed_password').validate(function (password) {
  //   // if you are authenticating by any of the oauth strategies, don't validate
  //   if (authTypes.indexOf(this.provider) !== -1) return true

  //   if(!this._password || !this._password.length) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }, 'Password cannot be blank')

  // pre save hooks
  // UserSchema.pre('save', function(next) {
  //   if (!this.isNew) return next()

  //   next()
  // })

  // // methods
  // UserSchema.method('markApproved', function(plainText) {
  //   return this.encryptPassword(plainText) === this.hashed_password
  // })

  // UserSchema.method('authenticate', function(plainText) {
  //   return this.encryptPassword(plainText) === this.hashed_password
  // })




  // UserSchema.method('makeSalt', function() {
  //   return Math.round((new Date().valueOf() * Math.random())) + ''
  // })

  // UserSchema.method('encryptPassword', function(password) {
  //   return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
  // })
