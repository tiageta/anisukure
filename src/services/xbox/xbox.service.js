import bluebird from "bluebird";
import {
  withBrowser,
  withPage,
  waitAndSelectOrNullIfTimeout,
  waitAndSelectArrayOrNullIfTimeout,
} from "../../utils/scraper.js";
import {
  XBOX_EXPIRATION_DAY,
  XBOX_MONTHLY_GAMES_URLS,
  XBOX_SCRAPING,
} from "./constants.js";

export async function searchXboxGames() {
  try {
    // Creates mock browser to load JS
    return withBrowser(async (browser) => {
      // First fetch games' urls
      const urls = await withPage(browser)(async (page) => {
        await page.goto(XBOX_MONTHLY_GAMES_URLS);

        return waitAndSelectArrayOrNullIfTimeout(
          page,
          XBOX_SCRAPING.URL.SELECTOR,
          XBOX_SCRAPING.URL.VALUE
        );
      });

      if (urls === null) return; // no games found

      // Navigate to each url and retrieve additional information
      return bluebird.map(
        urls,
        (url) =>
          withPage(browser)(async (page) => {
            const localizedUrl = localizeUrl(url);

            // Data object to store information
            const dataObj = { link: localizedUrl };

            // Navigate to url
            await page.goto(localizedUrl);

            // Game title
            dataObj["title"] = await waitAndSelectOrNullIfTimeout(
              page,
              XBOX_SCRAPING.TITLE.SELECTOR,
              XBOX_SCRAPING.TITLE.VALUE
            );

            // Description
            dataObj["description"] = await waitAndSelectOrNullIfTimeout(
              page,
              XBOX_SCRAPING.DESCRIPTION.SELECTOR,
              XBOX_SCRAPING.DESCRIPTION.VALUE
            );

            // Original price
            dataObj["price"] = await waitAndSelectOrNullIfTimeout(
              page,
              XBOX_SCRAPING.PRICE.SELECTOR,
              XBOX_SCRAPING.PRICE.VALUE
            );

            // Expiration Date; assumes fixed day of the month since microsoft does not provide infomration
            const hasExpirationDayPassed =
              new Date().getDate() > XBOX_EXPIRATION_DAY;
            const currentMonth = new Date().getMonth() + 1;
            const expirationMonth = hasExpirationDayPassed
              ? (currentMonth % 12) + 1
              : currentMonth;
            const currentYear = new Date().getFullYear();
            const expirationYear =
              hasExpirationDayPassed && currentMonth === 12
                ? currentYear + 1
                : currentYear;
            const nextExpirationDate = `${XBOX_EXPIRATION_DAY}/${expirationMonth}/${expirationYear}`;
            dataObj["expiration"] = nextExpirationDate;

            // Image URL
            dataObj["image"] = await waitAndSelectOrNullIfTimeout(
              page,
              XBOX_SCRAPING.IMAGE.SELECTOR,
              XBOX_SCRAPING.IMAGE.VALUE
            );

            // Trailer URL; not provided with url by microsoft
            dataObj["trailer"] = null;

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

const localizeUrl = (url, loc = "pt-BR") => {
  if (url.includes(loc)) return url;

  url = url.replace(/(?<=\.com)(.*?)(?=\/games)/g, ""); // removes any other loc that may be between .com and /games
  const indexToAppendLoc = url.indexOf(".com") + ".com".length;
  return (
    url.slice(0, indexToAppendLoc) + `/${loc}` + url.slice(indexToAppendLoc)
  );
};
