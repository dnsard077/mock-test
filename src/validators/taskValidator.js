const Joi = require('joi');

const addTaskSchema = Joi.object({
  userId: Joi.number().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports = {
  addTaskSchema
};
