const mongoose = require('mongoose');

const { Schema } = mongoose;

const UsersSchema = new Schema({
  name: String,
  email: String,
  viewedArray: [],
}, { timestamps: true });

UsersSchema.methods.toJSON = function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    viewedArray: JSON.stringify(this.viewedArray),
  };
};

mongoose.model('Users', UsersSchema);
