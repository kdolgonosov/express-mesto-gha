const router = require('express').Router();
const Card = require('../models/card');
const {
  getCards,
  deleteCardById,
  createCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/:userId', createCard);
router.delete('/', deleteCardById);

module.exports = router;
