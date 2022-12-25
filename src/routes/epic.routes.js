import epicController from "../controllers/epic.controller.js";

export default (app) => {
  app.route("/api/epic").get(epicController.search);
};
