export const PUPPETEER_OPTIONS = {
  headless: true,
  // See https://github.com/puppeteer/puppeteer/issues/3938 and https://github.com/puppeteer/puppeteer/issues/1718
  args: [
    "--deterministic-fetch",
    "--disable-canvas-aa",
    "--disable-2d-canvas-clip-aa",
    "--disable-gl-drawing-for-tests",
    "--disable-dev-shm-usage",
    "--use-gl=swiftshader",
    "--enable-webgl",
    "--hide-scrollbars",
    "--mute-audio",
    "--no-first-run",
    "--disable-infobars",
    "--disable-breakpad",
    "--user-data-dir=./chrome_data", // created in index.js
  ],
};

export const TIMEOUT_MS = {
  MIN: 500,
  MAX: 60000,
};

export const PS_MONTHLY_GAMES_URLS =
  "https://www.playstation.com/pt-br/ps-plus/this-month-on-ps-plus/";

export const PS_SCRAPING = {
  URL: {
    SELECTOR: ".cmp-experiencefragment--your-latest-monthly-games a",
    VALUE: "href",
  },
  TITLE: {
    SELECTOR: ".game-hero__title-content h1",
    VALUE: "innerHTML",
  },
  DESCRIPTION: {
    SELECTOR: ".game-overview__description p",
    VALUE: "innerHTML",
  },
  PRICE: {
    SELECTOR: ".game-hero__title-content label:first-child .psw-t-title-m",
    VALUE: "innerHTML",
  },
  EXPIRATION: {
    SELECTOR: "span.psw-t-overline > span > span:last-child",
    VALUE: "innerHTML",
  },
  IMAGE: {
    SELECTOR: "#buynow article:last-child img[srcset]",
    VALUE: "src",
  },
  TRAILER: {
    SELECTOR: ".game-hero__gallery .media-block__overlay a",
    VALUE: "href",
  },
};
