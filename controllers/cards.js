const Card = require('../models/card');

const DefaultErrorCode = 500;
const DefaultErrorMessage = 'Ошибка сервера';
const ValidationErrorCode = 400;
const ValidationErrorMessage = 'Некорректные данные';
const CastErrorCode = 404;
const CastErrorMessage = 'Карточка не найдена';

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => {
      res.status(DefaultErrorCode).send({
        message: DefaultErrorMessage,
      });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(CastErrorCode).send({ message: CastErrorMessage });
      }
      res.status(DefaultErrorCode).send({ message: DefaultErrorMessage });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ValidationErrorCode)
          .send({ message: ValidationErrorMessage });
      }
      res.status(DefaultErrorCode).send({ message: DefaultErrorCode });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => res.status(200).send({ data: card }))
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

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => res.status(200).send({ data: card }))
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
