const uriAPI = "https://personal-library-kjm4.onrender.com/api/v1";

window.addEventListener("load", async () => {
  const queryParams = new URLSearchParams([["take", 50]]);
  const apiURI = new URL(`${uriAPI}/book?${queryParams.toString()}`);
  const response = await fetch(apiURI.toString());

  if (!response.ok) {
    console.error("Erro ao receber livros");
  }

  const books = await response.json();
  console.log(books);
});
