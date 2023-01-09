class checkLogin {
  isAuth(req, res, next) {
    console.log(req.session);
    if (!req.session.user) {
      console.log("chua login");
      return res.json({ isAuth: false, url: req.url.split("/")[1] });
    }
    console.log("login thanh cong");

    next();
  }
  isAdmin(req, res, next) {
    if (req.session.role.admin === "admin") {
      return res.json({ isAuth: false });
    }
    next();
  }

  // middleware to test if authenticated
  isAuthenticated(req, res, next) {
    console.log(req.session);
    if (req.session.user) next();
    else {
      console.log("lỗi");
      next();
    }
  }
}
export default new checkLogin();
