const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const { PORT } = require("./config");
const logger = require("./utils/logger");
const productsRoutes = require("./routing/products");
const logoutRoutes = require("./routing/logout");
const killRoutes = require("./routing/kill");
const homeRoutes = require("./routing/home");
const { STATUS_CODE } = require("./constants/statusCode");
const { MENU_LINKS } = require("./constants/navigation");
const cartController = require("./controllers/cartController");

const app = express();

// Konfiguracja silnika widoków
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // bezpieczna ścieżka absolutna

// Statyczne pliki (CSS, obrazy itd.)
app.use(express.static(path.join(__dirname, "public"))); // bezpieczna ścieżka absolutna

// Parsowanie formularzy
app.use(bodyParser.urlencoded({ extended: false }));

// Logger middleware
app.use((request, _response, next) => {
  const { url, method } = request;
  logger.getInfoLog(url, method);
  next();
});

// Routing
app.use("/products", productsRoutes);
app.use("/logout", logoutRoutes);
app.use("/kill", killRoutes);
app.use(homeRoutes);

// Obsługa błędów 404
app.use((request, response) => {
  const { url } = request;
  const cartCount = cartController.getProductsCount();

  response.status(STATUS_CODE.NOT_FOUND).render("404", {
    headTitle: "404",
    menuLinks: MENU_LINKS,
    activeLinkPath: "",
    cartCount,
  });

  logger.getErrorLog(url);
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
