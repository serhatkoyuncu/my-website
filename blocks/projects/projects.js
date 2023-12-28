import { createOptimizedPicture } from "../../scripts/aem.js";
/*
 * Embed Block
 * Show videos and social posts directly on your page
 * https://www.hlx.live/developer/block-collection/embed
 */

const loadScript = (url, callback, type) => {
  const head = document.querySelector("head");
  const script = document.createElement("script");
  script.src = url;
  if (type) {
    script.setAttribute("type", type);
  }
  script.onload = callback;
  head.append(script);
  return script;
};

const getDefaultEmbed = (
  url
) => `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 49.25%;">
    <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
      scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;

const embedYoutube = (url, autoplay) => {
  const usp = new URLSearchParams(url.search);
  const suffix = autoplay ? "&muted=1&autoplay=1" : "";
  let vid = usp.get("v") ? encodeURIComponent(usp.get("v")) : "";
  const embed = url.pathname;
  if (url.origin.includes("youtu.be")) {
    [, vid] = url.pathname.split("/");
  }
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 49.25%;">
      <iframe src="https://www.youtube.com${
        vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed
      }" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
  return embedHTML;
};

const embedVimeo = (url, autoplay) => {
  const [, video] = url.pathname.split("/");
  const suffix = autoplay ? "?muted=1&autoplay=1" : "";
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 49.25%;">
      <iframe src="https://player.vimeo.com/video/${video}${suffix}" 
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen  
      title="Content from Vimeo" loading="lazy"></iframe>
    </div>`;
  return embedHTML;
};

const embedTwitter = (url) => {
  const embedHTML = `<blockquote class="twitter-tweet"><a href="${url.href}"></a></blockquote>`;
  loadScript("https://platform.twitter.com/widgets.js");
  return embedHTML;
};

const loadEmbed = (block, link, autoplay) => {
  if (block.classList.contains("embed-is-loaded")) {
    return;
  }

  const EMBEDS_CONFIG = [
    {
      match: ["youtube", "youtu.be"],
      embed: embedYoutube,
    },
    {
      match: ["vimeo"],
      embed: embedVimeo,
    },
    {
      match: ["twitter"],
      embed: embedTwitter,
    },
  ];

  const config = EMBEDS_CONFIG.find((e) =>
    e.match.some((match) => link.includes(match))
  );
  const url = new URL(link);
  if (config) {
    block.innerHTML = config.embed(url, autoplay);
    block.classList = `block embed embed-${config.match[0]}`;
  } else {
    block.innerHTML = getDefaultEmbed(url);
    block.classList = "block embed";
  }
  block.classList.add("embed-is-loaded");
};

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement("ul");
  [...block.children].forEach((row) => {
    const li = document.createElement("li");
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector("picture")) {
        div.className = "projects-card-image";
        const placeholder = div.querySelector("picture");
        const link = div.querySelector("a").href;
        div.textContent = "";

        if (placeholder) {
          const wrapper = document.createElement("div");
          wrapper.className = "embed-placeholder";
          wrapper.prepend(placeholder);
          div.addEventListener("click", () => {
            loadEmbed(div, link, true);
          });
          // div.addEventListener("mouseleave", () => {
          //   div.textContent = "";
          //   const wrapper = document.createElement("div");
          //   wrapper.className = "embed-placeholder";
          //   wrapper.prepend(placeholder);
          //   div.className = "projects-card-image";
          //   div.append(wrapper);
          // });
          div.append(wrapper);
        } else {
          const observer = new IntersectionObserver((entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              observer.disconnect();
              loadEmbed(div, link);
            }
          });
          observer.observe(div);
        }
      } else div.className = "projects-card-body";
    });
    ul.append(li);
  });

  ul.querySelectorAll("img").forEach((img, index) => {
    img
      .closest("picture")
      .replaceWith(
        createOptimizedPicture(img.src, img.alt, false, [{ width: "750" }])
      );
  });
  block.textContent = "";
  block.append(ul);
}
