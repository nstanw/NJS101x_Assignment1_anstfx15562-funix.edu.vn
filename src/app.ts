import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";
import * as path from "path";
import * as multer from "multer";
const phienLamViecRouter = require("./routes/phienLamViecRouter");
const nhanVienRouter = require("./routes/nhanVienRouter");
const userRouter = require("./routes/userRouter");
const covidRouter = require("./routes/covidRouter");
const nghiPhepRouter = require("./routes/nghiPhepRouter");
const quanLyRouter = require("./routes/quanLyRouter");
const mongoose = require("mongoose");
const session = require("express-session");

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    // getting-started.js

    // mở cros
    this.app.use(cors());

    //logger
    this.app.use(morgan("dev"));

    // hiện tại em mong muốn hiểu là tại sao em không truy cập được file trong public
    
    //setstatic path 
    this.app.use(express.static(path.join(__dirname, "public")));

    // cài đặt upload ảnh
    //cài đặt vị trí lưu và tên file
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "/Resource/");
      },
      filename: (req, file, cb) => {
        const fileImgName = Date.now().toString() + "-" + file.originalname;
        cb(null, fileImgName);
      },
    });

    const fileFilter = (req, file, cb) => {
      if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
      }
    };

    this.app.use(multer({ storage: storage, fileFilter: fileFilter }).single("file"));

    this.app.post("/upload", (req: any, res) => {
      console.log("/upload",req.file);

      if (!req.file) {
        return res.json({ success: false });
      }
      return res.json({ success: true });
    });

    main().catch((err) => console.log(err));

    async function main() {
      const URI = "mongodb+srv://accban123:accban123@finixcluster0.cxck4bg.mongodb.net/asm1Nodejs?retryWrites=true&w=majority";
      mongoose.set("strictQuery", true);
      await mongoose.connect(URI);
      console.log("connection to database successfully");
    }

    // Giúp chúng ta tiếp nhận dữ liệu từ body của request
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    // sử dụng session
    this.app.use(
      session({
        secret: "secret-key",
        resave: true,
        saveUninitialized: true,
      })
    );

    // Router
    phienLamViecRouter(this.app);
    nhanVienRouter(this.app);
    userRouter(this.app);
    covidRouter(this.app);
    nghiPhepRouter(this.app);
    quanLyRouter(this.app);
  }
}

export default new App().app;
