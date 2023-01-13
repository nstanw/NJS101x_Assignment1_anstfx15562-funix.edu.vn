import * as jwt from "jsonwebtoken";
import UserModel from "../Models/userModel";

export default new (class jwtAuth {
  async xacThuc(req, res) {
    // Secret key for signing the JWT
    const secretKey = "mabimat";

    // Example data to be included in the JWT payload
    const payload = {
      userId: 123,
      email: "example@example.com",
    };

    // Generate a JWT
    const token = jwt.sign(payload, secretKey);
    console.log("token generated", token);

    // Verify a JWT
    jwt.verify(token, secretKey, (err: any, decoded: any) => {
      if (err) {
        console.log("Failed to verify token");
      } else {
        console.log("Token verified successfully");
        console.log(decoded);
      }
    });
    return;
  }

  // Verify a JWT token
  //- input: token
  async protect(req, res, next) {
    const secretKey = "secretKey";
    // kiểm tra requset gửi lên
    let token = req.headers.authorization;

    //kiểm tra xem có token hay không và trả về lỗi
    if (!token) {
      return res.status(401).json({ message: "401 không có quyền truy cập" });
    }

    token = token.split(" ")[1];

    // kiểm tra token tính hợp lệ của token
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "401 không có quyền truy cập" });
      }
      // lưu thông tin vào decoded
      console.log(decoded);
      req.decoded = decoded;

      next();
    });
  }

  // POST Login
  //- input: username
  //- input: password
  //- output: token
  //- output: usename
  async login(req, res) {
    const secretKey = "secretKey";
    // lấy thông tin tài khoản mật khẩu người dùng
    const { username, password } = req.body;

    //kiểm tra trên csdl có khớp không
    //nếu không báo lỗi
    UserModel.findOne({ username, password }, (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: "Thông tin đăng nhập không chính xác" });
      }

      // nếu khớp trả về token
      const payload = {
        userId: user._id,
        username: user.username,
        role: user.role,
      };

      // tạo token
      const token = jwt.sign(payload, secretKey);

      // trả về token
      return res.json([{ token: token, username, role: payload.role, userId: payload.userId }]);
    });

    //FE nhận và lưu lại gửi kèm request
  }
})();
