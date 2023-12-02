const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  pin: Joi.string().length(6).required(),
  name: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  pin: Joi.string().length(6).required(),
});

module.exports = {
  registerSchema, loginSchema
};
