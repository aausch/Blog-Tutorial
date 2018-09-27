const mongoose = require('mongoose');
const router = require('express').Router();
const Users = mongoose.model('Users');

const config = require('./config.json');

router.get('/', (req, res, next) => {
  return Users.find()
    .then((users) => res.json({ users: users.map(user => user.toJSON()) }))
    .catch(next);
});


module.exports = router;

