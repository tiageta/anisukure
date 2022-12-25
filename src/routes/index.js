import configPlayStationRoutes from "./playstation.routes.js";
import configXboxRoutes from "./xbox.routes.js";
import configEpicRoutes from "./epic.routes.js";

export default (app) => {
  configPlayStationRoutes(app);
  configXboxRoutes(app);
  configEpicRoutes(app);
};
