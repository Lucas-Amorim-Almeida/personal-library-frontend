const searchForm = document.querySelector("#search-books");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchTarget = document.querySelector("#search-target").value;
  const searchValue = document.querySelector("#search").value;

  if (!searchValue) {
    return;
  }

  window.location.href = `./search.html?searchTarget=${searchTarget}&searchValue=${searchValue}`;
});
