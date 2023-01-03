import * as express from "express";
// import * as bodyParser from "body-parser";
var Route = require("./routes/phienLamViecRouter");
const mongoose = require("mongoose");

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    // getting-started.js

    main().catch((err) => console.log(err));

    async function main() {
      const URI =
        "mongodb+srv://accban123:accban123@finixcluster0.cxck4bg.mongodb.net/asm1Nodejs?retryWrites=true&w=majority";
      await mongoose.connect(URI);
      console.log("connection to database successfully");
    }

    // Giúp chúng ta tiếp nhận dữ liệu từ body của request
    this.app.use(express.json());
    this.app.use(express.urlencoded());
    // Router
    Route(this.app);
  }
}

export default new App().app;
