const { signup, login ,refreshToken  } = require('../Controllers/AuthController');
const { signupValidation, loginValidation  } = require('../Middlewares/AuthValidation');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/refresh-token', refreshToken);

module.exports = router;