const express = require('express');
const goalsController = require('../controllers/goalsController');
const goalRouter = express.Router();

goalRouter.route('/').get(goalsController.getAllGoals).post(goalsController.createGoal).delete(goalsController.deleteGoals);
goalRouter.route('/:id').get(goalsController.getGoalByID).patch(goalsController.editGoal).delete(goalsController.deleteGoalByID);

module.exports = goalRouter;