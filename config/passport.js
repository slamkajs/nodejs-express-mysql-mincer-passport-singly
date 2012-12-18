var sequelize = require("sequelize")
  , LocalStrategy = require('passport-local').Strategy
  , SinglyStrategy = require('passport-singly').Strategy
  , Photo = models.Photo
  , User = models.User;
  
exports.boot = function (passport, config) {
  // require('./initializer')

  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.find({ 
      where: { id: id } 
    , include: ['Photo' ]
    }).success(function(user) {
        done(null, user)
    }).error(function(err) {
        done(err, null)
    })
  })

  // use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(fld, password, done) {
      console.error('XXX: LocalStrategy called');

      User.find({
        where: ['username=? OR email=?', fld, fld]
      }).error(function (err) {
        //console.log("ERROR: " + err);
        return done(err);
      }).success(function(user) {
        //console.log(user)
        if (!user) {
          return done(null, false, { message: 'Unknown user' })
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'Invalid password' })
        }

        return done(null, user)
      })
    }
  ))

    passport.use(new SinglyStrategy({
        clientID: config.singly.clientID,
        clientSecret: config.singly.clientSecret,
        callbackURL: config.singly.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        var p = profile;
        var cb = done;
        var token = accessToken;
        console.log('accessToken: ' + accessToken);

        User.find({ where: { singly_id: p.id } }).success(function (user) {
        
            console.log('looked for user...');
            if (!user) {
                console.log('no user found...');
          
                var newUser = User.build({
                      name: p.displayName
                    , email: p.emails[0].value
                    , provider: 'singly'
                    , singly_id: p.id
                    // , singly: JSON.stringify(p._json)
                    , accessToken: token
                });

                //update services
                //console.log(p._json.services);

                console.log('creating user...');
                // user.save().success(function() {
                //   console.log("Yay!");
                // });
                // user.save().error(function() {
                //   console.log("Boo!");
                // });
                newUser.save().success(function(user) {
                    // console.log('user.save completed, err: ' + err);

                    // if(err) return(new Error(err));

                    console.log('user saved!');

                    //download and save photo into image system
                    if(p._json.thumbnail_url && p._json.thumbnail_url.length) {
                        console.log("Has Photo: " + p._json.thumbnail_url);
                        var newPhoto = Photo.build({
                           uploadedBy: user.id
                        });

                        newPhoto.download(p._json.thumbnail_url,function(err,photopath) {
                            if(err) return cb(err,null);

                            newPhoto.process(function(err) {
                                newPhoto.presave(function(err) {
                                  if(err) throw err;

                                  newPhoto.save().success(function (photo) {
                                      user.updateAttributes({
                                          photo_id: photo.id
                                      }).success(function() {
                                          console.log("Picture saved to User record.");

                                          cb(null, user);
                                      }).error(function(err) {
                                          return cb(err,null)
                                      });
                                  }).error(function(err) {
                                      if (err) throw err;
                                  });
                              }); 
                            });
                        });
                    } else {
                        console.log("No photo to save.");

                        cb(null, user);
                    }
                }).error(function(err) {
                    return cb(err);
                });
            } else {
                console.log("User already exists...");

                user.updateAttributes({
                    accessToken: token
                }).error(function(err) {
                    cb(new Error('User found but could not save accessToken'));
                }).success(function(user) {
                    cb(null, user);
                });
            }
      })
    }
  ));
}
