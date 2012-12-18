var Photo = models.Photo
  , User = models.User;

User.belongsTo(Photo, { foreignKey: 'photo_id' })
Photo.hasOne(User, { foreignKey: 'photo_id'})
// User.hasMany(Photo, {
// 	as: 'Photos',
// 	foreignKey: 'id',
// 	joinTableName: 'Photos'
