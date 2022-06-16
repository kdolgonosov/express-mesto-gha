// const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ValidationError, //400
  BadTokenError, //401
  NotFoundError, //404
  NotUniqueEmailError, //409
  ServerError, //500
} = require('../errors/errors');
// const DefaultErrorCode = 500;
// const DefaultErrorMessage = 'Ошибка сервера';
// const ValidationErrorCode = 400;
// const ValidationErrorMessage = 'Некорректные данные';
// const NotFoundErrorCode = 404;
// const NotFoundErrorMessage = 'Пользователь не найден';

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => next(new ServerError()));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError());
      }
      return res.status(200).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError());
      }
      return next(new ServerError());
    });
};

module.exports.createUser = (req, res, next) => {
  // eslint-disable-next-line object-curly-newline
  const { email, password, name, about, avatar } = req.body;
  bcrypt
    .hash(password, 10)
    .then(
      (hash) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        User.create({
          email,
          password: hash,
          name,
          about,
          avatar,
        }),
      // eslint-disable-next-line function-paren-newline
    )
    .then((user) => {
      res.status(200).send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError());
      }
      if (err.code === 11000) {
        return next(new NotUniqueEmailError());
      }
      return next(new ServerError());
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(200).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError());
      }
      if (err.name === 'CastError') {
        return next(new NotFoundError());
      }
      return next(new ServerError());
    });
};
module.exports.getCurrentUserInfo = (req, res, next) => {
  const id = req.user._id;
  User.findById(id).then((user) => {
    if (!user) {
      return next(new NotFoundError());
    }
    return res.status(200).send({
      email: user.email,
      password: user.password,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    });
  });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true })
    .then((user) => {
      res.status(200).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError());
      }
      if (err.name === 'CastError') {
        return next(new NotFoundError());
      }
      return next(new ServerError());
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'very-stronk-secret', {
        expiresIn: '7d',
      });

      res.send({ token });
    })
    .catch(() => next(new BadTokenError('Неверные почта или пароль')));
};
