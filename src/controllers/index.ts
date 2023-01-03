// import * as user from "../models/nhanVienModel";
// const {mutipleMongooseToObject} = require('../../src/util/mongoose')
class Index {
  //[GET] /:slug/
  show(req, res, next) {
    res.send("hi new de");
  }

  //[GET] /
  index(req, res, next) {
    user
      .find({})
      .then((user) =>
        res.render("home", {
            user : mutipleMongooseToObject(user),
        })
      )
      .catch(next);
  }
}
module.exports = new Index();
