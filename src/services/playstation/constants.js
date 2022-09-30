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
  ],
};

export const TIMEOUT_MS = {
  MIN: 500,
  MAX: 30000,
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
  TRAILER: {
    SELECTOR: ".game-hero__gallery .media-block__overlay a",
    VALUE: "href",
  },
};
