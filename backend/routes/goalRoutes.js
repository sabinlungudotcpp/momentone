const express = require('express');
const goalsController = require('../controllers/goalsController');
const goalRouter = express.Router();

goalRouter.route('/').get(goalsController.getAllGoals);

module.exports = goalRouter;