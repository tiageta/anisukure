import playstationController from "../controllers/playstation.controller.js";

export default (app) => {
  app.route("/api/playstation").get(playstationController.search);
};
