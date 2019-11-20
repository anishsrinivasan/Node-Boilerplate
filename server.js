global.env =
  process.env.NODE_ENV === undefined ? "development" : process.env.NODE_ENV;
const PORT = 8080;

const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const HttpServer = require("http").createServer(app);

global.log = require("logger").createLogger("dev.log");
global.log.setLevel("error");

class Server {
  constructor() {
    this.drivers = [];
    this.init();
  }

  async init() {
    try {
      await this.initDrivers();

      this.initControllers();
      this.initExpress();
      this.initRoutes();
      this.initServer();
    } catch (err) {
      global.log.error(err);
    }
  }

  initExpress() {
    if (global.env === "development") {
      app.use(require("cors")());
    }

    app.use("*", (req, res, next) => {
      console.log(req.method, req.baseUrl);
      next();
    });

    //Enable request compression
    app.use(compression());
    app.use(bodyParser.json()); // to support JSON-encoded bodies
    app.use(
      bodyParser.urlencoded({
        // to support URL-encoded bodies
        extended: true
      })
    );
    app.use(express.static(__dirname + "/views", { maxAge: "30 days" }));
  }

  initServer() {
    HttpServer.listen(PORT, () => {
      console.log(`Server Running ${PORT}`);
    });
  }

  initDrivers() {
    return new Promise(async (resolve, reject) => {
      try {
        this.mysql = await require("./drivers/mysql")().connect();
        //this.mongo = require('./models/mongo')().connect();

        this.drivers.push(this.mysql);
        //this.models.push(this.mongo);

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  initControllers() {
    this.example_controller = require("./controllers/example")(
      this.mysql.connection
    );
  }

  initRoutes() {
    const authMiddleWare = require("./middlewares/auth");
    app.use(authMiddleWare);

    const exampleRouter = require("./routes/example")(this.example_controller);
    //const exampleRouter = require('./routes/example')( this.example_controller );

    app.use("/example", exampleRouter.getRouter());
    //app.use('/example', displayRouter.getRouter());
  }

  onClose() {
    //Close all DB Connections
    this.drivers.map(m => {
      m.close();
    });

    HttpServer.close();
  }
}

const server = new Server();

["SIGINT", "SIGTERM", "SIGQUIT"].forEach(eventType => {
  process.on(eventType, err => {
    global.log.error(err);
    server.onClose();
    //to avoid executing multiple times
    server.onClose = () => {};
    process.exit(-1);
  });
});
