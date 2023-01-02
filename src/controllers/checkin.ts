const user = require("../models/users");
const Annual = require("../models/Annual");
const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../util/mongoose");

class UserController {
  //[get] /check-in
  checkIn(req, res, next) {
    let filter = user.findOne({ workStatus: true }, function (err, post) {
      if (post) {
        const ojb = mongooseToObject(post);
        ojb.createdAt = ojb.createdAt.toLocaleTimeString();
        ojb.bio === "khach-hang"
          ? (ojb.bio = "Khách hàng")
          : ojb.bio === "home"
          ? (ojb.bio = "Nhà riêng")
          : (ojb.bio = "Công ty");
        res.render("checkin/workStatus", ojb);
      } else {
        res.render("checkin/checkIn");
      }
    });
  }
  //[get] /check-out
  checkOut(req, res, next) {
    user.findOneAndUpdate(
      { workStatus: true },
      { workStatus: false },
      (err, doc) => {
        console.log("checkOut");
      }
    );

    const getStaff = () => {
      user
        .find({ category: "Database" })
        .then((users) => {
          const data = mutipleMongooseToObject(users);
          // filter collection check-in today
          const listCheckInToday = data.filter((user) => {
            const date = new Date();

            const todayMogo = user.createdAt.toLocaleDateString();
            const todayNow = date.toLocaleDateString();
            const plag = todayMogo === todayNow;
            // console.log(todayMogo,todayNow);
            return plag;
          });

          listCheckInToday.map((user) => {
            user.sumTime = user.updatedAt - user.createdAt;
            const milliseconds = user.sumTime;

            let seconds = Math.floor(milliseconds / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);

            minutes = minutes % 60;
            seconds = seconds % 60;

            user.sumTime = ` ${hours} giờ ${minutes} phút ${seconds}s`;

            //Convert date to hh:mm:ss format
            user.createdAt = user.createdAt.toLocaleTimeString();
            user.updatedAt = user.updatedAt.toLocaleTimeString();

            // convert placeWork
            user.bio === "cong-ty"
              ? (user.bio = "Công ty")
              : user.bio === "home"
              ? (user.bio = "Nhà riêng")
              : (user.bio = "Khách hàng");
            // console.log("user: ",user);
          });

          res.render("checkin/checkOut", {
            user: listCheckInToday,
          });
        })
        .catch(next);
    };

    getStaff();
  }
  //[post] /check-in
  postCheckIn(req, res, next) {
    const formData = req.body;
    formData.workStatus = true;
    console.log(formData);
    const checkin = new user(formData);
    checkin
      .save()
      .then(() => getCheckin())
      .catch(next);

    const getCheckin = async () => {
      user.findOne({}, {}, { sort: { createdAt: -1 } }, function (err, post) {
        const ojb = mongooseToObject(post);

        ojb.createdAt = ojb.createdAt.toLocaleTimeString();
        ojb.bio === "khach-hang"
          ? (ojb.bio = "Khách hàng")
          : ojb.bio === "home"
          ? (ojb.bio = "Nhà riêng")
          : (ojb.bio = "Công ty");
        res.render("checkin/workStatus", ojb);
      });
    };

    // const convertToTime = (createdAt) => {
    //   const date = new Date(createdAt);
    //   let hours = date.getHours();
    //   let minutes = date.getMinutes();
    //   let seconds = date.getSeconds();
    //   hours < 10 ? "0" + hours : hours;
    //   minutes < 10 ? "0" + minutes : minutes;
    //   seconds < 10 ? "0" + seconds : seconds;
    //   return `${hours}:${minutes}:${seconds}`;
    // };
  }
  //[GET] /nghi-phep
  nghiPhep(req, res, next){
    res.render("checkin/nghiPhep")
  }
  //[post] /nghi-phep
  postNghiPhep(req, res, next) {
    const formData = req.body;
    console.log(formData);
    const nghiPhep = new Annual(formData);
    nghiPhep
      .save()
      .then(() => res.send(formData))
      .catch(next);
  }
}
module.exports = new UserController();
