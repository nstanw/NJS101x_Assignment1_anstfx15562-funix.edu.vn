import userControlller from "../Controllers/userControlller";

function Router(app) {
  app.post("/user/dangKi", userControlller.dangKi);
  app.post("/user/login", userControlller.login);
  app.patch("/user/logout", userControlller.logout);
}

module.exports = Router;
