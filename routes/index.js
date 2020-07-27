const express = require('express');
const authenticationRouter = new express.Router();
const User = require('./../models/user');
const bcrypt = require('bcryptjs');
const routeAuthenticationGuard = require('./../middleware/route-authentication-guard');

authenticationRouter.get('/sign-up', (req, res, next) => {
  res.render('../views/authentication/sign-up.hbs');
});

authenticationRouter.post('/sign-up', (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then(hashAndSalt => {
      return User.create({
        name,
        email,
        passwordHashAndSalt: hashAndSalt
      });
    })
    .then(user => {
      req.session.userId = user._id;
      res.redirect('/authentication/private');
    })
    .catch(error => {
      res.render('../views/authentication/sign-up', { error });
    });
});

authenticationRouter.get('/sign-in', (req, res, next) => {
  res.render('../views/authentication/sign-in.hbs');
});

authenticationRouter.post('/sign-in', (req, res, next) => {
  const { email, password } = req.body;
  let user;

  User.findOne({ email })
    .then(document => {
      user = document;
      if (!user) {
        return Promise.reject(new Error('No user with that email.'));
      }
      const passwordHashAndSalt = user.passwordHashAndSalt;
      return bcrypt.compare(password, passwordHashAndSalt);
    })
    .then(comparison => {
      if (comparison) {
        req.session.userId = user._id;

        res.redirect('/authentication/private');
      } else {
        const error = new Error('Password did not match.');

        return Promise.reject(error);
      }
    })
    .catch(error => {
      res.render('authentication/sign-in', { error: error });
    });
});

authenticationRouter.get(
  '/private',
  routeAuthenticationGuard,
  (req, res, next) => {
    res.render('private.hbs');
  }
);

authenticationRouter.get(
  '/main',
  routeAuthenticationGuard,
  (req, res, next) => {
    res.render('main.hbs');
  }
);

authenticationRouter.post('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/authentication/sign-in');
});

authenticationRouter.get('/', (req, res, next) => {
  res.render('index');
});

authenticationRouter.get('/profile/:id/edit', (req, res, next) => {
  const id = req.session.userId;

  User.findById(id)
    .then(data => {
      res.render('edit', { data });
    })
    .catch(error => {
      next(error);
    });
});

authenticationRouter.post('/profile/:id/edit', (req, res, next) => {
  const id = req.session.userId;

  User.findByIdAndUpdate(id, {
    name: req.body.name
  })
    .then(data => {
      res.render('profile', { data });
    })
    .catch(error => {
      next(error);
    });
});

authenticationRouter.get('/profile/:id', (req, res, next) => {
  const id = req.session.userId;

  User.findById(id)
    .then(data => {
      res.render('profile', { data });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = authenticationRouter;
