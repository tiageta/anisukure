import bluebird from "bluebird";
import {
  TIMEOUT_MS,
  withBrowser,
  withPage,
  waitAndSelectOrNullIfTimeout,
  waitAndSelectArrayOrNullIfTimeout,
} from "../../utils/scraper.js";
import { PS_MONTHLY_GAMES_URLS, PS_SCRAPING } from "./constants.js";

export async function searchPlayStationGames() {
  try {
    // Creates mock browser to load JS
    return withBrowser(async (browser) => {
      // First fetch games' urls
      const urls = await withPage(browser)(async (page) => {
        await page.goto(PS_MONTHLY_GAMES_URLS);

        return waitAndSelectArrayOrNullIfTimeout(
          page,
          PS_SCRAPING.URL.SELECTOR,
          "href"
        );
      });

      if (urls === null) return null;

      // Navigate to each url and retrieve additional information
      return bluebird.map(
        urls,
        (url) =>
          withPage(browser)(async (page) => {
            // Data object to store information
            const dataObj = { link: url };

            // Navigate to url
            await page.goto(url);

            // Game title
            dataObj["title"] = await await waitAndSelectOrNullIfTimeout(
              page,
              PS_SCRAPING.TITLE.SELECTOR,
              PS_SCRAPING.TITLE.VALUE
            );

            // Description
            dataObj["description"] = await waitAndSelectOrNullIfTimeout(
              page,
              PS_SCRAPING.DESCRIPTION.SELECTOR,
              PS_SCRAPING.DESCRIPTION.VALUE
            );

            // Original price
            dataObj["price"] = await waitAndSelectOrNullIfTimeout(
              page,
              PS_SCRAPING.PRICE.SELECTOR,
              PS_SCRAPING.PRICE.VALUE
            );

            // Expiration Date
            const dateRegexp = /(\d+\/\d+\/\d+)/g;
            const dirtyDate = await waitAndSelectOrNullIfTimeout(
              page,
              PS_SCRAPING.EXPIRATION.SELECTOR,
              PS_SCRAPING.EXPIRATION.VALUE
            );
            dataObj["expiration"] =
              dirtyDate !== null && dirtyDate.match(dateRegexp)
                ? dirtyDate.match(dateRegexp)[0]
                : null;

            // Image URL
            dataObj["image"] = await waitAndSelectOrNullIfTimeout(
              page,
              PS_SCRAPING.IMAGE.SELECTOR,
              PS_SCRAPING.IMAGE.VALUE
            );

            // Trailer URL
            dataObj["trailer"] = await waitAndSelectOrNullIfTimeout(
              page,
              PS_SCRAPING.TRAILER.SELECTOR,
              PS_SCRAPING.TRAILER.VALUE,
              TIMEOUT_MS.MIN // small timeout because it should've already loaded by now, and some games don't have trailers
            );

            return dataObj;
          }),
        { concurrency: 3 }
      );
    });
  } catch (err) {
    console.error(`Error while scraping free monthly games: ${err.message}`);
    return null;
  }
}
