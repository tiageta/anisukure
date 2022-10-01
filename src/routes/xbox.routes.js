import xboxController from "../controllers/xbox.controller.js";

export default (app) => {
  app.route("/api/xbox").get(xboxController.search);
};
