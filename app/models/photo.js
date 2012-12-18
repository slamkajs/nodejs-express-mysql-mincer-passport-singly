// // Photo schema
var   sequelize = require("sequelize")
    , imagr = require("easyimage")
    , uuid = require("node-uuid")
    , request = require("request")
    , fs = require("fs")
    , path = require("path")
    , uploadsDir = 'public/photo/_orig'
    , photosDir = 'public/photo'
    , photoUrl = '/photo/'
    , sizes = {
        'i':{'width':30,'height':30},
        't':{'width':100,'height':100},
        'p':{'width':210,'height':210},
        'f':{'width':800,'height':600}
    };

module.exports = function(sequelize, DataTypes) {
    var Photo = sequelize.define('Photo', {
        id: {
            type : sequelize.INTEGER,
            primaryKey: true
        }
      , key: {
            type : sequelize.STRING,
            defaultValue: '00000000-0000'
        }
      , name: {
            type : sequelize.STRING, 
            defaultValue: ''
        }
      , description: {
            type : sequelize.STRING, 
            defaultValue: ''
        }
      , original: {
            type : sequelize.STRING, 
            defaultValue: ''
        }
      , extension: {
            type: sequelize.STRING, 
            defaultValue: ''
        }
      , path: {
            type: sequelize.STRING,
            defaultValue: ''
        }
        // , comments: [{type : Schema.ObjectId, ref : 'Comment'}]
      , processed: { 
            type: sequelize.BOOLEAN, 
            defaultValue: false }
      , uploadedBy: {
            type : sequelize.INTEGER, 
            allowNull: false, 
            defaultValue: 0
        }
    },
    {
        tableName: 'Photos'
      , classMethods: {}
      , instanceMethods: {
            download: function(uri,callback) {
                var self = this
                  , cb = callback;
                //var ext = path.extname(uri);

                self.name = path.basename(uri);

                console.log('');
                console.log('photo URL: ' + uri);

                request({
                    'uri':uri,
                    'method':'get',
                    'encoding':'binary'
                }, function(err, res, body){
                    var ext = path.extname(res.req.path);

                    console.log('');
                    console.log('photo req path: ' + res.req.path);
                    console.log('photo ext: ' + ext);

                    var filename = uuid.v4();
                    var filepath = path.resolve(__dirname,'../../',uploadsDir) + '/' + filename + ext;

                    self.original = uploadsDir + '/' + filename + ext;
                    self.extension = ext;

                    fs.writeFile(filepath,body,'binary',function(err) {
                        if(err) cb(err,null);
                        cb(null,self.original);
                    });

                });
            }
          , presave: function(next) {
                var sizeResp = {
                    'i':photoUrl + this.key + '_i' + this.extension,
                    'f':photoUrl + this.key + '_f' + this.extension,
                    'p':photoUrl + this.key + '_p' + this.extension,
                    't':photoUrl + this.key + '_t' + this.extension
                };

                this.path = photoUrl + this.key + '_';
                next();
            }
          , process: function(callback) {
                var cb = callback;
                var writePath = path.resolve(__dirname,'../../',photosDir) + '/';
                var sizeKeys = Object.keys(sizes);
                var tasks = sizeKeys.length;
                var self = this;
                var key = this.generateKey();

                this.key = key.toString();

                for(key in sizeKeys) {
                    fileSize = sizes[sizeKeys[key]];
                    fileName = path.resolve(__dirname,'../../',photosDir) + "/" + this.key + '_' + sizeKeys[key] + self.extension;
                    imagr.resize({
                        src:path.resolve(__dirname,'../../',this.original), 
                        dst:fileName,
                        width:fileSize['width'], 
                        height:fileSize['height']
                    }, function(err, stdout, stderr) {
                        console.log('');
                        console.log(JSON.stringify(arguments));

                        if(err || stderr) return cb(err);
                        tasks--;
                
                        if(tasks == 0) {
                            //done
                            self.processed = true;
                            console.log("Done saving photos.");
                            cb(null);
                        }
                    }); 
                }
            }
          , generateKey: function() {
                var S4 = function () {
                    return Math.floor(Math.random() * 0x10000).toString(16);
                };

                return (
                    S4() + S4() + "-" +
                    this.uploadedBy + "-" +
                    S4() + "-" +
                    S4() + "-" +
                    S4() + S4() + S4()
                );
            }
        }
    });

    return Photo;
}

// Photo.method('process',function(callback) {
//     var cb = callback;
//     var writePath = path.resolve(__dirname,'../../',photosDir) + '/';
//     var sizeKeys = Object.keys(sizes);
//     var tasks = sizeKeys.length;
//     var self = this;

//     for(key in sizeKeys) {
//         fileSize = sizes[sizeKeys[key]];
//         fileName = path.resolve(__dirname,'../../',photosDir) + "/" + this._id + '_' + sizeKeys[key] + self.extension;
//         imagr.resize({
//             src:path.resolve(__dirname,'../../',this.original), 
//             dst:fileName,
//             width:fileSize['width'], 
//             height:fileSize['height']
//         }, function(err, stdout, stderr) {
//             console.log(JSON.stringify(arguments));

//             if(err || stderr) return cb(err);
//             tasks--;
    
//             if(tasks == 0) {
//                 //done
//                 self.processed = true;
//                 console.log("Done saving photos.");
//                 cb(null);
//             }
//         }); 
//     }
// });

// PhotoSchema.method('download', function(uri,callback) {
//     var self = this
//       , cb = callback;
//     //var ext = path.extname(uri);

//     self.name = path.basename(uri);

//     console.log('photo URL: ' + uri);

//     request({
//         'uri':uri,
//         'method':'get',
//         'encoding':'binary'
//     }, function(err, res, body){
//         var ext = path.extname(res.req.path);
//         console.log('photo req path: ' + res.req.path);
//         console.log('photo ext: ' + ext);
//         var filename = uuid.v4();
//         var filepath = path.resolve(__dirname,'../../',uploadsDir) + '/' + filename + ext;

//         self.original = uploadsDir + '/' + filename + ext;
//         self.extension = ext;

//         fs.writeFile(filepath,body,'binary',function(err) {
//             if(err) cb(err,null);
//             cb(null,self.original);
//         });

//     });
// });

// // pre save hooks
// PhotoSchema.pre('save', function(next) {
//   var sizeResp = {
//     'i':photoUrl + this.id + '_i' + this.extension,
//     'f':photoUrl + this.id + '_f' + this.extension,
//     'p':photoUrl + this.id + '_p' + this.extension,
//     't':photoUrl + this.id + '_t' + this.extension
//   };

//   this.paths = sizeResp;
//   next();
// })
