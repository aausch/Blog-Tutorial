const mongoose = require('mongoose');
const router = require('express').Router();
const nodemailer = require('nodemailer');
const Articles = mongoose.model('Articles');
const Users = mongoose.model('Users');

const config = require('./config.json');

const transporter = nodemailer.createTransport({
  service: config.mail_service,
  auth: {
    user: config.mail_username,
    pass: config.mail_password
  }
});

const recordOpened = (email, id) => {
  const users = Users.find(
    { 'email': email },
    (err, users) => {
      users.map(user => {
        if (!user.viewedArray.includes(id)) {
          user.viewedArray.push(id);
          user.save();
        }
      });
    }
  );
}

const sendArticle = (id, target_email) => {

  var mailOptions = {
    from: 'noreply-internalmailer@noom.com',
    to: target_email,
    subject: 'There\'s a new article for you to read!',
    text: `http://localhost:8080/view/{id}?read_by={target_email}`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

router.post('/', (req, res, next) => {
  const { body } = req;

  if(!body.title) {
    return res.status(422).json({
      errors: {
        title: 'is required',
      },
    });
  }

  if(!body.author) {
    return res.status(422).json({
      errors: {
        author: 'is required',
      },
    });
  }

  if(!body.body) {
    return res.status(422).json({
      errors: {
        body: 'is required',
      },
    });
  }

  const finalArticle = new Articles(body);
  return finalArticle.save()
    .then(() => res.json({ article: finalArticle.toJSON() }))
    .catch(next);
});

router.get('/', (req, res, next) => {
  return Articles.find()
    .sort({ createdAt: 'descending' })
    .then((articles) => res.json({ articles: articles.map(article => article.toJSON()) }))
    .catch(next);
});

router.param('id', (req, res, next, id) => {
  return Articles.findById(id, (err, article) => {
    if(err) {
      return res.sendStatus(404);
    } else if(article) {
      req.article = article;
      return next();
    }
  }).catch(next);
});

router.get('/:id', (req, res, next) => {
  return res.json({
    article: req.article.toJSON(),
  });
});

router.post('/sendmail', (req, res, next) => {
  sendArticle(req.body.email, req.body.id);
  return res.json({
    id: req.body.id,
  });
});

router.post('/recordviewed', (req, res, next) => {
  recordOpened(req.body.email, req.body.id);
  return res.json({
    id: req.id,
  });
});

router.patch('/:id', (req, res, next) => {
  const { body } = req;

  if(typeof body.title !== 'undefined') {
    req.article.title = body.title;
  }

  if(typeof body.author !== 'undefined') {
    req.article.author = body.author;
  }

  if(typeof body.body !== 'undefined') {
    req.article.body = body.body;
  }

  return req.article.save()
    .then(() => res.json({ article: req.article.toJSON() }))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  return Articles.findByIdAndRemove(req.article._id)
    .then(() => res.sendStatus(200))
    .catch(next);
});

module.exports = router;
