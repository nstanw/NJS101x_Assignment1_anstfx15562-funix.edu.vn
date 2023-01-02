import nhanVienModel = require("../models/nhanVienModel");
import { mutipleMongooseToObject, mongooseToObject, } from "../util/mongoose";

class NhanVien {

  //[post] /users.checkin
  checkin(req, res, next) {
    const formData = req.body;
    formData.workStatus = true;
    console.log(formData);
    const checkin = new user(formData);
    checkin
      .save()
      .then(() => getCheckin())
      .catch(next);

    const getCheckin = () => {
      user.find({ category: "Database" })
        .then((user) => {
          console.log("Database Courses:");
          console.log(user);
          res.render('checkin/checkInInfor', {
            user: mutipleMongooseToObject(user),
          });
        })
        .catch(next);
    }

  }




  getUsers(req, res, next) {
    user
      .find({})
      .then((user) =>
        res.render("home", {
          user: mutipleMongooseToObject(user),
        })
      )
      .catch(next);
  }

  getSlug(req, res, next) {
    //sau params neu :name thi params.name
    //  user.find({}).then(user => res.send('slug_ ' + req.params.slug)).catch(next);

    // return document to mongoose
    // user.findOne({slug: req.params.slug}).then(user => res.render('detailMongo',{
    //   user: mongooseToObject(user),
    // })).catch(next);

    user
      .findOne({ slug: "nha-rieng" })
      .then((user) =>
        res.send({
          user: mongooseToObject(user),
        })
      )
      .catch(next);
  }

  check(req, res, next) {
    res.render("home");
  }


}
const nhanVienController = new NhanVien();
export = nhanVienController;
