class checkLogin {
  isAuth(req, res, next) {
    console.log(req.url);
    if (!req.session.IsLoggedIn && !req.session.user) {
      return res.json({ isAuth: false, url: req.url.split('/')[1]});
    }
    next();
  }
  isAdmin(req, res, next) {
    if (req.session.role.admin === "admin") {
      return res.json({ isAuth: false });
    }
    next();
  }
}
export default new checkLogin();