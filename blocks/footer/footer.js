import { getMetadata } from "../../scripts/aem.js";
import { loadFragment } from "../fragment/fragment.js";

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata("footer");
  block.textContent = "";

  // load footer fragment
  const footerPath = footerMeta.footer || "/footer";
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  const footer = document.createElement("div");
  while (fragment?.firstElementChild) footer.append(fragment.firstElementChild);
  const a = footer.querySelectorAll("a");
  if (a.length) {
    a.forEach((item) => {
      item.target = "_blank";
      if (item.href.indexOf("www") === -1) {
        item.title = item.href.slice(
          item.href.indexOf("://") + 3,
          item.href.indexOf(".com")
        );
      } else {
        item.title = item.href.slice(
          item.href.indexOf("www.") + 4,
          item.href.indexOf(".com")
        );
      }
    });
  }
  block.append(footer);
}
