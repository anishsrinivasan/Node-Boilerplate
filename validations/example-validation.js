const Joi = require("@hapi/joi");
const Joi = require("@hapi/joi");

const loginUser = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  loginUser,
};
