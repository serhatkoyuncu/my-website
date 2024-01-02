import { getMetadata } from "../../scripts/aem.js";
import { loadFragment } from "../fragment/fragment.js";

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata("footer");
  block.textContent = "";

  const scrollButton = document.createElement("button");
  scrollButton.className = "scroll-button";
  scrollButton.title = "Scroll Top";
  scrollButton.onclick = () => {
    document.body.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    document.documentElement.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const topImg = document.createElement("img");
  topImg.src = "../../assets/top.png";
  topImg.alt = "Top Image";
  scrollButton.append(topImg);

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
  block.append(scrollButton);
  window.onscroll = () => {
    if (
      document.body.scrollTop > 300 ||
      document.documentElement.scrollTop > 300
    ) {
      scrollButton.style.display = "block";
    } else {
      scrollButton.style.display = "none";
    }
  };
}
