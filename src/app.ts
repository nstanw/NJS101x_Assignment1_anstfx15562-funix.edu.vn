import * as express from "express";
import * as cors from "cors";
const nghiPhepRouter = require("./routes/nghiPhepRouter");
const phienLamViecRouter = require("./routes/phienLamViecRouter");
const nhanVienRouter = require("./routes/nhanVienRouter");
const authRouter = require("./routes/userRouter");
const mongoose = require("mongoose");

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

    // Giúp chúng ta tiếp nhận dữ liệu từ body của request
    this.app.use(express.json());
    this.app.use(express.urlencoded());

    // Router
    phienLamViecRouter(this.app);
    phienLamViecRouter(this.app);
    nhanVienRouter(this.app);
    authRouter(this.app);
    nghiPhepRouter(this.app);
  }
}

export default new App().app;
