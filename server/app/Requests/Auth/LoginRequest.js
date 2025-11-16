const Joi = require('joi');
const BaseRequest = require('../BaseRequest');

class LoginRequest extends BaseRequest {
  constructor() {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .required()
        .messages({
          'string.empty': 'Email is required',
          'string.email': 'Please provide a valid email address',
          'any.required': 'Email is required'
        }),

      password: Joi.string()
        .required()
        .messages({
          'string.empty': 'Password is required',
          'any.required': 'Password is required'
        })
    });

    super(schema);
  }
}

module.exports = LoginRequest;