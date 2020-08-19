const Joi = require("@hapi/joi");
const pick = require("../utils/pick");
const logger = require("../utils/logger");

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema).validate(object, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");

    logger.Log({
      level: logger.LEVEL.ERROR,
      component: "MIDDLEWARE.VALIDATION",
      code: "MIDDLEWARE.EXAMPLE.ERROR",
      description: errorMessage,
      category: "",
      ref: {},
    });

    return res.json({ code: 422, msg: errorMessage });
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
