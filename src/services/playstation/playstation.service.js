import htmlParser from "../../interfaces/html-parser.js";
import { PS_BASE_URL, PS_MONTHLY_GAMES_URLS } from "./constants.js";
import request from "../../interfaces/requests.js";

export async function searchPlaystationGames() {
  try {
    const urls = await getGamesUrls();
    const games = [];
    for (let url of urls) {
      const data = await getDataFromUrl(url);
      games.push(data);
    }
    console.log(games);
    return games;
  } catch (err) {
    console.error(err);
    throw new Error(
      "Failed to retrieve data from Playstation with the following error message: \n" +
        err
    );
  }
}

const getGamesUrls = async () => {
  try {
    const response = await request.get(PS_MONTHLY_GAMES_URLS);

    const rawHtml = response.data;
    if (typeof rawHtml !== "string") return;

    const sanitizedHtml = rawHtml.slice(
      rawHtml.indexOf(`<section id="shared-nav-root">`),
      rawHtml.indexOf(
        `<input type="hidden" name="lastcodedeployed-releaseversion"`
      )
    );

    const root = htmlParser(sanitizedHtml);
    const urlsContainer = root.querySelector(
      ".cmp-experiencefragment--your-latest-monthly-games"
    );
    const anchorNodes = urlsContainer.getElementsByTagName("a");
    const urls = anchorNodes.map((a) => PS_BASE_URL + a.getAttribute("href"));

    return urls;
  } catch (err) {
    throw new Error(
      "Failed to retrieve urls with the following error: \n" + err
    );
  }
};

const getDataFromUrl = async (url) => {
  try {
    const response = await request.get(url);
    const dataObj = { link: url };

    const rawHtml = response.data;
    if (typeof rawHtml !== "string") return;
    const sanitizedHtml = rawHtml.slice(
      rawHtml.indexOf(`<section id="shared-nav-root">`),
      rawHtml.indexOf(
        `<input type="hidden" name="lastcodedeployed-releaseversion"`
      )
    );
    const root = htmlParser(sanitizedHtml);

    const titleContainer = root.querySelector(".game-hero__title-content");
    dataObj["title"] = titleContainer.querySelector("h1")?.text;

    const descriptionContainer = root.querySelector(
      ".game-overview__description"
    );
    dataObj["description"] =
      descriptionContainer?.querySelector("p")?.innerHTML;

    const dateRegexp = /(\d+\/\d+\/\d+)/g;
    const dirtyDate = titleContainer.querySelector(
      '[data-qa="mfeCtaMain#offer1#discountDescriptor"]'
    )?.text;
    dataObj["expiration"] =
      dirtyDate !== undefined && dirtyDate.match(dateRegexp)
        ? dirtyDate.match(dateRegexp)[0]
        : undefined;

    const imageContainer = root.querySelector(".game-hero__keyart");
    dataObj["image"] = imageContainer
      .querySelector("img")
      ?.getAttribute("src")
      ?.replace("?w=54&thumb=true", "");

    return dataObj;
  } catch (err) {
    throw new Error(
      "Failed to retrieve game data with the following error: \n" + err
    );
  }
};
