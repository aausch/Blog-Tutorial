var mongoose = require('mongoose');
var Schema = mongoose.Schema;



mongoose.connect('mongodb://localhost/lightblog');
mongoose.set('debug', true);

// user model
var userSchema = Schema({
  name: String,
  email: String,
  viewed: Boolean,
  viewedArray: [],
});

var User = mongoose.model('User', userSchema);

// A model
//var schema = new Schema({
//    name: String
//  , _self: { type: Schema.ObjectId, ref: 'User' }
//});
//schema.pre('init', function (next, doc, query) {
//  // hack
//  query.populate('_self');
//  next();
//});
//var A = mongoose.model('A', schema);


mongoose.connection.on('open', function () {
  // hubert@noom.com, matija@noom.com, mt@noom.com
  const u1 = new User({
    name: 'hubert',
    email:'hubert@noom.com'
  });

  const u2 = new User({
    name: 'matija',
    email:'matija@noom.com'
  });

  const u3 = new User({
    name: 'mt',
    email:'mt@noom.com'
  });

  u1.save(); u2.save(); u3.save();
  console.log('Created some users!');
  process.exit();
});


