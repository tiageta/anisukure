import puppeteer, { TimeoutError } from "puppeteer";
import bluebird from "bluebird";
import {
  TIMEOUT_MS,
  PS_MONTHLY_GAMES_URLS,
  PS_SCRAPING,
  PUPPETEER_OPTIONS,
} from "./constants.js";

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

/**
 * Handle to safely open and close browser despite callback result
 * @param {Function} cb Callback that may use created browser
 * @returns {any} Result of callback or null in case of error
 */
const withBrowser = async (cb) => {
  const browser = await puppeteer.launch(PUPPETEER_OPTIONS);
  try {
    return await cb(browser);
  } catch (err) {
    console.error(`Error using browser in callback: ${err.message}`);
    return null;
  } finally {
    await browser.close();
  }
};

/**
 * Handle to safely open and close page despite callback result
 * @param {puppeteer.Browser} browser Browser to be passed down to created page
 * @returns {Function} Function to receive callback to be executed with page and browser available, returning result of callback or null in case of error
 */
const withPage = (browser) => async (cb) => {
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on("request", (req) => {
    if (
      req.resourceType() === "stylesheet" ||
      req.resourceType() === "font" ||
      req.resourceType() === "image"
    )
      req.abort();
    else req.continue();
  });
  try {
    return await cb(page);
  } catch (err) {
    console.error(`Error using page in callback: ${err.message}`);
    return null;
  } finally {
    await page.close();
  }
};

/**
 * Waits for selector to load and returns value from selector based on evalStr or null if timeout
 * @param {puppeteer.Page} page puppeteer page to search for selector
 * @param {puppeteer.Selector} selector puppeteer string corresponding to a DOM element selector
 * @param {string} evalStr string corresponding to DOM property present in selector
 * @param {int} timeout timeout for null return
 * @returns evalStr value in selector or null if timeout
 */
const waitAndSelectOrNullIfTimeout = async (
  page,
  selector,
  evalStr,
  timeout = TIMEOUT_MS.MAX
) => {
  try {
    await page.waitForSelector(selector, { timeout });
    return page.$eval(selector, (el, evalStr) => el[evalStr], evalStr);
  } catch (err) {
    if (err instanceof TimeoutError) return null; // Does not stop pipe if timeout
    throw err;
  }
};

/**
 * Waits for selector to load and returns array from selector based on evalStr or null if timeout
 * @param {puppeteer.Page} page puppeteer page to search for selector
 * @param {puppeteer.Selector} selector puppeteer string corresponding to a DOM element selector
 * @param {string} evalStr string corresponding to DOM property present in selector
 * @param {int} timeout timeout for null return
 * @returns evalStr value in selector or null if timeout
 */
const waitAndSelectArrayOrNullIfTimeout = async (
  page,
  selector,
  evalStr,
  timeout = TIMEOUT_MS.MAX
) => {
  try {
    await page.waitForSelector(selector, { timeout });
    return page.$$eval(
      selector,
      (list, evalStr) => list.map((el) => el[evalStr]),
      evalStr
    );
  } catch (err) {
    if (err instanceof TimeoutError) return null; // Does not stop pipe if timeout
    throw err;
  }
};
