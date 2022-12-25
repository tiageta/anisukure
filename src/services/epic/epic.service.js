import bluebird from "bluebird";
import {
  withBrowser,
  withPage,
  waitAndSelectOrNullIfTimeout,
  waitAndSelectArrayOrNullIfTimeout,
} from "../../utils/scraper.js";
import {
  EPIC_BASE_URL,
  EPIC_MONTHLY_GAMES_URLS,
  EPIC_SCRAPING,
} from "./constants.js";

export async function searchEpicGames() {
  try {
    // Creates mock browser to load JS
    return withBrowser(async (browser) => {
      // First fetch games' urls
      const bareUrls = await withPage(browser)(async (page) => {
        await page.goto(EPIC_MONTHLY_GAMES_URLS);

        return waitAndSelectArrayOrNullIfTimeout(
          page,
          EPIC_SCRAPING.URL.SELECTOR,
          EPIC_SCRAPING.URL.VALUE
        );
      });
      const urls = bareUrls.map((url) => EPIC_BASE_URL + url);
      console.log(urls);

      if (urls === null) return; // no games found

      // Navigate to each url and retrieve additional information
      return bluebird.map(
        urls,
        (url) =>
          withPage(browser)(async (page) => {
            // Data object to store information
            const dataObj = { link: url };

            // // Navigate to url
            // await page.goto(url);

            // // Game title
            // dataObj["title"] = await waitAndSelectOrNullIfTimeout(
            //   page,
            //   EPIC_SCRAPING.TITLE.SELECTOR,
            //   EPIC_SCRAPING.TITLE.VALUE
            // );

            // // Description
            // dataObj["description"] = await waitAndSelectOrNullIfTimeout(
            //   page,
            //   EPIC_SCRAPING.DESCRIPTION.SELECTOR,
            //   EPIC_SCRAPING.DESCRIPTION.VALUE
            // );

            // // Original price
            // dataObj["price"] = await waitAndSelectOrNullIfTimeout(
            //   page,
            //   EPIC_SCRAPING.PRICE.SELECTOR,
            //   EPIC_SCRAPING.PRICE.VALUE
            // );

            // // Expiration Date
            // const dateRegexp = /(\d+\/\d+\/\d+)/g;
            // const dirtyDate = await waitAndSelectOrNullIfTimeout(
            //   page,
            //   EPIC_SCRAPING.EXPIRATION.SELECTOR,
            //   EPIC_SCRAPING.EXPIRATION.VALUE
            // );
            // dataObj["expiration"] =
            //   dirtyDate !== null && dirtyDate.match(dateRegexp)
            //     ? dirtyDate.match(dateRegexp)[0]
            //     : null;

            // // Image URL
            // dataObj["image"] = await waitAndSelectOrNullIfTimeout(
            //   page,
            //   EPIC_SCRAPING.IMAGE.SELECTOR,
            //   EPIC_SCRAPING.IMAGE.VALUE
            // );

            // // Trailer URL
            // dataObj["trailer"] = null;

            return dataObj;
          }),
        { concurrency: 2 }
      );
    });
  } catch (err) {
    console.error(`Error while scraping free monthly games: ${err.message}`);
    return null;
  }
}
