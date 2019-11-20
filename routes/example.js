const router = require("express").Router();

class ExampleRoutes {
  constructor(controller) {
    this.controller = controller;

    this.init();
  }

  init() {
    router.post("/login", async (req, res) => {
      try {
        const getUserDetails = await this.controller.login(
          req.body.username,
          req.body.password
        );

        res.json(getUserDetails);
      } catch (err) {
        global.log.error(err);
        res.json({ code: 500, msg: "An error occurred !" });
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
