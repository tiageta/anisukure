import htmlParser from "../../interfaces/html-parser.js";
import { XBOX_EXPIRATION_DAY, XBOX_MONTHLY_GAMES_URLS } from "./constants.js";
import request from "../../interfaces/requests.js";

export async function searchXboxGames() {
  try {
    const response = await request.get(XBOX_MONTHLY_GAMES_URLS);
    const heroInfo = JSON.parse(response.data.replace("allHeroes = ", ""))
      .locales["pt-br"];
    const numberOfGames = parseInt(heroInfo.keyNumberofheroes);
    const games = [];

    for (let i = 1; i <= numberOfGames; i++) {
      const dataObj = {};
      dataObj["url"] = localizeUrl(heroInfo[`keyHero${i}link`]);
      dataObj["title"] = heroInfo[`keyHero${i}headline`];
      dataObj["img"] = heroInfo[`keyHero${i}imagedesktop`];
      dataObj["expiration"] = generateExpirationDate();
      dataObj["description"] = await getDescriptionFromUrl(dataObj["url"]);

      games.push(dataObj);
    }

    return games;
  } catch (err) {
    console.error(err);
    throw new Error(
      "Failed to retrieve data from Xbox with the following error message: \n" +
        err
    );
  }
}

const localizeUrl = (url, loc = "pt-BR") => {
  if (url.includes(loc)) return url;

  const bareUrl = url.replace(/(?<=\.com)(.*?)(?=\/games)/g, ""); // removes any other loc that may be between .com and /games
  const indexToAppendLoc = bareUrl.indexOf(".com") + ".com".length;
  if (indexToAppendLoc === -1) return url;
  const localizedUrl =
    bareUrl.slice(0, indexToAppendLoc) +
    `/${loc}` +
    bareUrl.slice(indexToAppendLoc);
  return localizedUrl;
};

const generateExpirationDate = () => {
  // Expiration Date; assumes fixed day of the month since microsoft does not provide infomration
  const hasExpirationDayPassed = new Date().getDate() > XBOX_EXPIRATION_DAY;
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

  return nextExpirationDate;
};

const getDescriptionFromUrl = async (url) => {
  try {
    const response = await request.get(url);
    const rawHtml = response.data;
    if (typeof rawHtml !== "string") return;
    const sanitizedHtml = rawHtml.slice(
      rawHtml.indexOf('<div id="root">'),
      rawHtml.indexOf('<div id="authContainer"/>')
    );
    const root = htmlParser(sanitizedHtml);
    const descriptionContainer = root.querySelector(".jumpgcontainer");
    const description =
      descriptionContainer?.querySelector(".c-paragraph-1")?.text;
    return description;
  } catch (err) {
    console.error(err);
    throw new Error(
      "Failed to retrieve game description with the following error: \n" + err
    );
  }
};
