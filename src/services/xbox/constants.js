export const XBOX_MONTHLY_GAMES_URLS =
  "https://www.xbox.com/pt-BR/xbox-game-pass/games/";

export const XBOX_EXPIRATION_DAY = 15; // day of month game pass monthly games expire

export const XBOX_SCRAPING = {
  URL: {
    SELECTOR: "li[id^=hero-] a",
    VALUE: "href",
  },
  TITLE: {
    SELECTOR: ".m-hero-item h1",
    VALUE: "innerHTML",
  },
  DESCRIPTION: {
    SELECTOR: ".jumpgcontainer p.c-paragraph-1",
    VALUE: "innerHTML",
  },
  PRICE: {
    SELECTOR: "span.priceareas:first-child h4",
    VALUE: "innerText",
  },
  IMAGE: {
    SELECTOR: ".custompsimage > img",
    VALUE: "src",
  },
};
