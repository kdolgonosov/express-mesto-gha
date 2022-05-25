// const path = require('path')
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '628d4531ee9d47109aabb87a',
  };

  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/mestodb');
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`Сервер запущен на порте: ${PORT}`);
  console.log(BASE_PATH);
});
