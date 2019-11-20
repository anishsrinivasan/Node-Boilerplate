const router = require("express").Router();
const Joi = require("@hapi/joi");

class ExampleRoutes {
  constructor(controller) {
    this.controller = controller;

    this.init();
  }

  init() {
    router.post("/login", async (req, res) => {
      try {
        const schema = {
          username: Joi.string().required(),
          password: Joi.string().required()
        };

        const username = req.body.username;
        const password = req.body.password;

        const isValid = Joi.validate(
          {
            username: username,
            password: password
          },
          schema
        );

        if (isValid.error !== null) {
          throw isValid.error;
        }

        const getUserDetails = await this.controller.login(
          req.body.username,
          req.body.password
        );

        res.json(getUserDetails);
      } catch (err) {
        if (err.name === "ValidationError") {
          res.json({ code: 422, msg: err.details[0].message });
        } else {
          global.log.error(err);
          res.json({ code: 500, msg: "An error occurred !" });
        }
      }

      res.end();
    });

    router.get("/", (req, res) => {
      res.json({ code: 200, msg: "Success !" });
      res.end();
    });
  }

  getRouter() {
    return router;
  }
}

module.exports = controller => {
  return new ExampleRoutes(controller);
};
