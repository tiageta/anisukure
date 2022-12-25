export const EPIC_BASE_URL = "https://store.epicgames.com";

export const EPIC_MONTHLY_GAMES_URLS = `${EPIC_BASE_URL}/pt-BR/free-games/`;

export const EPIC_SCRAPING = {
  URL: {
    SELECTOR: "a",
    VALUE: "href",
  },
  TITLE: {
    SELECTOR: "h1 div:first-child span",
    VALUE: "innerText",
  },
  DESCRIPTION: {
    SELECTOR: ".css-1myreog",
    VALUE: "innerHTML",
  },
  PRICE: {
    SELECTOR: ".css-d3i3lr > .css-4jky3p",
    VALUE: "innerText",
  },
  EXPIRATION: {
    SELECTOR: ".css-1146xy9 > .css-iqno47 > span",
    VALUE: "innerHTML",
  },
  IMAGE: {
    SELECTOR: "a[aria-label*='Grátis,'] img",
    VALUE: "src",
  },
};
