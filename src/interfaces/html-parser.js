import { parse } from "node-html-parser";

export default function (htmlData) {
  return parse(htmlData);
}
