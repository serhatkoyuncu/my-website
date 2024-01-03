export default function decorate(block) {
  //   const cols = [...block.firstElementChild.children];
  //   block.classList.add(`banner-${cols.length}-cols`);

  // setup image banner
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const a = col.querySelectorAll("a");
      const pic = col.querySelector("picture");
      const br = document.createElement("br");
      const h3 = col.querySelectorAll("h3");
      const newH3 = document.createElement("h3");
      if (a.length) {
        a.forEach((item) => {
          if (!item.href.startsWith("tel")) {
            item.setAttribute("target", "_blank");
          }
        });
      }
      if (h3.length) {
        h3.forEach((item) => {
          newH3.append(br);
          newH3.append(item.textContent);
          item.remove();
        });
        col.prepend(newH3);
      }
      if (pic) {
        const picWrapper = pic.closest("div");
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add("banner-img");
        } else {
          picWrapper.classList.add("banner-inline-img");
        }
      }
    });
  });
}
