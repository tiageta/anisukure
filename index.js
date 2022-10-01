import customApp from "./src/config/app.js";
import configRouter from "./src/routes/index.js";
import startServer from "./src/server/index.js";

// Create app instance
const app = customApp();

// Configure all routes
configRouter(app);

// Start server
startServer(app);
