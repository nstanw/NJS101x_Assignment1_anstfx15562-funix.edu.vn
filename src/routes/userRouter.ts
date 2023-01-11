import authController from "../Controllers/userController";

function Router(app) {
   app.post('/user/login', authController.login) 
}

module.exports = Router;