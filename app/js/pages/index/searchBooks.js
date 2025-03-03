const baseURIAPI = "https://personal-library-kjm4.onrender.com/api/v1";

const form = document.querySelector("#search-books");
const searchTarget = document.querySelector("#search-target").value;
const searchValue = document.querySelector("#search");

const URIAssembler = (searchTarget) => {
  const param = searchTarget === "book" ? "title" : searchTarget;
  const query = new URLSearchParams([
    [param, searchValue.value],
    ["take", 10],
  ]);
  return new URL(baseURIAPI + "/book/search?" + query.toString());
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!!searchValue.value) {
    const apiURI = URIAssembler(searchTarget);
    const response = await fetch(apiURI);
    if (!response.ok) {
      console.log("FAIL!!!");
    }

    const books = await response.json();
    console.log(books);
  }
});
