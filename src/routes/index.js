import configXboxRoutes from "./xbox.routes.js";
import configPlaystationRoutes from "./playstation.routes.js";

export default (app) => {
  configXboxRoutes(app);
  configPlaystationRoutes(app);
};
