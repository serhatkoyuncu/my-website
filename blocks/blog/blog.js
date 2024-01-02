import { createOptimizedPicture } from "../../scripts/aem.js";

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement("ul");
  [...block.children].forEach((row, index) => {
    const li = document.createElement("li");
    li.id = `subject-${index + 1}`;
    li.addEventListener("click", function (e) {
      if (!li.closest("div").classList.contains("content")) {
        window.location.href = `?content=${e.target.closest("li").id}`;
      }
    });
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector("picture"))
        div.className = "blog-card-image";
      else div.className = "blog-card-body";
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
  if (window.location.search) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const content = urlParams.get("content");
    if (block.classList.contains(content)) {
      block.style.display = "block";
    } else {
      block.style.display = "none";
    }
    const backButton = document.createElement("button");
    backButton.innerText = "Back";
    backButton.className = "button-back";
    backButton.onclick = () => {
      window.history.back();
    };
    block.prepend(backButton);
  }
}
