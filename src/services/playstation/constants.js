export const PS_MONTHLY_GAMES_URLS =
  "https://www.playstation.com/pt-br/ps-plus/this-month-on-ps-plus/";

export const PS_SCRAPING = {
  URL: {
    SELECTOR:
      "section.gpdc-section div.cmp-experiencefragment--your-latest-monthly-games a",
    VALUE: "href",
  },
  TITLE: {
    SELECTOR: "div.game-hero__title-content h1",
    VALUE: "innerHTML",
  },
  DESCRIPTION: {
    SELECTOR: "div.game-overview__description p",
    VALUE: "innerHTML",
  },
  PRICE: {
    SELECTOR:
      "div.game-hero__title-content label:first-child span.psw-t-title-m",
    VALUE: "innerHTML",
  },
  TRAILER: {
    SELECTOR: "div.game-hero__gallery div.media-block__overlay a",
    VALUE: "href",
  },
};

export const MIN_TIMEOUT_MS = 500;
export const MAX_TIMEOUT_MS = 30000;
