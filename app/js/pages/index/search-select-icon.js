const searchSelect = document.querySelector("#search-target");
const bookIcon = document.querySelector(".ep--collection");
const authorIcon = document.querySelector(".ep--avatar");

const defineIcon = () => {
  if (window.innerWidth < 1340) {
    bookIcon.style.display =
      searchSelect.value === "book" ? "inline-block" : "none";
    authorIcon.style.display =
      searchSelect.value === "author" ? "inline-block" : "none";
  } else {
    bookIcon.style.display = "none";
    authorIcon.style.display = "none";
  }
};

searchSelect.addEventListener("change", () => defineIcon());

window.addEventListener("load", () => defineIcon());
window.addEventListener("resize", () => defineIcon());
