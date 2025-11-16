const Joi = require('joi');
const BaseRequest = require('../BaseRequest');

class RegisterRequest extends BaseRequest {
  constructor() {
    const schema = Joi.object({
      name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
          'string.empty': 'Name is required',
          'string.min': 'Name must be at least 2 characters long',
          'string.max': 'Name must not exceed 50 characters',
          'any.required': 'Name is required'
        }),

      email: Joi.string()
        .email()
        .required()
        .messages({
          'string.empty': 'Email is required',
          'string.email': 'Please provide a valid email address',
          'any.required': 'Email is required'
        }),

      password: Joi.string()
        .min(6)
        .max(100)
        .required()
        .messages({
          'string.empty': 'Password is required',
          'string.min': 'Password must be at least 6 characters long',
          'string.max': 'Password must not exceed 100 characters',
          'any.required': 'Password is required'
        }),

      confirm_password: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
          'any.only': 'Passwords do not match',
          'string.empty': 'Password confirmation is required',
          'any.required': 'Password confirmation is required'
        })
    });

    super(schema);
  }
}

module.exports = RegisterRequest;