import { createOptimizedPicture } from "../../scripts/aem.js";

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement("ul");
  [...block.children].forEach((row) => {
    const li = document.createElement("li");
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector("picture"))
        div.className = "projects-card-image";
      else div.className = "projects-card-body";
    });
    ul.append(li);
  });

  const playVideo = (item) => {
    item.target.closest("div").querySelector("video").style.display = "block";
    item.target.closest("div").querySelector("video").play();
    item.target.closest("div").querySelector("picture").style.display = "none";
  };
  const pauseVideo = (item) => {
    item.target.closest("div").querySelector("video").pause();
    item.target.closest("div").querySelector("video").style.display = "none";
    item.target.closest("div").querySelector("picture").style.display = "block";
  };

  ul.querySelectorAll("img").forEach((img, index) => {
    img
      .closest("picture")
      .replaceWith(
        createOptimizedPicture(img.src, img.alt, false, [{ width: "750" }])
      );
  });
  ul.querySelectorAll(".projects-card-image").forEach((item, index) => {
    const video = document.createElement("video");
    const source = document.createElement("source");
    video.id = `video-${index + 1}`;
    video.controls = true;
    source.src = `../../assets/video-${index + 1}.mov`;
    source.type = "video/mp4";
    video.append(source);
    item.append(video);
    item.addEventListener("mouseover", playVideo);
    item.addEventListener("mouseleave", pauseVideo);
  });
  block.textContent = "";
  block.append(ul);
}
