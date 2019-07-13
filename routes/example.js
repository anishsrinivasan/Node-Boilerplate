const router = require('express').Router();
const jwt = require('../services/jwt');

class ExampleRoutes {

	constructor(controller) {

		this.controller = controller;

		this.init();
	}

	init() {

		router.use('/', async (req, res, next)=>{

			if(req.path === '/login') {

				next();
				return;
			}

			try {

				const token = req.headers['x-access-token'];

				if(token === undefined) {

					res.json({ code: 403, msg: 'Access Denied' });
					res.end();
					return;
				}
				else {

					const decoded = await jwt.verify(token);

					if(decoded.role !== 'ADMIN') {

						res.json({ code: 403, msg: 'Access Denied' });
						res.end();
						return;
					}
				}

			}
			catch(err) {

				res.json({ code: 403, msg: 'Access Denied' });
				res.end();
				return;
			}
			
			next();
			    
		});

		router.post('/login', async (req, res)=>{

			try {

				const response = await this.controller.login(req.body.username, req.body.password);
				res.json(response);
			}
			catch(err) {

				global.log.error(err);
				res.json({code: 500, msg: 'An error occurred !'});
			}

			res.end();

		});
	}

	getRouter() {

		return router;
	}
}

module.exports = ( controller ) => { return new ExampleRoutes( controller ) }
