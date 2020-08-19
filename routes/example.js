const router = require("express").Router();
const validate = require("../middlewares/validate");
const exampleValidation = require("../validations/example-validation");

class ExampleRoutes {
  constructor(usecase) {
    this.usecase = usecase;
    this.init();
  }

  init() {
    router.post(
      "/login",
      validate(exampleValidation.loginUser),
      async (req, res) => {
        try {
          const getUserDetails = await this.usecase.login(
            req.body.username,
            req.body.password
          );
          res.json(getUserDetails);
        } catch (err) {
          res.json({
            code: 500,
            msg: "An error occurred !",
            err: err.toString(),
          });
        }
        res.end();
      }
    );

    router.get("/", (req, res) => {
      res.json({ code: 200, msg: "Success !" });
      res.end();
    });
  }

  getRouter() {
    return router;
  }
}

module.exports = (usecase) => {
  return new ExampleRoutes(usecase);
};
