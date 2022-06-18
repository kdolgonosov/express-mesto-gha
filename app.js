const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, Joi, celebrate } = require('celebrate');
const helmet = require('helmet');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { urlRegex } = require('./constants/regex');
const NotFoundError = require('./errors/notFoundError');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/mestodb');

// app.post(
//   '/signin',
//   celebrate({
//     body: Joi.object().keys({
//       email: Joi.string().required().email(),
//       password: Joi.string().required(),
//     }),
//   }),
//   login,
// );
// app.post(
//   '/signup',
//   celebrate({
//     body: Joi.object().keys({
//       name: Joi.string().min(2).max(30),
//       about: Joi.string().min(2).max(30),
//       avatar: Joi.string().pattern(urlRegex),
//       email: Joi.string().required().email(),
//       password: Joi.string().required(),
//     }),
//   }),
//   createUser,
// );

// app.use(auth);
// app.use('/', require('./routes/users'));
// app.use('/', require('./routes/cards'));

// app.use('*', (req, res, next) => {
//   next(new NotFoundError('Страница не найдена'));
// });
app.use('*', router);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порте: ${PORT}`);
});
