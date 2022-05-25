const User = require('../models/user');

const DefaultErrorCode = 500;
const DefaultErrorMessage = 'Ошибка сервера';
const ValidationErrorCode = 400;
const ValidationErrorMessage = 'Некорректные данные';
const NotFoundErrorCode = 404;
const NotFoundErrorMessage = 'Пользователь не найден';

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
      if (!user) {
        return res
          .status(NotFoundErrorCode)
          .send({ message: NotFoundErrorMessage });
      }
      return res.status(200).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        return res
          .status(ValidationErrorCode)
          .send({ message: ValidationErrorMessage });
      }
      return res
        .status(DefaultErrorCode)
        .send({ message: DefaultErrorMessage });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
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
        return res
          .status(ValidationErrorCode)
          .send({ message: ValidationErrorMessage });
      }
      return res
        .status(DefaultErrorCode)
        .send({ message: DefaultErrorMessage });
    });
};

module.exports.updateUserInfo = (req, res) => {
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
        return res
          .status(ValidationErrorCode)
          .send({ message: ValidationErrorMessage });
      }
      if (err.name === 'CastError') {
        return res
          .status(NotFoundErrorCode)
          .send({ message: NotFoundErrorMessage });
      }
      return res
        .status(DefaultErrorCode)
        .send({ message: DefaultErrorMessage });
    });
};

module.exports.updateUserAvatar = (req, res) => {
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
        return res
          .status(ValidationErrorCode)
          .send({ message: ValidationErrorMessage });
      }
      if (err.name === 'CastError') {
        return res
          .status(NotFoundErrorCode)
          .send({ message: NotFoundErrorMessage });
      }
      return res
        .status(DefaultErrorCode)
        .send({ message: DefaultErrorMessage });
    });
};
