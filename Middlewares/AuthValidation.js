const Joi = require('joi');

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required().messages({
            'string.base': 'Name must be a string.',
            'string.empty': 'Name is required.',
            'string.min': 'Name must be at least 3 characters long.',
            'string.max': 'Name cannot be longer than 100 characters.',
        }),
        email: Joi.string().email().required().messages({
            'string.base': 'Email must be a string.',
            'string.empty': 'Email is required.',
            'string.email': 'Email must be a valid email address.',
        }),
        password: Joi.string().min(4).max(100).required().messages({
            'string.base': 'Password must be a string.',
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least 4 characters long.',
            'string.max': 'Password cannot be longer than 100 characters.',
        }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'any.only': 'Passwords must match.',
            'string.empty': 'Confirm Password is required.',
        })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        // Map each error to a specific message
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ message: "Bad request", errors: errorMessages });
    }
    next();
}

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.base': 'Email must be a string.',
            'string.empty': 'Email is required.',
            'string.email': 'Email must be a valid email address.',
        }),
        password: Joi.string().min(8).max(100).required().messages({
            'string.base': 'Password must be a string.',
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least 8 characters long.',
            'string.max': 'Password cannot be longer than 100 characters.',
        })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ message: "Bad request", errors: errorMessages });
    }
    next();
}

module.exports = {
    signupValidation,
    loginValidation
}
