import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";
const phienLamViecRouter = require("./routes/phienLamViecRouter");
const nhanVienRouter = require("./routes/nhanVienRouter");
const userRouter = require("./routes/userRouter");
const covidRouter = require("./routes/covidRouter");
const nghiPhepRouter = require("./routes/nghiPhepRouter");
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

    main().catch((err) => console.log(err));

    async function main() {
      const URI = "mongodb+srv://accban123:accban123@finixcluster0.cxck4bg.mongodb.net/asm1Nodejs?retryWrites=true&w=majority";
      mongoose.set("strictQuery", true);
      await mongoose.connect(URI);
      console.log("connection to database successfully");
    }

    // Giúp chúng ta tiếp nhận dữ liệu từ body của request
    this.app.use(express.json());
    this.app.use(express.urlencoded());

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
  }
}

export default new App().app;
