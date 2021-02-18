const express = require('express');
const authController = require('../controllers/authController');
const authRouter = express.Router(); // The authentication router.

authRouter.route('/').post(authController.registerUser);

module.exports = authRouter;