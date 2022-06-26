const Card = require('../models/card');
const ValidationError = require('../errors/validationError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const ServerError = require('../errors/serverError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ cards }))
    .catch(() => {
      next(new ServerError());
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => next(new NotFoundError()))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError());
      }
      return card.remove()
        .then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError());
      }
      return next(new ServerError());
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({
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
        return next(new ValidationError());
      }
      return next(new ServerError());
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError());
      }
      return res.send({
        name: card.name,
        link: card.link,
        owner: card.owner,
        likes: card.likes,
        createdAt: card.createdAt,
        _id: card._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError());
      }
      return next(new ServerError());
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError());
      }
      return res.send({
        name: card.name,
        link: card.link,
        owner: card.owner,
        likes: card.likes,
        createdAt: card.createdAt,
        _id: card._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError());
      }
      return next(new ServerError());
    });
};
