const Card = require('../models/card');

const DefaultErrorCode = 500;
const DefaultErrorMessage = 'Ошибка сервера';
const ValidationErrorCode = 400;
const ValidationErrorMessage = 'Некорректные данные';
const NotFoundErrorCode = 404;
const NotFoundErrorMessage = 'Пользователь не найден';

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
    .then((card) => {
      if (!card) {
        return res
          .status(NotFoundErrorCode)
          .send({ message: NotFoundErrorMessage });
      }
      return res.status(200).send({ data: card });
    })
    .catch(() => {
      res.status(DefaultErrorCode).send({ message: DefaultErrorMessage });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send({
        name: card.name,
        link: card.link,
        owner: card.owner,
        likes: card.likes,
        createdAt: card.createdAt,
        _id: card._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ValidationErrorCode)
          .send({ message: ValidationErrorMessage });
      }
      return res.status(DefaultErrorCode).send({ message: DefaultErrorCode });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(NotFoundErrorCode)
          .send({ message: NotFoundErrorMessage });
      }
      return res.status(200).send({ data: card });
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

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(NotFoundErrorCode)
          .send({ message: NotFoundErrorMessage });
      }
      return res.status(200).send({ data: card });
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
