const addBook = document.querySelector("#add-book");
addBook.addEventListener("click", () => {
  window.location.href = "./addBook.html";
});

const createCollection = document.querySelector("#create-collection");
createCollection.addEventListener("click", () => {
  document.querySelector(".create-collection").style.display = "flex";
});
