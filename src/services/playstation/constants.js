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
    SELECTOR: ".psw-t-overline > span > span:last-child",
    VALUE: "innerHTML",
  },
  IMAGE: {
    SELECTOR: "img.psw-top-right:last-child",
    VALUE: "src",
  },
  TRAILER: {
    SELECTOR: ".game-hero__gallery .media-block__overlay a",
    VALUE: "href",
  },
};
