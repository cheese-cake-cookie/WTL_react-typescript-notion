
import express from "express";

class App {
  public application: express.Application;

  constructor() {
    this.application = express();

    this.application.get("/", (req: express.Request, res: express.Response) => {
      res.send("hello");
    });
  }
}

const app = new App().application;

export default app;