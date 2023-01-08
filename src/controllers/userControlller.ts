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
    console.log("req.bod",req.body);
    
    try {
      const { username, password } = req.body;
      let user = await userModel.findOne({ username });
      console.log(user);

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
      //check password
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Password not match" });
      }
      //login thành công
      req.session.user = user;
      req.session.isLoggedIn = true;
      console.log(req.session);
      return req.session.save(() => {
        res.json({ mess: "Đăng nhập thành công" });
        // res.redirect("/");
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async logout(req, res) {
    try {
      console.log( req.session);
      if (req.session) {
        //delete session
        req.session.destroy((err) => {
          if (err) {
            return res.status(500).json(err);
          }
          console.log( req.session);
          return res.json({ destroy: true });
          
        });
      }
    } catch (error) {}
  }
})();
