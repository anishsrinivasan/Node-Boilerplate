global.env = process.env.NODE_ENV === undefined ? 'dev' : 'prod';
const PORT = 8080;

const express = require('express');  
const app = express();
const compression = require('compression');
const bodyParser = require('body-parser');   
const HttpServer = require('http').createServer(app); 

global.log = require('logger').createLogger('dev.log');
global.log.setLevel('error');

class Server {

	constructor() {

		this.models = [];
		this.init();
	}

	async init() {

		try {

			this.initModels();

			this.initControllers();
	        this.initExpress();
	        this.initRoutes();
	        this.initServer();
		}
		catch(err) {

			global.log.error(err);
		}
	}

    initExpress() {
        
        //Enable request compression
        app.use(compression());
        app.use( bodyParser.json() );       // to support JSON-encoded bodies
        app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
          extended: true
        })); 
        app.use(express.static(__dirname + '/views', { maxAge: '30 days' })); 
    }

    initServer() {

        HttpServer.listen(PORT, ()=>{
                  
        	console.log(`Server Running ${PORT}`)

        });
    }

    initModels() {

    	return new Promise(async (resolve, reject)=>{

    		try {

				this.mysql = await require('./models/mysql')().connect();
				//this.mongo = require('./models/mongo')().connect();

				this.models.push(this.mysql);
                //this.models.push(this.mongo);

                resolve();
			}
			catch(err) {

				reject(err);
			}

    	});
	}

	initControllers() {

        this.example_controller = require('./controllers/example')( this.mysql.connection );
    }

    initRoutes() {

    	const exampleRouter = require('./routes/example')( this.example_controller );
    	//const exampleRouter = require('./routes/example')( this.example_controller );

        app.use('/example', exampleRouter.getRouter());
        //app.use('/example', displayRouter.getRouter());
    }

    onClose() {

    	//Close all DB Connections
    	this.models.map(m=>{

    		m.close();
    	});

    	HttpServer.close();
    }
}

const server = new Server();

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {

  	process.on(eventType, (err)=>{

  		server.onClose();
  		process.exit(0);
  	});
})
