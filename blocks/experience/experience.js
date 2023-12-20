export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`experience-${cols.length}-cols`);

  // setup image experience
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector("picture");
      if (pic) {
        const picWrapper = pic.closest("div");
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add("experience-img-col");
        } else {
          picWrapper.classList.add("experience-col");
        }
      }
    });
  });
}
