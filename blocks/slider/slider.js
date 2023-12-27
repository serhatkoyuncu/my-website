import { createOptimizedPicture } from "../../scripts/aem.js";

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement("ul");
  [...block.children].forEach((row) => {
    const li = document.createElement("li");
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector("picture"))
        div.className = "about-card-image";
      else div.className = "about-card-body";
    });
    ul.append(li);
  });
  ul.querySelectorAll("img").forEach((img) =>
    img
      .closest("picture")
      .replaceWith(
        createOptimizedPicture(img.src, img.alt, false, [{ width: "750" }])
      )
  );
  block.textContent = "";
  block.append(ul);

  setInterval(function () {
    if (
      block.firstElementChild.scrollLeft ==
      (block.firstElementChild.children.length -
        block.parentElement.offsetWidth / 240) *
        240
    ) {
      block.firstElementChild.scrollBy({
        top: 0,
        left: -block.firstElementChild.scrollLeft,
        behavior: "smooth",
      });
    } else {
      block.firstElementChild.scrollBy({
        top: 0,
        left: 240,
        behavior: "smooth",
      });
    }
  }, 3000);
}
