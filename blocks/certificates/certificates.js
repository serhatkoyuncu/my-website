import { createOptimizedPicture } from "../../scripts/aem.js";

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement("ul");
  [...block.children].forEach((row, index) => {
    const li = document.createElement("li");
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector("picture"))
        div.className = "certificates-card-image";
      else div.className = "certificates-card-body";
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

  [...ul.children].forEach((li, index) => {
    const modalDiv = document.createElement("div");
    modalDiv.className = "modal";
    modalDiv.id = `modal-${index + 1}`;
    const closeSpan = document.createElement("span");
    closeSpan.className = "close";
    closeSpan.textContent = "X";
    const captionDiv = document.createElement("div");
    captionDiv.className = "caption";
    const modalImg = document.createElement("img");
    modalImg.id = `certificate-${index + 1}`;
    modalImg.className = "modal-content";
    modalDiv.append(closeSpan);
    modalDiv.append(modalImg);
    modalDiv.append(captionDiv);
    li.append(modalDiv);
    li.querySelector("img").addEventListener("click", function () {
      modalDiv.classList.add("fade");
      modalImg.src = this.src;
      captionDiv.innerHTML = this.alt;
    });

    closeSpan.onclick = function () {
      li.querySelector(".modal").classList.remove("fade");
    };
  });

  block.textContent = "";
  block.append(ul);
}
