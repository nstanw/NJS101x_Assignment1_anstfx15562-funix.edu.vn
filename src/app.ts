import * as express from "express";
import * as cors from "cors";
const phienLamViecRouter = require("./routes/phienLamViecRouter");
const nhanVienRouter = require("./routes/nhanVienRouter");
const authRouter = require("./routes/userRouter");
const quanLyRouter = require("./routes/quanLyRouter");
const mongoose = require("mongoose");
import * as morgan from "morgan";
import * as path from "path";
import * as multer from "multer";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    // getting-started.js

    // mở cros
    const corsOptions = {
      origin: "http://localhost:3000",
      credentials: true, //access-control-allow-credentials:true
      optionSuccessStatus: 200,
    };
    this.app.use(cors(corsOptions));

    main().catch((err) => console.log(err));

    async function main() {
      const URI = "mongodb+srv://accban123:accban123@finixcluster0.cxck4bg.mongodb.net/asm1Nodejs?retryWrites=true&w=majority";
      await mongoose.connect(URI);
      console.log("connection to database successfully");
    }

     //logger
     this.app.use(morgan("dev"));

      //setstatic path
    this.app.use("/Resource/images", express.static(path.join(__dirname, "../Resource/images")));
    console.log(path.join(__dirname, "../Resource"));

    // cài đặt upload ảnh
    //cài đặt vị trí lưu và tên file
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../Resource/images"));
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
      console.log("/upload", req.file);

      if (!req.file) {
        return res.json({ success: false });
      }
      return res.json({ path: req.file.path });
    });


    // Giúp chúng ta tiếp nhận dữ liệu từ body của request
    this.app.use(express.json());
    this.app.use(express.urlencoded());

    // Router 
    phienLamViecRouter(this.app);
    nhanVienRouter(this.app);
    authRouter(this.app);
    quanLyRouter(this.app);
  }
}

export default new App().app;
