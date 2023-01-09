import userModel from "../Models/userModel";
const bcryptjs = require("bcryptjs");

export default new (class UserController {
  async dangKi(req, res) {
    try {
      const { username, password } = req.body;
      console.log(req.body);

      // Hash password
      const hashedPassword = await bcryptjs.hash(password, 10);
      // Create new user
      const user = new userModel({
        username,
        password: hashedPassword,
      });
      // Save user to database
      await user.save();
      res.send({ message: "Đăng ký thành công!" });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      let user = await userModel.findOne({ username });

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      //check password
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Password not match" });
      }

      req.session.regenerate(function (err) {
        if (err) next(err);

        //login thành công
        req.session.user = user;
        req.session.isLoggedIn = true;

        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
          if (err) return next(err);
          res.json({ mess: "Đăng nhập thành công" });
        });
      });

      return;
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async logout(req, res) {
    try {
      console.log(req.session);
      if (req.session) {
        //delete session
        req.session.destroy((err) => {
          if (err) {
            return res.status(500).json(err);
          }
          console.log(req.session);
          return res.json({ destroy: true });
        });
      }
    } catch (error) {}
  }
})();
