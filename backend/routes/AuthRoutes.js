const authController = require('../controllers/Controllers');
const express = require('express');

const app = express();
app.use(express.json());


app.post('/api/register', authController.registerUser);

app.post('/api/login', authController.loginUser );

module.exports = app;