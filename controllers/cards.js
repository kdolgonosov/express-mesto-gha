const Card = require('../models/card');
const {
  ValidationError, // 400
  NotFoundError, // 404
  ForbiddenError, // 403
  ServerError, // 500
} = require('../errors/errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => {
      next(new ServerError());
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId, { runValidators: true })
    .then((card) => {
      if (!card) {
        return next(new NotFoundError());
      }
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError());
      }
      return res.status(200).send({ data: card });
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
      return res.status(200).send({
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
      return res.status(200).send({
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
