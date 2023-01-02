const userController = require('../controllers/user');

function Router(app) {
    app.get('/', (req, res) => {
        res.json({ok: true});
    })
   
}

module.exports = Router;