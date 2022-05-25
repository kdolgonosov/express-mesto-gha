const User = require('../models/user');

const DefaultErrorCode = 500;
const DefaultErrorMessage = 'Ошибка сервера';
const ValidationErrorCode = 400;
const ValidationErrorMessage = 'Некорректные данные';
const CastErrorCode = 404;
const CastErrorMessage = 'Пользователь не найден';

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => {
      res.status(DefaultErrorCode).send({
        message: DefaultErrorMessage,
      });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.status(200).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(CastErrorCode).send({ message: CastErrorMessage });
      }
      res.status(DefaultErrorCode).send({ message: DefaultErrorMessage });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ValidationErrorCode)
          .send({ message: ValidationErrorMessage });
      }
      res.status(DefaultErrorCode).send({ message: DefaultErrorMessage });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(id, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ValidationErrorCode)
          .send({ message: ValidationErrorMessage });
      }
      if (err.name === 'CastError') {
        res.status(CastErrorCode).send({ message: CastErrorMessage });
      }
      res.status(DefaultErrorCode).send({ message: DefaultErrorMessage });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ValidationErrorCode)
          .send({ message: ValidationErrorMessage });
      }
      if (err.name === 'CastError') {
        res.status(CastErrorCode).send({ message: CastErrorMessage });
      }
      res.status(DefaultErrorCode).send({ message: DefaultErrorMessage });
    });
};
