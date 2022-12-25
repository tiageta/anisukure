import puppeteer, { TimeoutError } from "puppeteer";

export const PUPPETEER_OPTIONS = {
  headless: false,
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
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--user-data-dir=./chrome_data", // created in index.js
  ],
};

export const TIMEOUT_MS = {
  MIN: 500,
  MAX: 30000,
};

/**
 * Handle to safely open and close browser despite callback result
 * @param {Function} cb Callback that may use created browser
 * @returns {any} Result of callback or null in case of error
 */
export const withBrowser = async (cb) => {
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
export const withPage = (browser) => async (cb) => {
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on("console", (msg) => console.log("LOG: " + msg.text()));

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
export const waitAndSelectOrNullIfTimeout = async (
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
export const waitAndSelectArrayOrNullIfTimeout = async (
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
